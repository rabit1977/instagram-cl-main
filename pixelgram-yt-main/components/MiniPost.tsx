'use client';

import { PostWithExtras } from '@/lib/definitions';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import LikeButton from './Like';
import PostOptions from './PostOptions';
import Timestamp from './Timestamp';
import UserAvatar from './UserAvatar';

function MiniPost({ post }: { post: PostWithExtras }) {
  const username = post.user.username;
  const href = `/dashboard/${username}`;
  const { data: session, status } = useSession();
  const user = session?.user;

  if (!user) return null;

  return (
    <div className='flex items-center justify-between'>
      <div className='group p-3 px-3.5  flex items-start space-x-2.5'>
        <Link href={href}>
          <UserAvatar user={post.user} />
        </Link>
        <div className='space-y-1.5'>
          <div className='flex items-center space-x-1.5 leading-none text-sm'>
            <Link href={href} className='font-semibold'>
              {username}
            </Link>
            <p className='font-medium'>{post.caption}</p>
          </div>
          <div className='flex h-5 items-center space-x-2.5'>
            <Timestamp createdAt={post.createdAt} />
            <PostOptions
              post={post}
              userId={user.id}
              className='hidden group-hover:inline'
            />
          </div>
        </div>
      </div>
      <LikeButton
        post={post}
        userId={user.id}
        showLikesText={false}
        iconSize='h-4 w-4 hover:opacity-70'
      />
    </div>
  );
}

export default MiniPost;
