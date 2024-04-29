'use client';

import { likePost } from '@/lib/actions';
import { PostWithExtras } from '@/lib/definitions';
import { cn } from '@/lib/utils';
import { Like } from '@prisma/client';
import { Heart } from 'lucide-react';
import { useOptimistic, useState } from 'react';
import ActionIcon from './ActionIcon';

interface LikeButtonProps {
  post: PostWithExtras;
  userId?: string;
  showLikesText?: boolean;
  iconSize?: string;
}

function LikeButton({
  post,
  userId,
  showLikesText = true,
  iconSize = 'h-6 w-6',
}: LikeButtonProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [optimisticLikes, addOptimisticLike] = useOptimistic<Like[]>(
    post.likes,
    // @ts-ignore
    (state: Like[], newLike: Like) =>
      // here we check if the like already exists, if it does, we remove it, if it doesn't, we add it
      state.some((like) => like.userId === userId && like.postId === post.id)
        ? state.filter((like) => like.userId !== userId)
        : [...state, newLike]
  );

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const postId = formData.get('postId') as string;

    addOptimisticLike({ userId, postId });

    try {
      await likePost(postId);
    } catch (error) {
      // Handle error if necessary
    }
  };

  return (
    <div className='flex flex-col'>
      <form onSubmit={handleSubmit}>
        <input type='hidden' name='postId' value={post.id} />

        <ActionIcon >
          <Heart
            className={cn(iconSize, {
              'text-red-500 fill-red-500 transition-transform duration-400':
                optimisticLikes.some((like) => like.userId === userId && like.postId === post.id),
              'hover:opacity-80 hover:scale-90': !isHovered,
              'scale-120': isHovered,
            })}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          />
        </ActionIcon>
      </form>
      {showLikesText && optimisticLikes.length > 0 && (
        <p className='absolute bottom-0 text-sm font-bold dark:text-white'>
          {optimisticLikes.length}{' '}
          {optimisticLikes.length === 1 ? 'like' : 'likes'}
        </p>
      )}
    </div>
  );
}

export default LikeButton;
