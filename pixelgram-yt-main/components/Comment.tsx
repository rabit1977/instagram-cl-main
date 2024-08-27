"use client";

import { useState } from "react";
import { CommentWithExtras } from "@/lib/definitions";
import CommentOptions from "@/components/CommentOptions";
import UserAvatar from "@/components/UserAvatar";
import { useSession } from "next-auth/react";
import Link from "next/link";
import Timestamp from "./Timestamp";
import { saveReply } from "@/lib/actions";

type Props = {
  comment: CommentWithExtras;
  inputRef?: React.RefObject<HTMLInputElement>;
  onReplySaved?: () => void; // Callback to refresh or update parent component
};

function Comment({ comment, inputRef, onReplySaved }: Props) {
  const { data: session } = useSession();
  const username = comment.user.username;
  const href = `/dashboard/${username}`;

  const [reply, setReply] = useState(""); // State for reply input
  const [isReplying, setIsReplying] = useState(false); // Toggle reply input
  const [showReplies, setShowReplies] = useState(false); // Toggle reply visibility

  const handleReply = async () => {
    if (!reply.trim() || !session?.user.id) return; // Avoid empty replies and ensure userId is defined

    try {
      await saveReply({
        body: reply,
        postId: comment.postId,
        parentId: comment.id,
        userId: session.user.id,
      });

      setReply("");
      setIsReplying(false);
      if (onReplySaved) onReplySaved(); // Call the callback to refresh or update parent component
    } catch (error) {
      console.error("Error saving reply:", error);
    }
  };

  return (
    <div className="group p-3 px-3.5 flex items-start space-x-2.5">
      <Link href={href}>
        <UserAvatar user={comment.user} />
      </Link>
      <div className="space-y-1.5 w-full">
        <div className="flex items-center space-x-1.5 leading-none text-sm">
          <Link href={href} className="font-semibold">
            {username}
          </Link>
          <p className="font-medium">{comment.body}</p>
        </div>
        <div className="flex h-5 items-center space-x-2.5">
          <Timestamp createdAt={comment.createdAt} />
          <button
            className="text-xs font-semibold text-neutral-500"
            onClick={() => setIsReplying(!isReplying)}
          >
            Reply
          </button>
          {comment.userId === session?.user.id && (
            <CommentOptions comment={comment} />
          )}
        </div>
        {isReplying && (
          <div className="mt-2">
            <input
              type="text"
              value={reply}
              onChange={(e) => setReply(e.target.value)}
              placeholder="Write your reply..."
              className="border border-gray-300 rounded-md w-full p-2 text-sm"
              ref={inputRef}
            />
            <div className="mt-1 flex space-x-2">
              <button
                className="text-xs font-semibold text-blue-500"
                onClick={handleReply}
              >
                Submit
              </button>
              <button
                className="text-xs font-semibold text-neutral-500"
                onClick={() => setIsReplying(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        )}
        {/* Show the number of replies and toggle visibility */}
        {comment.children && comment.children.length > 0 && (
          <>
            <button
              className="text-xs font-semibold text-neutral-500 mt-2"
              onClick={() => setShowReplies(!showReplies)}
            >
              {showReplies
                ? "Hide replies"
                : `${comment.children.length} ${
                    comment.children.length > 1 ? "replies" : "reply"
                  }`}
            </button>
            {showReplies && (
              <div className="ml-4 mt-2">
                {comment.children.map((reply) => (
                  <Comment
                    key={reply.id}
                    comment={reply}
                    onReplySaved={onReplySaved} // Pass the callback function
                  />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default Comment;
