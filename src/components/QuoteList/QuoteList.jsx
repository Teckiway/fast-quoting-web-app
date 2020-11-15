import React,{useState, useEffect} from 'react';
import './QuoteList.css';
import {useHistory, useLocation} from 'react-router-dom';
import {BiTrashAlt} from 'react-icons/bi'

const QuoteList = ({quoteId, lastEdited, title, handleQuoteDelete})=> {

    const history =  useHistory()

    const location =  useLocation()

    const [globalKey, setGlobalKey] = useState('')

    useEffect(()=>{

        let locationPath =  location.pathname
        let splittedPath = locationPath.split('/')
        let mainId = splittedPath[1]
        setGlobalKey(mainId)
    },[])


    const moveToEditQuotes = ()=>{

        history.push(`/${globalKey}/edit-quote/${quoteId}`)
    }

    const handleQuoteDeletePopUp = ()=>{
        handleQuoteDelete(quoteId)
    }

    return (
        <div className ='quote-box'>
            <div className='quote-list-div'>
    <p>{title}</p>
    <p>Last Edited : {lastEdited}</p>
            <button className='edit-quotebox' onClick={()=>moveToEditQuotes()} >Edit</button>
            <BiTrashAlt onClick={()=>handleQuoteDeletePopUp()}  style={{marginTop:"20px"}} size={30} color='white' />
            </div>
            
        </div>
    )
}

export default QuoteList
