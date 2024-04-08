'use client';

import Error from '@/components/Error';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import useMount from '@/hooks/useMount';
import { createPost } from '@/lib/actions';
import { CreatePost } from '@/lib/schemas';
import { UploadButton } from '@/lib/uploadthing';
import { zodResolver } from '@hookform/resolvers/zod';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

function CreatePage() {
  const pathname = usePathname();
  const isCreatePage = pathname === '/dashboard/create';
  const router = useRouter();
  const mount = useMount();
  const form = useForm<z.infer<typeof CreatePost>>({
    resolver: zodResolver(CreatePost),
    defaultValues: {
      caption: '',
      fileUrl: undefined,
    },
  });
  const fileUrl = form.watch('fileUrl');

  if (!mount) return null;

  return (
    <div className='flex flex-col justify-center items-center'>
      <Dialog
        open={isCreatePage}
        onOpenChange={(open) => !open && router.back()}
      >
        <div>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className='text-center border-b p-4 w-full text-2xl'>
                Create new post
              </DialogTitle>
            </DialogHeader>

            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(async (values) => {
                  const res = await createPost(values);
                  if (res) {
                    return toast.error(<Error res={res} />);
                  }
                })}
                className='space-y-4'
              >
                {!!fileUrl ? (
                  <div className='h-96 md:h-[450px] overflow-hidden rounded-md'>
                    <AspectRatio ratio={1 / 1} className='relative h-full'>
                      <Image
                        src={fileUrl}
                        alt='Post preview'
                        fill
                        className='rounded-md object-cover'
                      />
                    </AspectRatio>
                  </div>
                ) : (
                  <FormField
                    control={form.control}
                    name='fileUrl'
                    render={({ field, fieldState }) => (
                      <FormItem>
                        <FormDescription className='text-2xl text-center pb-3'>
                          Drag photos and videos here.
                        </FormDescription>
                        <FormMessage />
                        <FormControl>
                          <UploadButton
                            endpoint='imageUploader'
                            onClientUploadComplete={(res) => {
                              form.setValue('fileUrl', res[0].url);
                              toast.success('Upload complete');
                            }}
                            onUploadError={(error: Error) => {
                              console.error(error);
                              toast.error('Upload failed');
                            }}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                )}

                {!!fileUrl && (
                  <FormField
                    control={form.control}
                    name='caption'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel htmlFor='caption'>Caption</FormLabel>
                        <FormControl>
                          <Input
                            type='caption'
                            id='caption'
                            placeholder='Write a caption...'
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                <Button type='submit' disabled={form.formState.isSubmitting}>
                  Create Post
                </Button>
              </form>
            </Form>
          </DialogContent>
        </div>
      </Dialog>
    </div>
  );
}

export default CreatePage;
