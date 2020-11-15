import React,{useState, useEffect} from 'react';
import './SearchQuotes.css';
import {useHistory, useLocation} from 'react-router-dom'

const SearchQuotes = ({handleQuoteSearch})=> {
    const [query, setQuery] = useState('')
    const [globalKey, setGlobalKey] =  useState('')

    const history  = useHistory()

    const location = useLocation()

useEffect(()=>{
    let locationPath =  location.pathname
        let splittedPath = locationPath.split('/')
        let mainId = splittedPath[1]
        setGlobalKey(mainId)
},[])

    const handleTypingQuery = (value)=>{
        setQuery(value)
    }

    const handleQuerySearch = ()=>{
        handleQuoteSearch(query)
    }

    const handleNewQuoteButton = ()=>{
        history.push(`/${globalKey}/new-quote`)
    }

    return (
        <div className='main-SearchBox'>
            <div className="input-search-section">
            <input type="text"  onChange={(event)=>handleTypingQuery(event.target.value)} className='input-searchQuote' placeholder='Search by Name of Quote' />
            <button className='search-button' onClick={()=>handleQuerySearch()} >Search</button>
            </div>
            <br/><br/>
            <button className='new-Quote-button' onClick={()=>handleNewQuoteButton()} >New Quote</button>
        </div>
    )
}

export default SearchQuotes
