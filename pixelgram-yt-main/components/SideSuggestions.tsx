import { fetchUserAccounts } from '@/lib/data';
import Link from 'next/link';
import UserAvatar from './UserAvatar';

async function FeedSideSuggestions() {
  const userAccounts = await fetchUserAccounts();
  const loggedInUser = userAccounts.find(user => user.id);

  return (
    <article className='hidden mt-10 max-w-md 2xl:block w-full'>
      <div className='flex gap-x-2 items-center'>
        <div className='flex flex-wrap items-center justify-center mt-20 md:mt-10 mb-6'>
          {loggedInUser && (
            <div key={loggedInUser.id} className='flex flex-col items-center mx-2'>
              <Link href={`/dashboard/${loggedInUser.username}`}>
                <div className='flex items-center justify-center h-20 w-20 md:w-24 md:h-24 bg-gradient-to-tr from-yellow-500 to-red-800 rounded-full'>
                  <UserAvatar
                    user={loggedInUser}
                    className='flex items-center justify-center md:h-[87px] md:w-[87px] h-[68px] w-[68px] ring-2 ring-black'
                  />
                </div>
              </Link>
              <p className='text-xs mt-1'>{loggedInUser.username}</p>
              <div>
                <p className='font-medium'>{loggedInUser?.email?.slice(0, 10)}</p>
                <p className='font-medium'>{loggedInUser?.username}</p>
              </div>
              <button className='mt-2 p-2 bg-blue-500 text-white rounded'>Switch</button>
            </div>
          )}
        </div>
      </div>
    </article>
  );
}

export default FeedSideSuggestions;
