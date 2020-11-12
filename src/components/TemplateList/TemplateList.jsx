import React, {useState, useEffect} from 'react';
import './TemplateList.css';
import {useHistory, useLocation} from 'react-router-dom'
import {BiTrashAlt} from 'react-icons/bi';


const TemplateList = ({name, lastEdited, productId, stateView, handleDelete})=> {

    const [globalKey, setGlobalKey] =  useState('')

    const location   = useLocation()

    const history =  useHistory()
    
    useEffect(()=>{
        let locationPath =  location.pathname
        let splittedPath = locationPath.split('/')
        let mainId = splittedPath[1]
        setGlobalKey(mainId)
    },[])

    const handleEditButtonClicked = ()=>{
        if(stateView === 'products'){
            history.push(`/${globalKey}/edit-product/${productId}`)
        } 
        else if(stateView === 'infoBoxTemplates'){
            history.push(`/${globalKey}/edit-info-box/${productId}`)
        }
    }


    return (
        <div className ='quote-box'>
            <div className='quote-list-div'>
    <p>{name}</p>
    <p>Last Edited : {lastEdited}</p>
    <div style={{display:"flex", flexDirection:"row"}}>
    <button className='edit-quotebox' onClick={()=>handleEditButtonClicked()}>Edit</button>
            <BiTrashAlt onClick={()=>handleDelete(productId)} style={{marginTop:"15px", marginLeft:"3px"}} size={30} color='white' />
    </div>
            
            </div>
            
        </div>
    )
}

export default TemplateList
