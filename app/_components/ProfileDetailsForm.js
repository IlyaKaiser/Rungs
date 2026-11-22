"use client";

import { useState } from "react";
import { saveAthleteProfile } from "../_lib/actions";

const inputClasses =
  "w-full rounded-xl border border-steel bg-paper px-3 py-2.5 outline-none focus:border-iron";

function Card({ title, aside, footnote, children }) {
  return (
    <div className="rounded-xl border border-steel">
      <div className="flex items-center justify-between border-b border-steel px-4.5 py-3.5">
        <h2 className="font-medium">{title}</h2>
        {aside && <span className="font-mono text-xs text-slate">{aside}</span>}
      </div>

      <div className="flex flex-col gap-4 p-4.5">
        {children}
        {footnote && <p className="text-xs text-slate">{footnote}</p>}
      </div>
    </div>
  );
}

function Field({ label, htmlFor, hint, className = "", children }) {
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      <label htmlFor={htmlFor} className="text-sm text-slate">
        {label}
      </label>
      {children}
      {hint && <p className="text-xs text-slate">{hint}</p>}
    </div>
  );
}

function ProfileDetailsForm({ details, coachFirstName, lastUpdated }) {
  const [values, setValues] = useState({
    fullName: details.full_name ?? "",
    dateOfBirth: details.date_of_birth ?? "",
    heightCm: details.height_cm ?? "",
    bodyweightKg: details.bodyweight ?? "",
    primaryGoal: details.primary_goal ?? "",
    trainingExperience: details.training_experience ?? "",
    weeklyAvailability: details.weekly_availability ?? "",
    injuries: details.injuries ?? "",
  });
  const [isSaving, setIsSaving] = useState(false);
  const [status, setStatus] = useState(null); // saved | error

  function update(field, value) {
    setValues((prev) => ({ ...prev, [field]: value }));
    setStatus(null);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setIsSaving(true);
    setStatus(null);

    try {
      await saveAthleteProfile(values);
      setStatus("saved");
    } catch (err) {
      console.error(err);
      setStatus("error");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <Card
        title="Personal information"
        aside="Visible to your coach"
        footnote={`Your details help ${coachFirstName} tailor your plan. Only you and your coach can see this information.`}
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Full name" htmlFor="full-name">
            <input
              id="full-name"
              value={values.fullName}
              onChange={(e) => update("fullName", e.target.value)}
              maxLength={80}
              required
              className={inputClasses}
            />
          </Field>

          <Field label="Date of birth" htmlFor="date-of-birth">
            <input
              id="date-of-birth"
              type="date"
              value={values.dateOfBirth}
              onChange={(e) => update("dateOfBirth", e.target.value)}
              className={inputClasses}
            />
          </Field>

          <Field
            label="Email address"
            htmlFor="email"
            hint="Managed by your Google account."
            className="sm:col-span-2"
          >
            <input
              id="email"
              value={values.email ?? ""}
              disabled
              readOnly
              className={`${inputClasses} bg-steel/40 text-slate`}
            />
          </Field>

          <Field label="Height (cm)" htmlFor="height">
            <input
              id="height"
              type="number"
              inputMode="decimal"
              step="any"
              min="50"
              max="260"
              value={values.heightCm}
              onChange={(e) => update("heightCm", e.target.value)}
              className={inputClasses}
            />
          </Field>

          <Field label="Bodyweight" htmlFor="bodyweight">
            <input
              id="bodyweight"
              type="number"
              inputMode="decimal"
              step="any"
              min="20"
              max="400"
              value={values.bodyweightKg}
              onChange={(e) => update("bodyweightKg", e.target.value)}
              className={inputClasses}
            />
          </Field>
        </div>
      </Card>

      <Card
        title="Training profile"
        footnote={`Tell ${coachFirstName} if anything changes before your next session.`}
      >
        <Field label="Primary goal" htmlFor="primary-goal">
          <input
            id="primary-goal"
            value={values.primaryGoal}
            onChange={(e) => update("primaryGoal", e.target.value)}
            maxLength={200}
            placeholder="e.g. Build strength for hiking and everyday life"
            className={inputClasses}
          />
        </Field>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Training experience" htmlFor="experience">
            <input
              id="experience"
              value={values.trainingExperience}
              onChange={(e) => update("trainingExperience", e.target.value)}
              maxLength={100}
              placeholder="e.g. Intermediate - 2 years"
              className={inputClasses}
            />
          </Field>

          <Field label="Weekly availability" htmlFor="availability">
            <input
              id="availability"
              value={values.weeklyAvailability}
              onChange={(e) => update("weeklyAvailability", e.target.value)}
              maxLength={100}
              placeholder="e.g. Mon, Wed, Fri - 3 days"
              className={inputClasses}
            />
          </Field>
        </div>

        <Field label="Injuries of considerations" htmlFor="injuries">
          <input
            id="injuries"
            value={values.injuries}
            onChange={(e) => update("injuries", e.target.value)}
            maxLength={1000}
            rows={3}
            className={inputClasses}
          />
        </Field>
      </Card>

      <div className="flex flex-wrap items-center gap-4">
        <button
          type="submit"
          disabled={isSaving || !values.fullName.trim()}
          className="rounded-xl bg-iron px-5 py-3 font-medium text-paper transition-colors hover:bg-iron/80 disabled:opacity-50 cursor-pointer"
        >
          {isSaving ? "Saving..." : "Save changes"}
        </button>

        {status === "saved" && <span className="text-sm text-moss">Saved</span>}
        {status === "error" && (
          <span className="text-sm text-rust">
            Couldn&apos;t save. Check the values and try again.
          </span>
        )}
        {lastUpdated && (
          <span className="text-xs text-slate">Last updated {lastUpdated}</span>
        )}
      </div>
    </form>
  );
}

export default ProfileDetailsForm;
