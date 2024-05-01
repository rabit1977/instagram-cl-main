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
      <div className='flex flex-wrap items-center justify-center mt-20 md:mt-10 mb-6'>
        {userAccounts.map((user) => (
          <div key={user.id} className='flex flex-col items-center mx-2'>
            <Link href={`/dashboard/${user.username}`}>
                <div className='flex items-center justify-center h-20 w-20 md:w-24 md:h-24 bg-gradient-to-tr from-yellow-500 to-red-800 rounded-full'>
                  <UserAvatar
                    user={user}
                    className='flex items-center justify-center md:h-[87px] md:w-[87px] h-[68px] w-[68px] ring-2 ring-black'
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
