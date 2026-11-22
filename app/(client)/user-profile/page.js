import ChangePhotoButton from "@/app/_components/ChangePhotoButton";
import ProfileDetailsForm from "@/app/_components/ProfileDetailsForm";
import SetPageTitle from "@/app/_components/SetPageTitle";
import { signOut } from "@/app/_lib/actions";
import {
  getAthleteProfileDetails,
  getOwnClientRecord,
} from "@/app/_lib/data-service";
import { Avatar } from "@/app/_utils/helpers";
import { format } from "date-fns";

export const metadata = {
  title: "Profile",
};

async function Page() {
  const client = await getOwnClientRecord();
  const details = await getAthleteProfileDetails(client.id);

  const coachFirstName = client.coach.full_name?.split(" ")[0] ?? "your coach";
  const lastUpdated = details.updated_at
    ? format(new Date(details.updated_at), "MMMM d, yyyy")
    : null;

  return (
    <div className="flex flex-col gap-6 sm:gap-8">
      <SetPageTitle title="Profile" />

      <div className="flex flex-col gap-2">
        <p className="uppercase text-slate text-xs font-semibold">
          your account
        </p>
        <h1 className="text-3xl font-semibold tracking-tight">Profile</h1>
        <p className="text-slate text-sm">
          Your details, training goals, and preferences.
        </p>
      </div>

      <div className="flex items-center gap-4 border border-steel rounded-lg p-4.5">
        <Avatar
          client={{
            avatarUrl: details.avatar_url,
            profiles: { full_name: details.full_name },
          }}
          width={64}
          height={64}
          radius={"rounded-full"}
          textSize="text-2xl"
        />
        <div className="flex flex-col gap-1">
          <p className="font-semibold text-xl">{client.profiles.full_name}</p>
          <p className="text-slate text-xs">
            Training with {client.coach.full_name} since{" "}
            {format(new Date(client.joined_at), "MMM d, yyyy")}
          </p>
          <ChangePhotoButton />
        </div>

        <div className="hidden lg:flex items-center justify-between ml-auto bg-iron-100 px-2 py-1 rounded-full ">
          <p className="text-xs font-medium text-iron">Athlete account</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <ProfileDetailsForm
            details={details}
            coachFirstName={coachFirstName}
            lastUpdated={lastUpdated}
          />
        </div>

        <div className="flex flex-col gap-6 lg:self-start">
          <div className="rounded-xl border border-steel">
            <div className="border-b border-steel px-4.5 py-3.5">
              <h2 className="font-medium">Your coach</h2>
            </div>

            <div className="flex items-center gap-3.5 p-4.5">
              <Avatar
                client={{
                  avatarUrl: client.coach.avatar_url,
                  profiles: { full_name: client.coach.full_name },
                }}
                width={40}
                height={40}
                radius={"rounded-full"}
                textSize="text-sm"
              />
              <div className="flex flex-col">
                <p className="font-medium">{client.coach.full_name}</p>
                <p className="text-xs text-slate">Strength coach</p>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-steel">
            <div className="border-b border-steel px-4.5 py-3.5">
              <h2 className="font-medium">Account &amp; security</h2>
            </div>

            <div className="flex flex-col gap-3 p-4.5">
              <p className="text-sm text-slate">
                You sign in with Google, so there&apos;s no password to manage
                here. Your email address belongs to that Google account.
              </p>

              <form action={signOut}>
                <button
                  type="submit"
                  className="text-sm font-medium text-rust hover:underline cursor-pointer"
                >
                  Sign out
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Page;
