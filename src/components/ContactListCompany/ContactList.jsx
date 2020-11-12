import React, { useEffect, useState } from 'react';
import './ContactList.css';
import {useHistory, useLocation} from 'react-router-dom';
import {BiTrashAlt} from 'react-icons/bi';
import {firestore} from '../../firebase'

const ContactList = ({name, contactId, lastEdited, changeDataLoadingState, changePopUpTrue, changePopUpFalse})=> {

    const [globalKey, setGlobalKey] =  useState('')

    const history = useHistory()

    const location =  useLocation()

    useEffect(()=>{
        let locationPath =  location.pathname
        let splittedPath = locationPath.split('/')
        let mainId = splittedPath[1]
        console.log(mainId)
        setGlobalKey(mainId)
    },[])
    
    const handleButtonClick =()=>{
        history.push(`/${globalKey}/edit-company-contact/${contactId}`)
    }

    // const handleDelete = ()=>{
    //     firestore.collection("Contacts").doc(contactId).delete()
    //     .then(data=>{
    //         console.log('Done')
    //         changeDataLoadingState()

    //     })
    // }

    return (
        <div className ='contact-box'>
            <div className='contact-box-div'>
            <p>{name}</p>
    <p>Last Edited: {lastEdited}</p>
    <div style={{display:"flex", flexDirection:"row", justifyContent:"space-around", marginRight:"30px"}}>
    <button onClick={()=>handleButtonClick()}  className='edit-contact-box'>Edit</button>
            <BiTrashAlt onClick={()=>changePopUpTrue(contactId)} style={{marginTop:"20px"}} size={30} color='white' />
    </div>
            
            </div>
            
        </div>
    )
}

export default ContactList
