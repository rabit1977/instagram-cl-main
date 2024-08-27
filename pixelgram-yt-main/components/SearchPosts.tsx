'use client';

import { ChangeEvent, useState, useEffect } from 'react';
import { useDebounce } from 'use-debounce';
import { fetchUserAccounts } from '@/lib/data';
import UserAvatar from './UserAvatar';
import Link from 'next/link';

function SearchPosts() {
  const [searchTerm, setSearchTerm] = useState('');
  const [profiles, setProfiles] = useState<any[]>([]); // Array to store multiple profiles
  const [debouncedSearchTerm] = useDebounce(searchTerm, 100);

  useEffect(() => {
    const fetchProfileData = async () => {
      if (debouncedSearchTerm.trim() !== '') {
        try {
          const fetchedProfiles = await fetchUserAccounts(debouncedSearchTerm);
          console.log('Fetched Profiles:', fetchedProfiles);
          setProfiles(fetchedProfiles);
        } catch (error) {
          console.error('Error fetching profiles:', error);
          setProfiles([]); // Reset profiles in case of error
        }
      } else {
        setProfiles([]); // Clear profiles if search term is empty
      }
    };

    fetchProfileData();
  }, [debouncedSearchTerm]);

  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const clearSearch = () => {
    setSearchTerm('');
    setProfiles([]);
  };

  return (
    <div className="relative">
      <input
        type="text"
        placeholder="Search profiles..."
        value={searchTerm}
        onChange={handleSearch}
        className="pr-10 py-2 border rounded-md w-full bg-transparent outline-none"
      />
      {searchTerm && (
        <button
          type="button"
          onClick={clearSearch}
          className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500"
        >
          &times;
        </button>
      )}
      {profiles.length > 0 ? (
        <div className="absolute mt-2 w-full bg-white border border-gray-300 shadow-lg rounded-md z-10">
          {profiles.map((user) => (
            <Link href={`/dashboard/${user.username}`} key={user.id}>
              <div className='flex items-center p-2 border-b border-gray-200'>
                <div className='flex items-center justify-center h-10 w-10 md:w-12 md:h-12 bg-gradient-to-tr from-yellow-500 to-red-800 rounded-full mr-2'>
                  <UserAvatar
                    user={user}
                    className='flex items-center justify-center md:h-[43px] md:w-[43px] h-[34px] w-[34px] ring-2 ring-black'
                  />
                </div>
                <div>
                  <p className='font-semibold'>{user.name ?? 'No Name'}</p>
                  <p className='text-sm text-gray-500'>@{user.username ?? 'No Username'}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        searchTerm && (
          <div className="absolute mt-2 w-full bg-white border border-gray-300 shadow-lg rounded-md z-10 p-2 text-gray-500">
            No profiles found.
          </div>
        )
      )}
    </div>
  );
}

export default SearchPosts;