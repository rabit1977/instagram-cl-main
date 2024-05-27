'use client';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { createComment } from '@/lib/actions';
import { CommentWithExtras } from '@/lib/definitions';
import { CreateComment } from '@/lib/schemas';
import { zodResolver } from '@hookform/resolvers/zod';
import { Comment } from '@prisma/client';
import data from '@emoji-mart/data';
import Picker from '@emoji-mart/react';
import { User } from 'next-auth';
import Image from 'next/image';
import Link from 'next/link';
import {
  useEffect,
  useOptimistic,
  useRef,
  useState,
  useTransition,
} from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

function Comments({
  postId,
  comments,
  user,
}: {
  postId: string;
  comments: CommentWithExtras[];
  user?: User | null;
}) {
  const [showPicker, setShowPicker] = useState(false);
  const pickerRef = useRef<HTMLDivElement>(null); 

  const form = useForm<z.infer<typeof CreateComment>>({
    resolver: zodResolver(CreateComment),
    defaultValues: {
      body: '',
      postId,
    },
  });
  let [isPending, startTransition] = useTransition();
  const [optimisticComments, addOptimisticComment] = useOptimistic<
    CommentWithExtras[]
  >(
    comments,
    // @ts-ignore
    (state: Comment[], newComment: string) => [
      { body: newComment, userId: user?.id, postId, user },
      ...state,
    ]
  );
  const body = form.watch('body');
  const commentsCount = optimisticComments.length;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        pickerRef.current &&
        event.target instanceof Node &&
        !pickerRef.current.contains(event.target)
      ) {
        setShowPicker(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleEmojiSelect = (emoji: any) => {
    const currentBody = form.getValues('body');
    form.setValue('body', currentBody + emoji.native);
    setShowPicker(false);
  };

  return (
    <div className='space-y-0.5 px-3 sm:px-0 relative'>
      {commentsCount > 0 && (
        <Link
          scroll={false}
          href={`/dashboard/p/${postId}`}
          className='text-sm font-medium text-neutral-500'
        >
          View {commentsCount === 1 ? 'comment': `all ${commentsCount} comments`}
        </Link>
      )}

      {optimisticComments.slice(0, 1).map((comment, i) => {
        const username = comment.user?.username;

        return (
          <div
            key={i}
            className='text-sm flex items-center space-x-2 font-medium'
          >
            <Link href={`/dashboard/${username}`} className='font-semibold'>
              {username}
            </Link>
            <p>{comment.body}</p>
          </div>
        );
      })}
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(async (values) => {
            const valuesCopy = { ...values };
            form.reset();
            startTransition(() => {
              addOptimisticComment(valuesCopy.body);
            });

            await createComment(valuesCopy);
          })}
          className='border-b border-gray-300 dark:border-neutral-800 pb-3 py-1 flex items-center space-x-2'
        >
          <FormField
            control={form.control}
            name='body'
            render={({ field, fieldState }) => (
              <FormItem className='w-full flex'>
                <FormControl>
                  <input
                    type='text'
                    placeholder='Add a comment...'
                    className='bg-transparent text-sm border-none  focus:outline-none flex-1 placeholder-neutral-500 dark:text-white dark:placeholder-neutral-400 font-medium'
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {body.trim().length > 0 && (
            <button
              disabled={isPending}
              type='submit'
              className='text-sky-500 text-sm font-semibold hover:text-white disabled:hover:text-sky-500 disabled:cursor-not-allowed'
            >
              Post
            </button>
          )}
          <Image
            className='emoji-icon invert'
            alt='img'
            src='https://icons.getbootstrap.com/assets/icons/emoji-smile.svg'
            onClick={() => setShowPicker((val) => !val)}
            width={20}
            height={20}
          />
          {showPicker && (
            <div ref={pickerRef} className='z-50 absolute left-96 bottom-10'>
              <Picker
                data={data}
                onEmojiSelect={handleEmojiSelect}
                emojiTooltip={true}
                emojiSize={24}
                perLine={8}
              />
            </div>
          )}
        </form>
      </Form>
    </div>
  );
}

export default Comments;
