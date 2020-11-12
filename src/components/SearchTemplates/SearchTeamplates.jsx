import React, {useState, useEffect} from 'react';
import './SearchTemplates.css'
import {useHistory, useLocation} from 'react-router-dom'

const SearchTemplates = ({stateView, handleQueryTemplates})=> {

    const [searchTerm, setSearchTerm]  =  useState('')
    const [globalKey ,  setGlobalKey] = useState('')

    const history = useHistory()

    const location = useLocation()

    useEffect(()=>{
        let locationPath =  location.pathname
        let splittedPath = locationPath.split('/')
        let mainId = splittedPath[1]
        setGlobalKey(mainId)
    },[])

    const handleSearchTerm = (value)=>{
        setSearchTerm(value)
    }

    const handleSearchButtonClicked = ()=>{
        handleQueryTemplates(searchTerm)
    }

    const handleNewTemplateButtonClicked = ()=>{
        if(stateView === 'products'){
            history.push(`/${globalKey}/create-product`)
        } 
        else if(stateView == 'infoBoxTemplates'){
            history.push(`/${globalKey}/create-info-box`)
        }
    }

    const placeHolder = stateView === 'products' ? 'Search Product Templates by Name' : stateView === 'quote-templates' ? 'Search Quote Templates by Title' : stateView === 'infoBoxTemplates' ? "Search Info Box by Name" : ""

    const buttonText =  stateView === 'products' ? 'New Product' : stateView === 'quote-templates' ? 'New Quote Template' : stateView === 'infoBoxTemplates' ? "New Info Box" : ""

    return (
        <div className='main-SearchBox'>
            <div className="input-search-section">
            <input onChange={(event)=>handleSearchTerm(event.target.value)} type="text" className='input-searchQuote' placeholder= {placeHolder} />
            <button className='search-button' onClick={()=>handleSearchButtonClicked()}>Search</button>
            </div>
            <br/><br/>
    <button  className='new-Quote-button' onClick={()=>handleNewTemplateButtonClicked()} >{buttonText}</button>
        </div>
    )
}

export default SearchTemplates
