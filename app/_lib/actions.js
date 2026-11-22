"use server";

import { redirect } from "next/navigation";
import createClient from "./supabase";
import { revalidatePath } from "next/cache";
import { resend } from "./resend";

export async function signInWithGoogle(formData) {
  const supabase = await createClient();
  const inviteToken = formData.get("invite");

  const callbackUrl = new URL(
    "/auth/callback",
    process.env.NEXT_PUBLIC_SITE_URL,
  );
  if (inviteToken) {
    callbackUrl.searchParams.set("invite", inviteToken);
  }

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: callbackUrl.toString(),
    },
  });

  if (error) {
    console.log(error);
    throw new Error("Could not sign in with Google");
  }

  redirect(data.url);
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/");
}

export async function addPersonalNote(content) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { error } = await supabase
    .from("coach_personal_notes")
    .insert({ coach_id: user.id, content });

  if (error) {
    console.log(error);
    throw new Error("Note could not be saved");
  }

  revalidatePath("/dashboard");
}

export async function deletePersonalNote(noteId) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("coach_personal_notes")
    .delete()
    .eq("id", noteId);

  if (error) {
    console.error(error);
    throw new Error("Note could not be deleted");
  }

  revalidatePath("/dashboard");
}

export async function addCoachNote(clientId, content) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("coach_notes")
    .insert({ client_id: clientId, content });

  if (error) {
    console.log(error);
    throw new Error("Note could not be saved");
  }

  revalidatePath(`/clients/${clientId}`);
}

export async function deleteCoachNote(noteId, clientId) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("coach_notes")
    .delete()
    .eq("id", noteId);

  if (error) {
    console.error(error);
    throw new Error("Note could not be deleted");
  }

  revalidatePath(`/clients/${clientId}`);
}

export async function createProgramWithWeeks(programData) {
  const supabase = await createClient();

  const { error: deactivateErr } = await supabase
    .from("programs")
    .update({ status: "completed" })
    .eq("client_id", programData.clientId)
    .eq("status", "active");

  if (deactivateErr) {
    console.error(deactivateErr);
    throw new Error("Could not update previous program");
  }

  const { data: program, error: programErr } = await supabase
    .from("programs")
    .insert({
      client_id: programData.clientId,
      name: programData.name,
      status: "active",
      start_date: programData.startDate,
    })
    .select()
    .single();

  if (programErr) {
    console.error(programErr);
    throw new Error("Program could not be created");
  }

  for (const week of programData.weeks) {
    for (const day of week.days) {
      const { data: workout, error: workoutErr } = await supabase
        .from("workouts")
        .insert({
          program_id: program.id,
          week_number: week.weekNumber,
          day_number: day.dayNumber,
          name: day.name || `Day ${day.dayNumber}`,
        })
        .select()
        .single();

      if (workoutErr) {
        console.error(workoutErr);
        throw new Error("Workout could not be created");
      }

      const exercisesToInsert = day.exercises
        .filter((ex) => ex.name.trim() !== "")
        .map((ex) => ({
          workout_id: workout.id,
          name: ex.name,
          target_sets: Number(ex.targetSets) || 0,
          target_reps: Number(ex.targetReps) || 0,
          target_weight: ex.targetWeight ? Number(ex.targetWeight) : null,
        }));

      if (exercisesToInsert.length > 0) {
        const { error: exErr } = await supabase
          .from("exercises")
          .insert(exercisesToInsert);

        if (exErr) {
          console.error(exErr);
          throw new Error("Exercises could not be created");
        }
      }
    }

    revalidatePath(`/clients/${programData.clientId}`);
    redirect(`/clients/${programData.clientId}/programs/${program.id}`);
  }
}

export async function checkProgramHasLoggedData(programId) {
  const supabase = await createClient();

  const { count, error } = await supabase
    .from("logged_sets")
    .select("id, exercises!inner(workout_id, workouts!inner(program_id))", {
      count: "exact",
      head: true,
    })
    .eq("exercises.workouts.program_id", programId);

  if (error) {
    console.error(error);
    throw new Error("Could not check program history");
  }

  return count > 0;
}

