import { unstable_noStore as noStore } from 'next/cache';
import { UserWithExtras } from './definitions';
import prisma from './prisma';

export async function fetchUserAccounts(): Promise<UserWithExtras[]> {
  try {
    const users = await prisma.user.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      select: {
        id: true,
        createdAt: true,
        updatedAt: true,
        name: true,
        username: true,
        bio: true,
        website: true,
        gender: true,
        email: true,
        emailVerified: true,
        image: true,
        location: true,
        verifiedDate: true,
        // Add any other necessary fields here
      },
    });

    return users as UserWithExtras[]; // Ensure the returned data matches UserWithExtras type
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch user accounts');
  }
}

export async function fetchPosts() {
  noStore();

  try {
    const data = await prisma.post.findMany({
      include: {
        comments: {
          include: {
            user: {
              select: {
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
              },
            },
          },
          orderBy: {
            createdAt: 'desc',
          },
        },
        likes: {
          include: {
            user: {
              select: {
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
              },
            },
          },
        },
        savedBy: true,
        user: {
          select: {
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
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return data;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch posts');
  }
}

export async function fetchPostById(id: string) {
  noStore();

  try {
    const data = await prisma.post.findUnique({
      where: {
        id,
      },
      include: {
        comments: {
          include: {
            user: {
              select: {
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
              },
            },
          },
          orderBy: {
            createdAt: 'desc',
          },
        },
        likes: {
          include: {
            user: {
              select: {
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
              },
            },
          },
        },
        savedBy: true,
        user: {
          select: {
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
          },
        },
      },
    });

    return data;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch post');
  }
}

export async function fetchPostsByUsername(username: string, postId?: string) {
  noStore();

  try {
    const data = await prisma.post.findMany({
      where: {
        user: {
          username,
        },
        NOT: {
          id: postId,
        },
      },
      include: {
        comments: {
          include: {
            user: {
              select: {
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
              },
            },
          },
          orderBy: {
            createdAt: 'desc',
          },
        },
        likes: {
          include: {
            user: {
              select: {
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
              },
            },
          },
        },
        savedBy: true,
        user: {
          select: {
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
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return data;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch posts');
  }
}

export async function fetchProfile(username: string) {
  noStore();

  try {
    const data = await prisma.user.findUnique({
      where: {
        username,
      },
      include: {
        posts: {
          orderBy: {
            createdAt: 'desc',
          },
        },
        saved: {
          orderBy: {
            createdAt: 'desc',
          },
        },
        followedBy: {
          include: {
            follower: {
              include: {
                following: true,
                followedBy: true,
              },
            },
          },
        },
        following: {
          include: {
            following: {
              include: {
                following: true,
                followedBy: true,
              },
            },
          },
        },
      },
    });

    return data;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch profile');
  }
}

export async function fetchSavedPostsByUsername(username: string) {
  noStore();

  try {
    const data = await prisma.savedPost.findMany({
      where: {
        user: {
          username,
        },
      },
      include: {
        post: {
          include: {
            comments: {
              include: {
                user: {
                  select: {
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
                  },
                },
              },
              orderBy: {
                createdAt: 'desc',
              },
            },
            likes: {
              include: {
                user: {
                  select: {
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
                  },
                },
              },
            },
            savedBy: true,
            user: {
              select: {
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
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    return data;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch profile');
  }
}
export async function fetchCommentsByPostId(postId: string) {
  noStore();

  try {
    const comments = await prisma.comment.findMany({
      where: {
        postId,
      },
      include: {
        user: {
          select: {
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
          },
        },
      },
      orderBy: {
        createdAt: 'asc', // Ascending order for reply order
      },
    });

    return comments;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch comments');
  }
}

// import { unstable_noStore as noStore } from 'next/cache';
// import prisma from './prisma';

// export async function fetchUserAccounts() {
//   noStore();

//   try {
//     const data = await prisma.user.findMany({
//       orderBy: {
//         createdAt: 'desc',
//       },
//     });

//     return data;
//   } catch (error) {
//     console.error('Database Error:', error);
//     throw new Error('Failed to fetch user accounts');
//   }
// }

// export async function fetchPosts() {
//   // equivalent to doing fetch, cache: no-store
//   noStore();

//   try {
//     const data = await prisma.post.findMany({
//       include: {
//         comments: {
//           include: {
//             user: true,
//           },
//           orderBy: {
//             createdAt: 'desc',
//           },
//         },
//         likes: {
//           include: {
//             user: true,
//           },
//         },
//         savedBy: true,
//         user: true,
//       },
//       orderBy: {
//         createdAt: 'desc',
//       },
//     });

//     return data;
//   } catch (error) {
//     console.error('Database Error:', error);
//     throw new Error('Failed to fetch posts');
//   }
// }

// export async function fetchPostById(id: string) {
//   noStore();

//   try {
//     const data = await prisma.post.findUnique({
//       where: {
//         id,
//       },
//       include: {
//         comments: {
//           include: {
//             user: true,
//           },
//           orderBy: {
//             createdAt: 'desc',
//           },
//         },
//         likes: {
//           include: {
//             user: true,
//           },
//         },
//         savedBy: true,
//         user: true,
//       },
//     });

//     return data;
//   } catch (error) {
//     console.error('Database Error:', error);
//     throw new Error('Failed to fetch post');
//   }
// }

// export async function ByUsername(username: string, postId?: string) {
//   noStore();

//   try {
//     const data = await prisma.post.findMany({
//       where: {
//         user: {
//           username,
//         },
//         NOT: {
//           id: postId,
//         },
//       },
//       include: {
//         comments: {
//           include: {
//             user: true,
//           },
//           orderBy: {
//             createdAt: 'desc',
//           },
//         },
//         likes: {
//           include: {
//             user: true,
//           },
//         },
//         savedBy: true,
//         user: true,
//       },
//       orderBy: {
//         createdAt: 'desc',
//       },
//     });

//     return data;
//   } catch (error) {
//     console.error('Database Error:', error);
//     throw new Error('Failed to fetch posts');
//   }
// }

// export async function fetchProfile(username: string) {
//   noStore();

//   try {
//     const data = await prisma.user.findUnique({
//       where: {
//         username,
//       },
//       include: {
//         posts: {
//           orderBy: {
//             createdAt: 'desc',
//           },
//         },
//         saved: {
//           orderBy: {
//             createdAt: 'desc',
//           },
//         },
//         followedBy: {
//           include: {
//             follower: {
//               include: {
//                 following: true,
//                 followedBy: true,
//               },
//             },
//           },
//         },
//         following: {
//           include: {
//             following: {
//               include: {
//                 following: true,
//                 followedBy: true,
//               },
//             },
//           },
//         },
//       },
//     });

//     return data;
//   } catch (error) {
//     console.error('Database Error:', error);
//     throw new Error('Failed to fetch profile');
//   }
// }

// export async function fetchSavedPostsByUsername(username: string) {
//   noStore();

//   try {
//     const data = await prisma.savedPost.findMany({
//       where: {
//         user: {
//           username,
//         },
//       },
//       include: {
//         post: {
//           include: {
//             comments: {
//               include: {
//                 user: true,
//               },
//               orderBy: {
//                 createdAt: 'desc',
//               },
//             },
//             likes: {
//               include: {
//                 user: true,
//               },
//             },
//             savedBy: true,
//             user: true,
//           },
//         },
//       },
//       orderBy: {
//         createdAt: 'desc',
//       },
//     });

//     return data;
//   } catch (error) {
//     console.error('Database Error:', error);
//     throw new Error('Failed to fetch saved posts');
//   }
// }
