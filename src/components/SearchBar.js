import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import './css/search.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import SearchResult from './SearchResult';
import SearchEmpty from './SearchEmpty';

const SearchBar = (props) => {
    const inputRef = useRef();
    const location = useLocation();

    const [query, setSearchText] = useState('');
    const [search, setSearch] = useState('');

    const handleChange = e => {
        setSearchText(e.target.value);
    }

    const submitSearch = e => {
        e.preventDefault();
        setSearch(query);
    }

    useEffect(() => {
        if (location.state !== null) {
            inputRef.current.focus();
            setSearchText(location.state);
            setSearch(location.state);
        }
    }, [])

    useEffect(() => {
        console.log(`Current query text: ${query}`);
        console.log(`Search text: ${search}`);
    }, [query, search])

    return (
        <>
            <div className='search-container'>
                <div className='search-bar'>
                    <form onSubmit={submitSearch} action="">
                        <FontAwesomeIcon icon={faSearch} color='black' className='fa' />
                        <input type="search" name="q" ref={inputRef} onChange={handleChange} value={query} ></input>
                    </form>
                </div>
            </div>
            {(search === '') ? <SearchEmpty token={props.token} search={search} /> : <SearchResult token={props.token} search={search} /> }
        </>
    )
}

export default SearchBar;
