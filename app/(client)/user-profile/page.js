import SetPageTitle from "@/app/_components/SetPageTitle";
import { getOwnClientRecord } from "@/app/_lib/data-service";
import { Avatar } from "@/app/_utils/helpers";

async function Page() {
  const client = await getOwnClientRecord();
  console.log(client);

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
          client={client}
          width={64}
          height={64}
          radius={"rounded-full"}
          textSize="text-2xl"
        />
        <div className="flex flex-col gap-1">
          <p className="font-semibold text-xl">{client.profiles.full_name}</p>
          <p className="text-slate text-xs">
            Training with {client.coach.full_name}.
          </p>
          <p className="font-medium text-xs text-iron">Change photo</p>
        </div>

        <div className="hidden lg:flex items-center justify-between ml-auto bg-iron-100 px-2 py-1 rounded-full ">
          <p className="text-xs font-medium text-iron">Athlete account</p>
        </div>
      </div>
    </div>
  );
}

export default Page;
