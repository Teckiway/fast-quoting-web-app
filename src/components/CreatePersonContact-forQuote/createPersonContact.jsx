import React from 'react';
import { useState } from 'react';
import './createPersonContact.css';
import {firestore} from '../../firebase/index';
import  {v4 as uuid} from 'uuid';
import {useLocation} from 'react-router-dom'
import { useEffect } from 'react';
import SpinnerComponent from '../spinnerComponent/spinnerComponent'


const CreatePersonContact = ({handleAlerts, handleMessage , handleSuccess, handleDoneButton})=> {

    const location =  useLocation()

    const [firstName ,setFirstName] =  useState('')
    const [lastName, setLastName] = useState('')
    const [email,setEmail]  =  useState('')
    const [companyName, setCompanyName] =  useState('')
    const [phoneNumber, setPhoneNumber ] = useState('')
    const [street, setStreet] =  useState('')
    const [city, setCity] = useState('')
    const [state, setState] =  useState('')
    const [zipCode, setZipCode] =  useState('')
    const [country, setCountry] = useState ('')
    const [userId, setUserId] =  useState('')
    const [loading, setLoading] = useState(false)
    const [contactId, setContactId] = useState('')

    let globalDate = new Date()

    let day = globalDate.getDate()

    let month = globalDate.getMonth() + 1

    let year  = globalDate.getYear()

    let compiledDate = `${day}/${month}/${year}`

    const handleFirstName = (value) =>{
        setFirstName(value)
    }

    const handleLastName = (value)=>{
        setLastName(value)
    }

    const handleEmail = (value)=>{
        setEmail(value)
    }

    const handleCompanyName =  (value)=>{
        setCompanyName(value)
    }

    const handlePhoneNumber = (value)=>{
        setPhoneNumber(value)
    }

    const handleStreet  = (value)=>{
        setStreet(value)
    }

    const handleCity = (value)=>{
        setCity(value)
    }


    const handleState = (value)=>{
        setState(value)
    }

    const handleZipCode = (value)=>{
        setZipCode(value)
    }

    const handleCountry = (value)=>{
        setCountry(value)
    }

    const handleSubmitContact = ()=>{

        let personContact  = {
            "id" : contactId,
            "userEmail" : "amena@clifford@gmail.com",
            "firstName" : firstName,
            "lastName" : lastName,
            "email" : email,
            "phoneNumber" : phoneNumber,
            "companyName" : companyName,
            "street": street,
            "city":city,
            "state" : state,
            "zipCode" : zipCode,
            "country": country,
            "globalKey": userId,
            "lastEdited": compiledDate
        }

        if(email.length === 0 || email === ''){
            handleAlerts()
            handleMessage('Email is Needed Please')
        } else{
            let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            let emailTest = re.test(String(email).toLowerCase());

            if(emailTest === false){
                handleAlerts()
                handleMessage(`${email} is not a Valid Email`) 
            } else{
                setLoading(true)
                firestore.collection("Contacts").doc(contactId)
                .set(personContact)
                .then(()=>{
                    console.log('succeed')
                    setLoading(false)
                    handleAlerts()
                    handleMessage("Saved Successfully!")
                    handleSuccess()
                    handleDoneButton(personContact)
                })
            }
        }

        console.log(personContact)
    }

    useEffect(()=>{
        let pathName = location.pathname

        let splittedPathName = pathName.split('/')
        console.log(splittedPathName)
        let userId = splittedPathName[1]
        setUserId(userId)
        console.log(userId)
        setContactId(uuid())
    },[])

    return (
        <div className='main-create-person-contact-div'>
         <h4 style={{fontSize:'25px', marginLeft:"33px"}}>Person Details</h4>
            <div className='inputfieldWrapper'>
            <input type="text" placeholder='First Name' className='input-field-create-person' onChange={(event)=>{handleFirstName(event.target.value)}}  />
            <input type="text" placeholder='Last Name' className='input-field-create-person' onChange = {(event)=>{handleLastName(event.target.value)}} />
            </div><br/><br/>
            <div> 
            <input type="text" placeholder='Email Address (Required)' className='input-field-create-person-email' onChange={(event)=>handleEmail(event.target.value)} />
            </div><br/><br/>
            <input type="text" placeholder='Company Name' className='input-field-create-person-email' onChange={(event)=>handleCompanyName(event.target.value)} /><br/><br/><br/>

            <input type="tel" placeholder='Phone Number' className='input-field-create-person-email' onChange={(event)=>handlePhoneNumber(event.target.value)} /><br/><br/><br/>
            <h4 style={{fontSize:'25px', marginLeft:"33px"}}>Address</h4>
            <div>
            <input type="text" placeholder='Street' className='input-field-create-person-email' onChange = {(event)=>handleStreet(event.target.value)} /><br/><br/>
            <input type="text" placeholder='City' className='input-field-create-person-email' onChange={(event)=>handleCity(event.target.value)} /><br/><br/>
            <div className='inputfieldWrapper'>
            <input type="text" placeholder='State or Region' className='input-field-create-person' onChange={(event)=>handleState(event.target.value)} />
            <input type="number" placeholder='Zip Code' className='input-field-create-person' onChange={(event)=>handleZipCode(event.target.value)} />
            </div><br/>
            <input type="text" placeholder='Country' className='input-field-create-person-email' onChange={(event)=>handleCountry(event.target.value)} /><br/><br/>
            </div>
{
    loading ?<SpinnerComponent/>:''
}
            <button className='save-contact-btn' onClick={()=>handleSubmitContact()} >Save Contact</button>

        </div>
    )
}

export default CreatePersonContact
