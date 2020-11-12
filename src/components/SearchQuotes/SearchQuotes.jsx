import React from 'react';
import './SearchQuotes.css'

const SearchQuotes = ()=> {
    return (
        <div className='main-SearchBox'>
            <div className="input-search-section">
            <input type="text" className='input-searchQuote' placeholder='Search by Name of Quote' />
            <button className='search-button'>Search</button>
            </div>
            <br/><br/>
            <button className='new-Quote-button'>New Quote</button>
        </div>
    )
}

export default SearchQuotes
