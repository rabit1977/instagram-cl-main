'use client';

import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { UserWithExtras } from '@/lib/definitions';
import { cn } from '@/lib/utils';
import { Bookmark, Contact, Grid3X3 } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Separator } from './ui/separator';

const profileTabs = [
  {
    title: 'Posts',
    href: '',
    Icon: Grid3X3,
  },
  {
    title: 'Saved',
    href: 'saved',
    Icon: Bookmark,
  },
  {
    title: 'Tagged',
    href: 'tagged',
    Icon: Contact,
  },
];

function ProfileTabs({
  profile,
  isCurrentUser,
}: {
  profile: UserWithExtras;
  isCurrentUser: boolean;
}) {
  const pathname = usePathname();

  return (
      <Tabs defaultValue='posts' className='pt-14 md:pt-32 pb-16'>
      <div className='lg:hidden items-center gap-x-7 flex justify-around'>
              <p className='font-medium flex flex-col items-center'>
                <strong>{profile.posts.length}</strong>
                <span>posts</span>
              </p>

              <Link
                href={`/dashboard/${profile.username}/followers`}
                className='font-medium flex flex-col items-center'
              >
                <strong>{profile.followedBy.length}</strong> 
                <span>

                followers
                </span>
              </Link>

              <Link
                href={`/dashboard/${profile.username}/following`}
                className='font-medium flex flex-col items-center'
              >
                <strong>{profile.following.length}</strong>
                <span>
                 following
                </span>
              </Link>
            </div>
        <TabsList className='p-px bg-zinc-300 dark:bg-neutral-800 h-px w-full gap-x-10'>
          {profileTabs
            .filter((tab) => isCurrentUser || tab.href !== 'saved')
            .map((tab) => {
              const profilePage = `/dashboard/${profile.username}`;
              const isActive =
                tab.href === ''
                  ? pathname === profilePage
                  : pathname === `${profilePage}/${tab.href}`;

              return (
                <TabsTrigger
                  key={tab.href}
                  value={tab.href}
                  className={cn(
                    'flex-col lg:mt-8 mt-14 gap-4 !p-0 data-[state=active]:text-neutral-400',
                    isActive
                      ? '!text-neutral-700 dark:!text-white'
                      : 'text-neutral-400'
                  )}
                  asChild
                >
                  <Link href={`/dashboard/${profile.username}/${tab.href}`}>
                    <Separator
                      className={cn(
                        '!h-px w-20 ',
                        isActive
                          ? '!bg-neutral-700 dark:!bg-white'
                          : 'dark:!bg-neutral-800 bg-zinc-300'
                      )}
                    />
                    <div className='flex items-center'>
                      <tab.Icon className='h-10 w-10 lg:h-3 lg-w-3' />
                      <p className='font-bold text-xs tracking-widest uppercase hidden lg:block'>
                        {tab.title}
                      </p>
                    </div>
                  </Link>
                </TabsTrigger>
              );
            })}
        </TabsList>
      </Tabs>
  );
}

export default ProfileTabs;
