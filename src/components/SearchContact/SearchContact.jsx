import React,{useState,useEffect} from 'react';
import './SearchContact.css';
import {useHistory, useLocation} from 'react-router-dom';


const SearchContact = ({handleSearchContact, handleResetButton})=> {
    
    const [userId, setUserId] = useState('')
    const [nameOfContactSearched, setNameOfContactSearched] =  useState('')

    const history = useHistory()
    const location =  useLocation()

    useEffect(()=>{
        let locationPath =  location.pathname
        let splittedPath = locationPath.split('/')
        let mainId = splittedPath[1]
        console.log(mainId)
        setUserId(mainId)
    },[])

    const handleNewContact = ()=>{
        history.push(`/${userId}/create-contact`)
    }

    const handleContactNameTyped  = (value)=>{
        setNameOfContactSearched(value)
    }

    const handleSearchButton  = ()=>{
        handleSearchContact(nameOfContactSearched)
    }

    

    return (
        <div className='main-SearchBox'>
            <div className="input-search-section">
            <input type="text" className='input-searchQuote' onChange={(event)=>handleContactNameTyped(event.target.value)}  placeholder='Search by Name of Contact' />
            <button className='search-button' onClick={()=>handleSearchButton()} >Search</button>
            </div>
            <br/><br/>
            <button className='new-Quote-button' onClick={()=>handleNewContact()}>New Contact</button>
        </div>
    )
}

export default SearchContact
