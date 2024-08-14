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
  const [isBouncing, setIsBouncing] = useState(false);
  const [optimisticLikes, addOptimisticLike] = useOptimistic<Like[]>(
    post.likes,
    // @ts-ignore
    (state: Like[], newLike: Like) =>
      state.some((like) => like.userId === userId && like.postId === post.id)
        ? state.filter((like) => like.userId !== userId)
        : [...state, newLike]
  );

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    if (!optimisticLikes.some((like) => like.userId === userId && like.postId === post.id)) {
      setIsBouncing(true);
      setTimeout(() => setIsBouncing(false), 400); // Bounce back to original size
    }
  };

  const handleLike = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const postId = formData.get('postId') as string;

    // Check if the post is currently liked
    const isCurrentlyLiked = optimisticLikes.some(
      (like) => like.userId === userId && like.postId === post.id
    );

    // Add/remove like optimistically
    addOptimisticLike({ userId, postId });

    // Trigger bounce effect only if it's being liked, not unliked
    if (!isCurrentlyLiked) {
      setIsBouncing(true);
      setTimeout(() => setIsBouncing(false), 400); // Bounce back to original size
    }

    try {
      await likePost(postId);
    } catch (error) {
      // Handle error if necessary
    }
  };

  return (
    <div className='flex flex-col'>
      <form onSubmit={handleLike}>
        <input type='hidden' name='postId' value={post.id} />

        <ActionIcon>
          <Heart
            className={cn(iconSize, {
              'text-red-500 fill-red-500 transition-none': // Immediate color change
                optimisticLikes.some((like) => like.userId === userId && like.postId === post.id),
              'hover:opacity-60 transition-opacity duration-200': isHovered && !optimisticLikes.some((like) => like.userId === userId && like.postId === post.id),
              'transform scale-125 transition-transform duration-300 ease-out': isBouncing, // Bigger bounce when liked
              'transform scale-100': !isHovered && !isBouncing, // No bounce when unliked
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
