import React, { useEffect } from 'react';
import './EditCompanyContact.css';
import AlertComponent from '../../components/AlertComponent/AlertComponent';
import EditCompanyContactBox from '../../components/EditCompanyContact/CreateCompanyContact'
import { useState } from 'react';

const EditCompanyContact = ()=> {

    const [alertPresent, setAlertPresent] =  useState('');
    const [message, setMessage] = useState('')
    const [success, setSuccess] = useState(false)



    const handleAlertAlternator = (value)=>{
        setAlertPresent(true)
        setMessage(value)
    }

    const handleAlternatorMessage = (value)=>{
        setMessage(value)
        console.log(value)
    }

    const handleAlertAlternatorFalse  =()=>{
        setAlertPresent(false)
        setSuccess(false)
    }

    const handleSuccess = ()=>{

        setSuccess(true)
    }

    return (
        <div>
        <h1 className='first-h1'>Edit Company Contact</h1>
        <br/><br/>
        {
            alertPresent ? <AlertComponent message={message} success={success}  handleAlertChange = {()=>handleAlertAlternatorFalse()}  /> : ''
        }
        
        <EditCompanyContactBox handleMessage = {(value)=>handleAlternatorMessage(value)}  handleAlerts = {()=>handleAlertAlternator()} handleSuccess ={()=>handleSuccess()}  />
    </div>
    )
}

export default EditCompanyContact