export async function updateProgramWithWeeks(programId, programData) {
  const supabase = await createClient();

  const { error: programErr } = await supabase
    .from("programs")
    .update({
      name: programData.name,
      start_date: programData.startDate,
    })
    .eq("id", programId);

  if (programErr) {
    console.error(programErr);
    throw new Error("Program could not be updated");
  }

  const { error: deleteErr } = await supabase
    .from("workouts")
    .delete()
    .eq("program_id", programId);

  if (deleteErr) {
    console.error(deleteErr);
    throw new Error("Existing program structure could not be cleared");
  }

  for (const week of programData.weeks) {
    for (const day of week.days) {
      const { data: workout, error: workoutErr } = await supabase
        .from("workouts")
        .insert({
          program_id: programId,
          week_number: week.weekNumber,
          day_number: day.dayNumber,
          name: day.name || `Day ${day.dayNumber}`,
        })
        .select()
        .single();

      if (workoutErr) {
        console.error(workoutErr);
        throw new Error("Workout could not be created");
      }

      const exercisesToInsert = day.exercises
        .filter((ex) => ex.name.trim() !== "")
        .map((ex) => ({
          workout_id: workout.id,
          name: ex.name,
          target_sets: Number(ex.targetSets) || 0,
          target_reps: Number(ex.targetReps) || 0,
          target_weight: ex.targetWeight ? Number(ex.targetWeight) : null,
        }));

      if (exercisesToInsert.length > 0) {
        const { error: exErr } = await supabase
          .from("exercises")
          .insert(exercisesToInsert);

        if (exErr) {
          console.error(exErr);
          throw new Error("Exercise could not be created");
        }
      }
    }
  }

  revalidatePath(`/clients/${programData.clientId}`);
  redirect(`/clients/${programData.clientId}/programs/${programId}`);
}

export async function completeWorkout(workoutId) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const { data: client, error: clientErr } = await supabase
    .from("clients")
    .select("id")
    .eq("profile_id", user.id)
    .single();

  if (clientErr) {
    console.error(clientErr);
    throw new Error("Client record could not be loaded");
  }

  const { error } = await supabase
    .from("workout_completions")
    .upsert(
      { client_id: client.id, workout_id: workoutId },
      { onConflict: "client_id,workout_id", ignoreDuplicates: true },
    );

  if (error) {
    console.error(error);
    throw new Error("Workout could not be complicated");
  }

  revalidatePath("/program");
  revalidatePath("/home");
}

export async function updateCoachName(fullName) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("Not authenticated");

  const { error } = await supabase
    .from("profiles")
    .update({ full_name: fullName })
    .eq("id", user.id);

  if (error) {
    console.error(error);
    throw new Error("Profile could not be updated");
  }

  revalidatePath("/profile");
}

export async function createInvitation({ firstName, lastName, email }) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: coach } = await supabase
    .from("profiles")
    .select("full_name")
    .eq("id", user.id)
    .single();

  const { data: invitation, error } = await supabase
    .from("invitations")
    .insert({
      coach_id: user.id,
      first_name: firstName,
      last_name: lastName,
      email,
    })
    .select()
    .single();

  if (error) {
    console.error(error);
    throw new Error("Invitation could not be created");
  }

  const inviteUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/login?invite=${invitation.token}`;

  const { error: emailError } = await resend.emails.send({
    from: "Rungs <onboarding@resend.dev>",
    to: email,
    subject: `${coach?.full_name ?? "Your coach"} invited you to Rungs`,
    html: `<p>You've been invited to train with ${coach?.full_name ?? "your coach"} on Rungs. </p><p><a href="${inviteUrl}">Accept invitation</a></p>`,
  });

  if (emailError) {
    console.error(emailError);
  }

  return inviteUrl;
}

export async function logSet({ exerciseId, setNumber, reps, weight, rpe }) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const repsNum = Number.parseInt(reps, 10);
  const weightNum = weight === "" || weight == null ? null : Number(weight);
  const rpeNum = rpe === "" || rpe == null ? null : Number(rpe);

  if (
    !Number.isInteger(repsNum) ||
    repsNum < 0 ||
    Number.isNaN(weightNum) ||
    (weightNum !== null && weightNum < 0) ||
    Number.isNaN(rpeNum) ||
    (rpeNum !== null && (rpeNum < 1 || rpeNum > 10))
  ) {
    throw new Error("Invalid set values");
  }

  const { data: client, error: clientErr } = await supabase
    .from("clients")
    .select("id")
    .eq("profile_id", user.id)
    .single();

  if (clientErr) {
    console.error(clientErr);
    throw new Error("Client record could not be loaded");
  }

  const { error } = await supabase.from("logged_sets").upsert(
    {
      client_id: client.id,
      exercise_id: exerciseId,
      set_number: setNumber,
      actual_reps: repsNum,
      actual_weight: weightNum,
      actual_rpe: rpeNum,
      logged_at: new Date().toISOString(),
    },
    { onConflict: "client_id,exercise_id,set_number" },
  );

  if (error) {
    console.error(error);
    throw new Error("Set could not be saved");
  }
}

// Paste into app/_lib/actions.js (it already has "use server" at the top
// and imports createClient and revalidatePath).

