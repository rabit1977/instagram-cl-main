'use client'

import { UserWithExtras } from "@/lib/definitions";
import ProfileAvatar from "./ProfileAvatar";
import UserAvatar from "./UserAvatar";
import { useForm } from "react-hook-form";
import { UserSchema } from "@/lib/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

function FeedSideSuggestions  ({ profile }: { profile: UserWithExtras }) {
  const form = useForm<z.infer<typeof UserSchema>>({
    resolver: zodResolver(UserSchema),
    defaultValues: {
      id: profile.id,
      image: profile.image || '',
      name: profile.name || '',
      username: profile.username || '',
      bio: profile.bio || '',
      gender: profile.gender || '',
      website: profile.website || '',
    },
  });
  return (
    <article className="hidden mt-10 max-w-md 2xl:block w-full">
       <div className='items-center justify-between gap-x-24 2xl:flex py-5 rounded-2xl'>
        <div className='flex gap-x-2 items-center'>
          <ProfileAvatar user={profile}>
            <div className='md:w-20 flex md:justify-end'>
              <UserAvatar user={profile} className='w-14 h-14 cursor-pointer' />
            </div>
          </ProfileAvatar>
          <div>
            <p className='font-medium'>{profile.email?.slice(0, 10)}</p>
            <p className='font-medium'>{profile.username}</p>
          </div>
        </div>
        <ProfileAvatar user={profile}>
          <p className='text-white-500 text-sm font-bold cursor-pointer hover:text-white mr-4 text-[#1877F2] px-4 py-3 rounded-2xl'>
            Switch
          </p>
        </ProfileAvatar>
      </div>
    </article>
  );
};

export default FeedSideSuggestions;
