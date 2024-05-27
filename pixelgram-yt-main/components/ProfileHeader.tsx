import { ChevronDown, Settings, UserPlus } from "lucide-react";
import { Button } from "./ui/button";

function ProfileHeader({ username }: { username: string | null }) {
  return (
    <header className=" md:hidden bg-white top-0 flex h-12 items-center dark:bg-neutral-950 w-full z-50 border-b border-zinc-300 dark:border-neutral-700 px-3 py-1">
      <Button size={"icon"} variant={"ghost"}>
        <Settings />
      </Button>

      <div className="flex items-center gap-x-2 mx-auto">
        <p className="font-bold">{username}</p>
        <ChevronDown />
      </div>

      <Button size={"icon"} variant={"ghost"}>
        <UserPlus />
      </Button>
    </header>
  );
}

export default ProfileHeader;
