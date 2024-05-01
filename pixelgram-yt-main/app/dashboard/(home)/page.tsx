import { auth } from '@/auth';
import Posts from '@/components/Posts';
import FeedSideSuggestions from '@/components/SideSuggestions';
import { PostsSkeleton } from '@/components/Skeletons';
import { fetchProfile } from '@/lib/data';
import { Suspense } from 'react';
import NotFound from '../not-found';

async function DashboardPage() {
  const session = await auth();
  const profile = await fetchProfile(session?.user.username!);

  if (!profile) {
    NotFound();
  }
  return (
    <main className='flex '>
      <div className='flex flex-col xl:w-2/3 w-full gap-y-8 pb-20 mx-4'>
        <Suspense fallback={<PostsSkeleton />}>
          <Posts />
        </Suspense>
      </div>
      <div className='hidden xl:flex'>
        <FeedSideSuggestions profile={profile} />
      </div>
    </main>
  );
}

export default DashboardPage;
