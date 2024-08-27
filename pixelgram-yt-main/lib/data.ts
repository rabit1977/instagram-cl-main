import { unstable_noStore as noStore } from 'next/cache';
import { CommentWithExtras, UserWithExtras } from './definitions';
import prisma from './prisma';


const userSelectFields = {
  id: true,
  name: true,
  username: true,
  bio: true,
  website: true,
  gender: true,
  email: true,
  emailVerified: true,
  image: true,
  createdAt: true,
  updatedAt: true,
  location: true,
  verifiedDate: true,
};


export async function fetchUserAccounts(debouncedSearchTerm: string): Promise<UserWithExtras[]> {
  try {
    return await prisma.user.findMany({
      where: {
        OR: [
          { name: { contains: debouncedSearchTerm, mode: 'insensitive' } },
          { username: { contains: debouncedSearchTerm, mode: 'insensitive' } },
        ],
      },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        name: true,
        username: true,
        image: true,
      },
    }) as UserWithExtras[];
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch user accounts');
  }
}

export async function fetchProfile(username: string) {
  noStore();

  try {
    return await prisma.user.findUnique({
      where: { username },
      select: {
        ...userSelectFields,
        posts: { orderBy: { createdAt: 'desc' } },
        saved: { orderBy: { createdAt: 'desc' } },
        followedBy: { include: { follower: { select: userSelectFields } } },
        following: { include: { following: { select: userSelectFields } } },
      },
    });
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch profile');
  }
}

export async function fetchPosts() {
  noStore();

  try {
    return await prisma.post.findMany({
      include: {
        comments: { include: { user: { select: userSelectFields } }, orderBy: { createdAt: 'desc' } },
        likes: { include: { user: { select: userSelectFields } } },
        savedBy: true,
        user: { select: { ...userSelectFields, location: true } }, // Ensure location is included
      },
      orderBy: { createdAt: 'desc' },
    });
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch posts');
  }
}
export async function fetchPostById(id: string) {
  noStore();

  try {
    return await prisma.post.findUnique({
      where: { id },
      include: {
        comments: { include: { user: { select: userSelectFields } }, orderBy: { createdAt: 'desc' } },
        likes: { include: { user: { select: userSelectFields } } },
        savedBy: true,
        user: { select: {...userSelectFields, location: true} },
      },
    });
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch post');
  }
}

export async function fetchPostsByUsername(username: string, postId?: string) {
  noStore();

  try {
    return await prisma.post.findMany({
      where: {
        user: { username },
        NOT: { id: postId },
      },
      include: {
        comments: { include: { user: { select: userSelectFields } }, orderBy: { createdAt: 'desc' } },
        likes: { include: { user: { select: userSelectFields } } },
        savedBy: true,
        user: { select: userSelectFields },
      },
      orderBy: { createdAt: 'desc' },
    });
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch posts');
  }
}

export async function fetchSavedPostsByUsername(username: string) {
  noStore();

  try {
    return await prisma.savedPost.findMany({
      where: { user: { username } },
      include: {
        post: {
          include: {
            comments: { include: { user: { select: userSelectFields } }, orderBy: { createdAt: 'desc' } },
            likes: { include: { user: { select: userSelectFields } } },
            savedBy: true,
            user: { select: userSelectFields },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch saved posts');
  }
}

export async function fetchCommentsByPostId(postId: string) {
  noStore();

  try {
    return await prisma.comment.findMany({
      where: { postId },
      include: { user: { select: userSelectFields } },
      orderBy: { createdAt: 'asc' },
    });
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch comments');
  }
}


// export async function fetchReplyComments(postId: string): Promise<CommentWithExtras[]> {
//   // Replace with your API call logic
//   const response = await fetch(`/api/comments?postId=${postId}`);
//   if (!response.ok) {
//     throw new Error("Failed to fetch comments");
//   }
//   return response.json();
// }

export async function fetchReplyComments(postId: string): Promise<CommentWithExtras[]> {
  const comments = await prisma.comment.findMany({
    where: {
      postId: postId,
      parentId: null, // Fetch only top-level comments
    },
    include: {
      user: true,
      children: {
        include: {
          user: true,
        },
      },
    },
  });
// Map the fetched data to ensure the children property matches the expected type
return comments.map(comment => ({
  ...comment,
  children: comment.children.map(child => ({
    ...child,
    children: [], // Ensure children property exists in each child comment
  }))
}));
}









