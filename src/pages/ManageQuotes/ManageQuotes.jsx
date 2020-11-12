import React from 'react';
import './ManageQuotes.css';
import SearchQuotes from '../../components/SearchQuotes/SearchQuotes';
import QuoteList from '../../components/QuoteList/QuoteList'

const  ManageQuotes = ()=> {
    return (
        <div>
            <h2 className='h2-ManageQuotes'>Manage Quotes</h2><br/><br/><br/>
            <SearchQuotes/><br/><br/><br/><br/><br/><br/>
            <div className="main-quote-div-list"><br/><br/><br/>
                <QuoteList/>
                <QuoteList/>
                <QuoteList/>
            </div>
        </div>
    )
}

export default ManageQuotes
