'use client';

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { FormControl, FormField, FormItem } from '@/components/ui/form';
import useMount from '@/hooks/useMount';
import { updateProfile } from '@/lib/actions';
import { UserWithExtras } from '@/lib/definitions';
import { UpdateUser } from '@/lib/schemas';
import { UploadButton } from '@/lib/uploadthing';
import { zodResolver } from '@hookform/resolvers/zod';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import SubmitButton from './SubmitButton';
import UserAvatar from './UserAvatar';
import { buttonVariants } from './ui/button';
import { Form } from './ui/form';

function ProfileAvatar({
  user,
  children,
}: {
  user: UserWithExtras;
  children: React.ReactNode;
}) {
  const { data: session } = useSession();
  const isCurrentUser = session?.user.id === user.id;
  const form = useForm<z.infer<typeof UpdateUser>>({
    resolver: zodResolver(UpdateUser),
    defaultValues: {
      id: user.id,
      image: user.image || '',
      name: user.name || '',
      username: user.username || '',
    },
  });
  const inputRef = useRef<HTMLInputElement>(null);
  const [open, setOpen] = useState(false);
  const [removeDialogOpen, setRemoveDialogOpen] = useState(false);
  const mount = useMount();
  const pathname = usePathname();

  const href = `/dashboard/${user.username}`;

  if (!mount || !session) return null;

  if (!isCurrentUser)
    return <UserAvatar user={user} className='w-20 h-20 md:w-36 md:h-36' />;

  const closeAllDialogs = () => {
    setRemoveDialogOpen(false);
    setOpen(false);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>{children}</DialogTrigger>

        <DialogContent className='dialogContent rounded-3xl h-fit'>
          <DialogHeader>
            <DialogTitle className='mx-auto font-medium text-xl py-5'>
              <div className='flex flex-col space-y-6 mt-4'>
                {user && (
                  <Link
                    href={href}
                    className={buttonVariants({
                      variant: 'ghost',
                      className: 'navLink',
                      size: 'lg',
                    })}
                  >
                    <UserAvatar
                      user={user}
                      className={`size-20 mx-auto border-2`}
                    />
                  </Link>
                )}
                <div className='text-center'>
                  <h2 className='text-2xl'>Synced profile photo</h2>
                  <span className='text-sm text-centertext-slate-400 tracking-wide'>
                    Instagram, Facebook
                  </span>
                </div>
              </div>
            </DialogTitle>
          </DialogHeader>

          {isCurrentUser && (
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(async (values) => {
                  const { message } = await updateProfile(values);
                  toast(message);

                  setOpen(false);
                })}
              >
                <FormField
                  control={form.control}
                  name='image'
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <>
                          <UploadButton
                            className='text-medium tracking-wide h-14 ut-button:bg-transparent border-y border-zinc-300 dark:border-neutral-700 ut-button:text-blue-500 ut-button:font-bold ut-allowed-content:hidden ut-button:ring-0 ut-button:focus-visible:ring-0 ut-button:ring-offset-0 ut-button:w-full hidden'
                            endpoint='imageUploader'
                            onClientUploadComplete={(res) => {
                              form.setValue('image', res[0].url);

                              if (inputRef.current) {
                                inputRef.current.click();
                              }
                            }}
                            onUploadError={(error: Error) => {
                              console.error(error);
                              toast.error('Upload failed');
                            }}
                          />
                          <button
                            type='button'
                            className='w-full pb-4 bg-transparent border-y pt-4 border-zinc-300 dark:border-neutral-700 text-blue-500 font-bold'
                          >
                            Upload Photo
                          </button>
                          <button className='w-full pb-4 pt-1 bg-transparent border-b border-zinc-300 dark:border-neutral-700  font-bold'>
                            Manage sync settings
                          </button>
                        </>
                      </FormControl>
                    </FormItem>
                  )}
                />

                {user.image && (
                  <SubmitButton
                    className='text-red-500 border-b border-zinc-300 dark:border-neutral-700 font-bold disabled:cursor-not-allowed w-full text-medium tracking-wide p-3'
                    onClick={(e) => {
                      e.preventDefault();
                      setRemoveDialogOpen(true);
                    }}
                    disabled={form.formState.isSubmitting}
                  >
                    Remove Current Photo
                  </SubmitButton>
                )}

                <input type='submit' hidden ref={inputRef} />
              </form>
            </Form>
          )}

          <DialogClose className='postOption border-0 w-full p-3'>
            Cancel
          </DialogClose>
        </DialogContent>
      </Dialog>

      <Dialog
        open={removeDialogOpen}
        onOpenChange={(isOpen) => {
          if (!isOpen) closeAllDialogs();
          else setRemoveDialogOpen(isOpen);
        }}
      >
        <DialogContent className='dialogContent rounded-3xl h-fit'>
          <div className='relative z-10'>
            <h1 className='text-lg font-semibold'>
              Remove photo from Instagram and Facebook?
            </h1>
            <p className='my-4'>
              Deleting this profile picture will delete the picture and any
              related posts on Facebook.
            </p>
            <button
              className='w-full p-4 font-medium text-red-500'
              onClick={() => {
                form.setValue('image', '');
                closeAllDialogs();
                if (inputRef.current) {
                  inputRef.current.click();
                }
              }}
            >
              Remove
            </button>
            <button className='w-full p-4 font-medium'>
              Manage sync settings
            </button>
            <DialogClose
              className='w-full p-4 font-medium'
              onClick={closeAllDialogs}
            >
              Cancel
            </DialogClose>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default ProfileAvatar;
