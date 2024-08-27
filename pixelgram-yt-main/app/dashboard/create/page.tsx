'use client';

import Error from '@/components/Error';
import LocationPrompt from '@/components/LocationPrompt';
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
import { createPost } from '@/lib/actions';
import { CreatePost } from '@/lib/schemas';
import { UploadButton } from '@/lib/uploadthing';
import { zodResolver } from '@hookform/resolvers/zod';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

function CreatePage() {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(true); // Control dialog open state
  const router = useRouter();

  // Initialize form with Zod schema validation
  const form = useForm<z.infer<typeof CreatePost>>({
    resolver: zodResolver(CreatePost),
    defaultValues: {
      caption: '',
      fileUrl: undefined,
    },
  });

  // Watch for fileUrl changes in form
  const fileUrl = form.watch('fileUrl');

  // Close the dialog and navigate back
  const handleClose = () => {
    setIsOpen(false);
    router.back();
  };

  const handleSubmit = async (values: z.infer<typeof CreatePost>) => {
    const res = await createPost(values);
    if (res) {
      toast.error(<Error res={res} />);
    } else {
      toast.success('Post created successfully!');
      handleClose(); // Close dialog on successful post creation
    }
  };

  return (
    <div className="flex flex-col justify-center items-center">
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="dark:bg-[#262626] shadow-xl">
          <DialogHeader>
            <DialogTitle className="text-center border-b dark:border-b-[#363636] p-4 w-full text-lg font-medium tracking-wide">
              Create new post
            </DialogTitle>
          </DialogHeader>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="space-y-4"
            >
              {previewUrl ? (
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
                  render={({ field }) => (
                    <FormItem className="flex flex-col items-center">
                      <FormDescription className="text-2xl text-center pb-3 font-light text-white">
                        Drag photos and videos here.
                      </FormDescription>
                      <FormControl>
                        <label className="cursor-pointer flex max-w-xs justify-center bg-blue-600 py-3 px-5 rounded-lg hover:bg-blue-500">
                          Select from computer
                          <UploadButton
                            endpoint="imageUploader"
                            className="hidden"
                            onClientUploadComplete={(res) => {
                              form.setValue('fileUrl', res[0].url);
                              setPreviewUrl(res[0].url);
                              toast.success('Upload complete');
                            }}
                            onUploadError={(error) => {
                              console.error(error);
                              toast.error('Upload failed');
                            }}
                          />
                        </label>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              {fileUrl && (
                <>
                  <FormField
                    control={form.control}
                    name="caption"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel htmlFor="caption">Caption</FormLabel>
                        <FormControl>
                          <Input
                            type="text"
                            id="caption"
                            placeholder="Write a caption..."
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                    <LocationPrompt/>
                  <Button
                    type="submit"
                    disabled={form.formState.isSubmitting}
                    >
                    Create Post
                  </Button>
                </>
              )}
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default CreatePage;