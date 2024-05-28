'use client'

import { fetchUserAccounts } from "@/lib/data";
import Link from "next/link";
import { useEffect, useState } from "react";
import UserAvatar from "./UserAvatar";

interface User {
    id: string;
    name: string | null;
    username: string | null;
    bio: string | null;
    website: string | null;
    gender: string | null;
    email: string | null;
    emailVerified: Date | null;
    // ... other properties
    verifiedDate: Date | null;
  }

function PaginatedUserAccounts() {
    const [userAccounts, setUserAccounts] = useState<User[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageCount, setPageCount] = useState(0);
  const usersPerPage = 10; // Adjust this value as needed

  useEffect(() => {
    const fetchData = async () => {
      const accounts = await fetchUserAccounts();
      const totalAccounts = accounts.length;
      setUserAccounts(accounts);
      setPageCount(Math.ceil(totalAccounts / usersPerPage));
    };
    fetchData();
  }, []);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const getVisibleUsers = () => {
    const startIndex = (currentPage - 1) * usersPerPage;
    const endIndex = Math.min(startIndex + usersPerPage, userAccounts.length);
    return userAccounts.slice(startIndex, endIndex);
  };

  return (
    <>
      {/* Paginated user accounts */}
      <div className="flex flex-wrap items-center justify-center mt-20 md:mt-10 mb-6">
        {getVisibleUsers().map((user) => (
          <div key={user.id} className="flex flex-col items-center mx-2">
            <Link href={`/dashboard/${user.username}`}>
              <div className="flex items-center justify-center h-20 w-20 md:w-24 md:h-24 bg-gradient-to-tr from-yellow-500 to-red-800 rounded-full">
                <UserAvatar user={user} className="flex items-center justify-center md:h-[87px] md:w-[87px] h-[68px] w-[68px] ring-2 ring-black" />
              </div>
            </Link>
            <p className="text-xs mt-1">{user.username}</p>
          </div>
        ))}
      </div>

      {/* Pagination controls (optional) */}
      {pageCount > 1 && (
        <div className="flex justify-center mt-4">
          {Array.from({ length: pageCount }, (_, i) => i + 1).map(
            (pageNumber) => (
              <button
                key={pageNumber}
                className={`px-2 py-1 mr-2 rounded-md text-gray-700 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
                  currentPage === pageNumber ? "bg-gray-200 font-bold" : ""
                }`}
                onClick={() => handlePageChange(pageNumber)}
              >
                {pageNumber}
              </button>
            )
          )}
        </div>
      )}
    </>
  );
}

export default PaginatedUserAccounts;