export async function updateAvatar(formData) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const file = formData.get("avatar");
  const allowedTypes = ["image/jpeg", "image/png", "image/webp"];

  if (!(file instanceof File) || file.size === 0) {
    throw new Error("No image received");
  }
  if (!allowedTypes.includes(file.type)) {
    throw new Error("Unsupported image type");
  }
  if (file.size > 1024 * 1024) {
    throw new Error("Image is too large");
  }

  const extension =
    file.type === "image/png"
      ? "png"
      : file.type === "image/webp"
        ? "webp"
        : "jpg";

  // A new file name every time, so browsers and the CDN never show a
  // cached copy of the previous photo.
  const path = `${user.id}/avatar-${Date.now()}.${extension}`;

  const { error: uploadErr } = await supabase.storage
    .from("avatars")
    .upload(path, file, { contentType: file.type, cacheControl: "31536000" });

  if (uploadErr) {
    console.error(uploadErr);
    throw new Error("Photo could not be uploaded");
  }

  const {
    data: { publicUrl },
  } = supabase.storage.from("avatars").getPublicUrl(path);

  const { error: updateErr } = await supabase
    .from("profiles")
    .update({ avatar_url: publicUrl })
    .eq("id", user.id)
    .select("id")
    .single();

  if (updateErr) {
    console.error(updateErr);
    await supabase.storage.from("avatars").remove([path]); // don't leave an orphan
    throw new Error("Photo could not be saved");
  }

  // Best-effort cleanup: delete this user's older photos.
  const { data: existing } = await supabase.storage
    .from("avatars")
    .list(user.id);
  const stale = (existing ?? [])
    .map((f) => `${user.id}/${f.name}`)
    .filter((p) => p !== path);
  if (stale.length > 0) {
    await supabase.storage.from("avatars").remove(stale);
  }

  revalidatePath("/", "layout");
}

export async function saveAthleteProfile(values) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  // Everything from the browser is untrusted, so it's all re-checked here.
  const fullName = String(values.fullName ?? "").trim();
  if (!fullName || fullName.length > 80) throw new Error("Invalid name");

  const toNumber = (value) =>
    value === "" || value == null ? null : Number(value);

  const heightCm = toNumber(values.heightCm);
  if (heightCm !== null && !(heightCm >= 50 && heightCm <= 260)) {
    throw new Error("Invalid height");
  }

  const bodyweightKg = toNumber(values.bodyweightKg);
  if (bodyweightKg !== null && !(bodyweightKg >= 20 && bodyweightKg <= 400)) {
    throw new Error("Invalid bodyweight");
  }

  const dateOfBirth = values.dateOfBirth || null;
  if (dateOfBirth !== null) {
    const parsed = new Date(`${dateOfBirth}T00:00:00`);
    if (
      Number.isNaN(parsed.getTime()) ||
      parsed > new Date() ||
      parsed < new Date("1900-01-01T00:00:00")
    ) {
      throw new Error("Invalid date of birth");
    }
  }

  const cleanText = (value, max) => {
    const text = String(value ?? "").trim();
    if (text.length > max) throw new Error("Text is too long");
    return text || null;
  };

  const { error: profileErr } = await supabase
    .from("profiles")
    .update({
      full_name: fullName,
      date_of_birth: dateOfBirth,
      height_cm: heightCm,
      primary_goal: cleanText(values.primaryGoal, 200),
      training_experience: cleanText(values.trainingExperience, 100),
      weekly_availability: cleanText(values.weeklyAvailability, 100),
      injuries: cleanText(values.injuries, 1000),
      updated_at: new Date().toISOString(),
    })
    .eq("id", user.id)
    .select("id")
    .single();

  if (profileErr) {
    console.error(profileErr);
    throw new Error("Profile could not be saved");
  }

  // Bodyweight lives in body_weight_logs (one row per weigh-in), so a new
  // entry is only added when the number actually changed.
  if (bodyweightKg !== null) {
    const { data: client } = await supabase
      .from("clients")
      .select("id")
      .eq("profile_id", user.id)
      .maybeSingle();

    if (client) {
      const { data: latest } = await supabase
        .from("body_weight_logs")
        .select("weight")
        .eq("client_id", client.id)
        .order("logged_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (!latest || Number(latest.weight) !== bodyweightKg) {
        const { error: weightErr } = await supabase
          .from("body_weight_logs")
          .insert({ client_id: client.id, weight: bodyweightKg });

        if (weightErr) {
          console.error(weightErr);
          throw new Error("Bodyweight could not be saved");
        }
      }
    }
  }

  revalidatePath("/", "layout");
}
