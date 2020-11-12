import React, { useEffect, useState } from 'react';
import './CreateCompanyContact.css'
import  {v4 as uuid} from 'uuid';
import SpinnerComponent from '../spinnerComponent/spinnerComponent'
import {firestore, firebase} from '../../firebase';
import {useLocation} from 'react-router-dom'



const  CreateCompanyContact = ({handleAlerts, handleMessage , handleSuccess})=> {
    
    const [companyId, setCompanyId] =  useState('')
    const [companyName, setCompanyName] = useState('')
    const [companyEmail, setcompanyEmail] = useState('')
    const [phoneNumber, setPhoneNumber] = useState('')
    const [street, setStreet] =  useState('')
    const [city, setCity] = useState('')
    const [state, setState] = useState('')
    const [zipCode, setZipCode] = useState('')
    const [country, setCountry] = useState('')
    const [loading, setLoading]  = useState(false)
    const [globalKey, setGlobalKey] = useState('')

    const location = useLocation()

    useEffect(()=>{
        let pathName = location.pathname

        let splittedPathName = pathName.split('/')
        console.log(splittedPathName)
        let userId = splittedPathName[1]
        setGlobalKey(userId)
        console.log(userId)
        let randomId = uuid()
        setCompanyId(randomId)
    },[])

    let globalDate = new Date()

    let day = globalDate.getDate()

    let month = globalDate.getMonth() + 1

    let year  = globalDate.getYear()

    let compiledDate = `${day}/${month}/${year}`

    const handleCompanyName = (value)=>{
        setCompanyName(value)
    }

    const handleEmailAddress =  (value)=>{
        setcompanyEmail(value)
    }

    const handlePhoneNumber =  (value)=>{
        setPhoneNumber(value)
    }

    const handleStreet = (value)=>{
        setStreet(value)
    }

    const handleCity = (value)=>{
        setCity(value)
    }

    const handleState = (value)=>{
        setState(value)
    }

    const handleZipCode  = (value)=>{
        setZipCode(value)
    }

    const handleCountry = (value)=>{
        setCountry(value)
    }

    const handleFormSumission = ()=>{
        let companyData = {
            "companyId" : companyId,
            "companyName" : companyName,
            "companyEmail" : companyEmail,
            "companyPhoneNumber" : phoneNumber,
            "globalKey" : globalKey,
            "street": street,
            "city" : city,
            "state": state,
            "zipCode" : zipCode,
            "country" : country,
            "lastEdited": compiledDate
        }

        console.log(companyData)

        if(companyEmail.length === 0 || companyEmail === ''){
            handleAlerts()
            handleMessage('Email is Needed Please')
        } else{
            let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            let emailTest = re.test(String(companyEmail).toLowerCase());

            if(emailTest === false){
                handleAlerts()
                handleMessage(`${companyEmail} is not a Valid Email`) 
            } else{
                setLoading(true)
                setLoading(true)
                firestore.collection("companyContacts").doc(companyId)
                .set(companyData)
                .then(()=>{
                    console.log('succeed')
                    setLoading(false)
                    handleAlerts()
                    handleMessage("Saved Successfully!")
                    handleSuccess()
                })
            } 
        }
    }

    return (
        <div className='main-create-companyContact'>
             <h4 style={{fontSize:'25px', marginLeft:"33px"}}>Company Details</h4>
            <input type="text" className='input-field-create-company'placeholder='Company Name' onChange= {(event)=>handleCompanyName(event.target.value)} /><br/><br/>
            <div className='create-contact-wrapper'>
            <input type="email" className='input-field-create-company-short'placeholder='Email Address' onChange = {(event)=>handleEmailAddress(event.target.value)} /><br/><br/>
            <input type="phone" className='input-field-create-company-short'placeholder='Phone Number' onChange = {(event)=>handlePhoneNumber(event.target.value)} /><br/><br/>
            </div>
            <h4 style={{fontSize:'25px', marginLeft:"33px"}}>Address</h4>
            <div>
            <input type="text" placeholder='Street' className='input-field-create-person-email'  onChange = {(event)=>handleStreet(event.target.value)} /><br/><br/>
            <input type="text" placeholder='City' className='input-field-create-person-email' onChange ={(event)=>handleCity(event.target.value)} /><br/><br/>
            <div className='inputfieldWrapper'>
            <input type="text" placeholder='State or Region' className='input-field-create-person' onChange = {(event)=>handleState(event.target.value)} />
            <input type="number" placeholder='Zip Code' className='input-field-create-person' onChange ={(event)=>handleZipCode(event.target.value)} />
            </div><br/>
            <input type="text" placeholder='Country' className='input-field-create-person-email' onChange = {(event)=>handleCountry(event.target.value)}/><br/><br/>
            </div>

            {
                loading ? <SpinnerComponent/> : ''
            }
            <button className='save-contact-btn' onClick={()=>handleFormSumission()} >Save Contact</button>

        </div>
    )
}

export default CreateCompanyContact
