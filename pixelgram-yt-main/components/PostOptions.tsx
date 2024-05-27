'use client';

import SubmitButton from '@/components/SubmitButton';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { deletePost } from '@/lib/actions';
import { PostWithExtras } from '@/lib/definitions';
import { cn } from '@/lib/utils';
import { Link2, MoreHorizontal } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

type Props = {
  post: PostWithExtras;
  userId?: string;
  className?: string;
};

function PostOptions({ post, userId, className }: Props) {
  const isPostMine = post.userId === userId;

  return (
    <Dialog >
      <DialogTrigger asChild>
        <MoreHorizontal
          className={cn(
            'size-5 cursor-pointer dark:text-neutral-400',
            className
          )}
        />
      </DialogTrigger>
      <DialogContent className='dialogContent rounded-3xl h-fit'>
        {isPostMine && (
          <form
            action={async (formData) => {
              const { message } = await deletePost(formData);
              toast(message);
            }}
            className='postOption '
          >
            <input type='hidden' name='id' value={post.id} />
            <SubmitButton className='text-red-500  font-bold disabled:cursor-not-allowed w-full p-4 '>
              Delete post
            </SubmitButton>
          </form>
        )}

        {isPostMine && (
          <Link
            scroll={false}
            href={`/dashboard/p/${post.id}/edit`}
            className='postOption  p-4'
          >
            Edit
          </Link>
        )}

        <form
          action=''
          className='postOption  flex flex-col divide-y-[1px] dark:divide-white/20'
        >
          <button
            className={`w-full p-4 font-medium ${
              isPostMine ? '' : 'text-red-500'
            }`}
          >
            Report
          </button>
          <button className='w-full p-4 '>
            {' '}
            <Link scroll={false} href={`/dashboard/p/${post.id}`} className=''>
              Go to post
            </Link>
          </button>
          <button className='w-full p-4 '>Share to</button>
          <button
            className='w-full p-4'
            onClick={(e) => {
              e.preventDefault();
              navigator.clipboard.writeText(
                `${window.location.origin}/dashboard/p/${post.id}`
              );
              toast('Link copied to clipboard', {
                icon: <Link2 className={'h-5 w-5'} />,
              });
            }}
          >
            Copy link
          </button>
          <button className='w-full p-4 '>Embed</button>
          <button className='w-full p-4 '>About this account</button>
          <button className='w-full p-4 '>Cancel</button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default PostOptions;
