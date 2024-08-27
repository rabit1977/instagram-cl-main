'use client'

// LocationPrompt.tsx
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { updateUserLocation } from '@/lib/actions'; // Assume this function updates the user's location

function LocationPrompt() {
  const { data: session } = useSession();
  const [location, setLocation] = useState('');

  useEffect(() => {
    if (session && !session.user.location) {
      // Show prompt for location if not set
      // You can implement a modal or a simple input field here
    }
  }, [session]);

  const handleLocationSubmit = async () => {
    if (session) {
      await updateUserLocation(session.user.id, location);
      // Optionally, you can refresh the session or update the state
    }
  };

  return (
    <div className='flex space-x-2'>
      <input
        type="text"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
        placeholder="Enter your location"
      className='p-2.5 rounded-md flex-1'
      />
      <button className='p-2 h-full rounded-md text-black bg-white' onClick={handleLocationSubmit}>Submit Location</button>
    </div>
  );
}

export default LocationPrompt;