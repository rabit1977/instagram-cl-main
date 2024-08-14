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
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

function CreatePage() {
  const [fileSelected, setFileSelected] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | undefined>(undefined); // New state for the preview URL
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

  const handleFileSelection = (file: File) => {
    // Create a preview URL from the selected file
    const preview = URL.createObjectURL(file);
    setPreviewUrl(preview);
    setFileSelected(true);
  };

  return (
    <div className="flex flex-col justify-center items-center">
      <Dialog
        open={isCreatePage}
        onOpenChange={(open) => !open && router.back()}
      >
        <DialogContent className="dark:bg-[#262626] shadow-xl">
          <DialogHeader>
            <DialogTitle className="text-center border-b dark:border-b-[#363636] p-4 w-full text-lg font-medium tracking-wide">
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
              className="space-y-4"
            >
              {!!previewUrl ? (
                <div className="h-96 md:h-[450px] overflow-hidden rounded-md">
                  <AspectRatio ratio={1 / 1} className="relative h-full">
                    <Image
                      src={previewUrl}
                      alt="Post preview"
                      fill
                      className="rounded-md object-cover"
                    />
                  </AspectRatio>
                </div>
              ) : (
                <FormField
                  control={form.control}
                  name="fileUrl"
                  render={({ field, fieldState }) => (
                    <FormItem className="flex flex-col items-center">
                      <FormDescription className="text-2xl text-center pb-3 font-light text-white">
                        Drag photos and videos here.
                      </FormDescription>
                      <FormMessage />
                      <FormControl>
                        <label className="cursor-pointer flex max-w-xs justify-center bg-blue-600 py-3 px-5 rounded-lg hover:bg-blue-500">
                          Select from computer
                          <UploadButton
                            endpoint="imageUploader"
                            className="hidden"
                            onClientUploadComplete={(res) => {
                              form.setValue('fileUrl', res[0].url);
                              setPreviewUrl(res[0].url); // Update preview URL with the uploaded file URL
                              toast.success('Upload complete');
                              setFileSelected(true);
                            }}
                            onUploadError={(error: Error) => {
                              console.error(error);
                              toast.error('Upload failed');
                            }}
                            onFileInputChange={(files) => {
                              if (files && files[0]) {
                                handleFileSelection(files[0]); // Show preview immediately on file selection
                              }
                            }}
                          />
                        </label>
                      </FormControl>
                    </FormItem>
                  )}
                />
              )}

              {!!fileUrl && (
                <FormField
                  control={form.control}
                  name="caption"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor="caption">Caption</FormLabel>
                      <FormControl>
                        <Input
                          type="caption"
                          id="caption"
                          placeholder="Write a caption..."
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
              {!!fileUrl && fileSelected && (
                <Button
                  type="submit"
                  disabled={form.formState.isSubmitting}
                >
                  Create Post
                </Button>
              )}
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default CreatePage;
