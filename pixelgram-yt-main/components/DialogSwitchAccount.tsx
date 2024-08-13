'use client'



import { useState } from 'react';
import { fetchUserAccounts } from '@/lib/data';
import Link from 'next/link';
import UserAvatar from './UserAvatar';

function DialogSwitchAccount() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState(null);

  const handleSwitchClick = (account) => {
    setSelectedAccount(account);
    setIsDialogOpen(true);
  };

  return (
    <>
      <button onClick={() => handleSwitchClick(loggedInUser)} className='mt-2 p-2 bg-blue-500 text-white rounded'>Switch</button>
      {isDialogOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <h2 className="text-xl font-bold border-b pb-2 mb-4">Switch Account</h2>
            <div className="flex items-center mb-4">
              <div className="w-6 h-6 rounded-full bg-green-500 mr-2"></div>
              <p className="text-lg font-medium">{selectedAccount.username}</p>
            </div>
            <Link href="/login">
              <a className="text-blue-500">Login to one existing account</a>
            </Link>
          </div>
        </div>
      )}
      </>
  );
}

export default DialogSwitchAccount;
