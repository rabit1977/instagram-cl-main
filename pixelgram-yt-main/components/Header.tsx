import { calSans } from '@/app/fonts';
import { Heart, Search } from 'lucide-react';
import Link from 'next/link';
import { Button } from './ui/button';
import UserProfile from './UserProfile';
import SearchPosts from './SearchPosts';



function Header() {
  return (
    <header className='fixed md:hidden bg-white top-0 flex items-center justify-between dark:bg-neutral-950 w-full z-50 border-b border-zinc-300 dark:border-neutral-700 px-3 py-2 '>
      <Link href={'/dashboard'}>
        <p className={`font-semibold text-xl ${calSans.className}`}>
          Pixelgram
        </p>
      </Link>

      <div className='flex items-center space-x-2'>
        <div className='flex items-center text-neutral-600 dark:text-neutral-400 bg-zinc-100 dark:bg-neutral-800 gap-x-2 rounded-md px-3.5 py-1.5'>
          <Search className='size-4' />
          <SearchPosts/>
        </div>
        <Button size={'icon'} variant={'ghost'}>
          <Heart />
        </Button>
      </div>
    </header>
  );
}

export default Header;