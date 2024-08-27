"use client";

import { useState, useEffect, useCallback } from "react";
import { CommentWithExtras } from "@/lib/definitions";
import Comment from "@/components/Comment";
import { fetchReplyComments } from "@/lib/data"; // Function to fetch comments

type Props = {
  initialComments: CommentWithExtras[];
  postId: string;
};

function ReplyCommentsSection({ initialComments, postId }: Props) {
  const [comments, setComments] = useState<CommentWithExtras[]>(initialComments);

  // Function to fetch and update comments
  const fetchAndUpdateComments = async () => {
    try {
      const updatedComments = await fetchReplyComments(postId); // Fetch updated comments from the API
      setComments(updatedComments);
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  };

  // Callback to refresh comments after a reply is saved
  const handleReplySaved = () => {
    fetchAndUpdateComments(); // Refresh comments after a reply is saved
  };

  return (
    <div>
      {comments.map((comment) => (
        <Comment
          key={comment.id}
          comment={comment}
          onReplySaved={handleReplySaved} // Pass the callback function
        />
      ))}
    </div>
  );
}


export default ReplyCommentsSection;
