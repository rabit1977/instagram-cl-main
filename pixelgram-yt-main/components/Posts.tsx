import { fetchPosts, fetchUserAccounts } from "@/lib/data";
import Post from "./Post";
import Link from "next/link";
import UserAvatar from "./UserAvatar";

async function Posts() {
  const posts = await fetchPosts();
// Fetch user accounts
const userAccounts = await fetchUserAccounts(1, 10);
  return (
    <>
      {/* Paginated user accounts */}
      <div className='flex flex-wrap items-center justify-center mt-2 mb-6'>
        {userAccounts.map((user) => (
          <div key={user.id} className='flex flex-col items-center mx-2'>
            <Link href={`/dashboard/${user.username}`}>
                <div className='flex items-center justify-center h-[90px] w-[90px] bg-gradient-to-tr from-yellow-500 to-red-800 rounded-full'>
                  <UserAvatar
                    user={user}
                    className='flex items-center justify-center h-20 w-20 ring-2 ring-black'
                  />
                </div>
            </Link>
            <p className='text-xs mt-1'>{user.username}</p>
          </div>
        ))}
        </div>
      {posts.map((post) => (
        <Post key={post.id} post={post}/>
      ))}
    </>
  );
}

export default Posts;
