'use client';

import { ChangeEvent, useState } from 'react';

interface Props {
  onSearch: (term: string) => void;
}

function SearchPosts({ onSearch }: Props) {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value;
    setSearchTerm(term);
    onSearch(term);
  };

  return (
    <input
      type='text'
      placeholder='Search posts...'
      value={searchTerm}
      onChange={handleSearch}
    />
  );
}

export default SearchPosts;
