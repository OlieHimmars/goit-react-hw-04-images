import { useState } from 'react';
import { FcSearch } from "react-icons/fc";
import css from './Searchbar.module.css';
import { toast } from 'react-hot-toast'

export default function Searchbar({ onSubmit }) {
  const [searchInput, setSearchInput] = useState('');

  const handleChange = e => setSearchInput(e.target.value.toLowerCase());

  const handleFormSubmit = e => {
    e.preventDefault();

    if (searchInput.trim() === '') {
      return toast.error('Please enter search text');
    }
    onSubmit(searchInput);
    setSearchInput('');
  };
    return (
      <header className={css.searchbar}>
        <form onSubmit={handleFormSubmit} className={css.searchForm}>
          <button type="submit" className={css.searchFormButton}>
            <FcSearch size={28}/>
          </button>
          
          <input
            className={css.searchFormInput}
            value={searchInput}
            type="text"
            autoComplete="off"
            autoFocus
            placeholder="Search images and photos"
            onChange={handleChange}
          />          
        </form>
      </header>
    );
};