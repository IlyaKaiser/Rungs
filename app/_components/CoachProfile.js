"use client";

import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import SignOutButtonProfile from "./SignOutButtonProfile";
import { HelpCircle, PlusCircle, UserCircle } from "@boxicons/react";
import Link from "next/link";
import { Avatar } from "../_utils/helpers";

function CoachProfile({ coach }) {
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button className="flex items-center gap-2 outline-none cursor-pointer">
          <Avatar
            client={{
              avatarUrl: coach.avatar_url,
              profiles: { full_name: coach.full_name },
            }}
            radius={"rounded-lg"}
            width={42}
            height={42}
          />
        </button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          align="end"
          sideOffset={8}
          className="min-w-[180px] bg-paper border border-steel rounded-xl shadow-md p-1 z-50 data-[side=bottom]:animate-slideDownAndFade data-[side=left]:animate-slideLeftAndFade data-[side=top]:animate-slideUpAndFade data-[side=right]:animate-slideRightAndFade"
        >
          <DropdownMenu.Item className="flex items-center gap-2 font-medium px-3 py-2 text-sm rounded-lg cursor-pointer outline-none hover:bg-slate/10">
            <Link href="/profile" className="flex items-center gap-2">
              <UserCircle height={16} width={16} />
              {coach?.full_name}
            </Link>
          </DropdownMenu.Item>

          {coach?.role === "athlete" ? null : (
            <DropdownMenu.Item className="font-medium px-3 py-2 text-sm rounded-lg cursor-pointer outline-none hover:bg-slate/10">
              <Link href="/invite" className="flex items-center gap-2">
                <PlusCircle height={16} width={16} />
                Add client
              </Link>
            </DropdownMenu.Item>
          )}

          <DropdownMenu.Item className="md:hidden font-medium px-3 py-2 text-sm rounded-lg cursor-pointer outline-none hover:bg-slate/10">
            <Link href="/help" className="flex items-center gap-2">
              <HelpCircle height={16} width={16} />
              Help
            </Link>
          </DropdownMenu.Item>

          <DropdownMenu.Separator className="h-px bg-steel my-1" />

          <DropdownMenu.Item asChild>
            <SignOutButtonProfile />
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}

export default CoachProfile;
