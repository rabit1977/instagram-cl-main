import PostView from "@/components/PostView";
import { fetchPostById } from "@/lib/data";
import { notFound } from "next/navigation";

type Props = {
  params: {
    id: string;
  };
};

async function PostModal({ params: { id } }: Props) {
  const post = await fetchPostById(id);
  console.log(post);
  
  if (!post) {
    notFound();
  }

  return <PostView id={id} post={post} />;
}

export default PostModal;
