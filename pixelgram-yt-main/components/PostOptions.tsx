'use client';

import SubmitButton from '@/components/SubmitButton';
import {
  Dialog,
  DialogContent,
  DialogTrigger
} from '@/components/ui/dialog';
import { deletePost } from '@/lib/actions';
import { PostWithExtras, UserWithExtras } from '@/lib/definitions';
import { cn } from '@/lib/utils';
import { Link2, MoreHorizontal } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { toast } from 'sonner';
import AccountInfoDialog from './AccountInfoDialog'; // Import your AccountInfoDialog component

type Props = {
  post: PostWithExtras;
  userId?: string;
  className?: string;
};

function PostOptions({ post, userId, className }: Props) {
  const [accountInfoOpen, setAccountInfoOpen] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const isPostMine = post.userId === userId;

  const handleDeletePost = async () => {
    const formData = new FormData();
    formData.append('id', post.id); // Add the post ID to the formData

    const { message } = await deletePost(formData);
    toast(message);
    setShowConfirmDialog(false); // Close the confirmation dialog after deletion
  };

  const handleDeleteCancel = () => {
    setShowConfirmDialog(false); // Close the confirmation dialog on cancellation
  };

  const handleOpenConfirmDialog = () => {
    setShowConfirmDialog(true); // Open the confirmation dialog for delete
  };

  return (
    <>
      <Dialog open={showConfirmDialog}>
        <DialogContent className='dialogContent rounded-3xl h-fit px-4 text-center'>
          <p className='h-16  py-2'>Are you sure you want to delete this post?</p>
          <div className='flex space-x-4 mt-4'>
            <button
              className='w-full p-4 bg-gray-200 text-gray-700 hover:bg-gray-300 focus:outline-none'
              onClick={handleDeleteCancel}
            >
              Cancel
            </button>
            <SubmitButton
              className='w-full p-4 bg-red-500 text-white hover:bg-red-600 focus:outline-none disabled:cursor-not-allowed'
              onClick={handleDeletePost}
            >
              Delete Post
            </SubmitButton>
          </div>
        </DialogContent>
      </Dialog>
      <Dialog>
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
            <form action={handleOpenConfirmDialog} className='postOption '>
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
              <Link
                scroll={false}
                href={`/dashboard/p/${post.id}`}
                className=''
              >
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
            <button
              className='w-full p-4'
              onClick={(e) => {
                e.preventDefault();
                setAccountInfoOpen(true);
              }}
            >
              About this account
            </button>
            <button className='w-full p-4 '>Cancel</button>
          </form>
        </DialogContent>
        <AccountInfoDialog
          user={post.user as UserWithExtras}
          open={accountInfoOpen}
          onOpenChange={setAccountInfoOpen}
        />
      </Dialog>
    </>
  );
}

export default PostOptions;
