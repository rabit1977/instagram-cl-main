'use client';

import { ChangeEvent, useState, useEffect } from 'react';
import { useDebounce } from 'use-debounce';
import { fetchProfile } from '@/lib/data'; // Ensure the import path is correct
import UserProfile from './UserProfile';

function SearchPosts() {
  const [searchTerm, setSearchTerm] = useState('');
  const [profile, setProfile] = useState<any>(null); // Store the fetched profile
  const [debouncedSearchTerm] = useDebounce(searchTerm, 300);

  useEffect(() => {
    const fetchProfileData = async () => {
      if (debouncedSearchTerm.trim() !== '') {
        try {
          const fetchedProfile = await fetchProfile(debouncedSearchTerm);
          console.log('Fetched Profile:', fetchedProfile);
          setProfile(fetchedProfile);
        } catch (error) {
          console.error('Error fetching profile:', error);
          setProfile(null); // Reset profile in case of error
        }
      } else {
        setProfile(null); // Clear profile if search term is empty
      }
    };

    fetchProfileData();
  }, [debouncedSearchTerm]);

  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const clearSearch = () => {
    setSearchTerm('');
    setProfile(null);
  };

  return (
    <div className="relative">
      <input
        type="text"
        placeholder="Search profiles..."
        value={searchTerm}
        onChange={handleSearch}
        className="pr-10 py-2 border rounded-md w-full"
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
      {profile ? (
        <div className="absolute mt-2 w-full bg-white border border-gray-300 shadow-lg rounded-md z-10">
          <UserProfile key={profile.id} profile={profile} />
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
