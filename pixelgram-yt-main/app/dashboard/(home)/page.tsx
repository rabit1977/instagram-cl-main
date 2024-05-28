import { auth } from '@/auth';
import Posts from '@/components/Posts';
import FeedSideSuggestions from '@/components/SideSuggestions';
import { PostsSkeleton } from '@/components/Skeletons';
import { fetchProfile } from '@/lib/data';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';

async function DashboardPage() {
  const session = await auth();
  const profile = await fetchProfile(session?.user.username!);

  if (!profile) {
    notFound();
  }
  return (
    <main className='flex w-full flex-grow'>
      <div className='flex w-full'>
        <Suspense fallback={<PostsSkeleton />}>
          <div className='flex flex-col flex-1 gap-y-8 max-w-xl pb-20 mx-auto'>
            <Posts />
          </div>
          <FeedSideSuggestions profile={profile} />
        </Suspense>
      </div>
    </main>
  );
}

export default DashboardPage;
