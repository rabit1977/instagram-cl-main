'use client';

import Error from "@/components/Error";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import useMount from "@/hooks/useMount";
import { updatePost } from "@/lib/actions";
import { UpdatePost } from "@/lib/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useCallback, useMemo } from "react";
import { z } from "zod";
import { Post } from "@prisma/client";

function EditPost({ id, post }: { id: string; post: Post }) {
  const mount = useMount();
  const pathname = usePathname();
  const router = useRouter();

  // Memoize the isEditPage check for better performance
  const isEditPage = useMemo(() => pathname === `/dashboard/p/${id}/edit`, [pathname, id]);

  const form = useForm<z.infer<typeof UpdatePost>>({
    resolver: zodResolver(UpdatePost),
    defaultValues: {
      id: post.id,
      caption: post.caption || "",
      fileUrl: post.fileUrl,
    },
  });

  const fileUrl = form.watch("fileUrl");

  // Callback to handle form submission to avoid re-creating the function on every render
  const onSubmit = useCallback(
    async (values: z.infer<typeof UpdatePost>) => {
      const res = await updatePost(values);

      if (res) {
        toast.error(<Error res={res} />);
      }
    },
    []
  );

  if (!mount) return null; // Early return to avoid unnecessary rendering

  return (
    <Dialog open={isEditPage} onOpenChange={(open) => !open && router.back()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-center pt-3">Edit info</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
            <div className="h-96 md:h-[450px] overflow-hidden rounded-md">
              <AspectRatio ratio={1 / 1} className="relative h-full">
                <Image
                  src={fileUrl}
                  alt="Post preview"
                  fill
                  priority
                  className="rounded-md object-cover"
                />
              </AspectRatio>
            </div>

            <FormField
              control={form.control}
              name="caption"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="caption"> Write a Caption</FormLabel>
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

            <Button type="submit" disabled={form.formState.isSubmitting}>
              Done
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export default EditPost;
