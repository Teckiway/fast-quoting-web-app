import React,{useState} from 'react'
import './CreateContact.css';
import CreatePersonContact from '../../components/CreatePersonContact/createPersonContact';
import CreateCompanyContact from '../../components/createCompnayContact/CreateCompanyContact'
import AlertComponent from '../../components/AlertComponent/AlertComponent';

const CreateContact = ()=> {


    const [alertPresent, setAlertPresent] = useState(false)
    const [message, setMessage] =  useState('')
    const [success, setSuccess] = useState(false)
    const [personContact, setpersonContact] = useState(true)


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

    const handleChangeContactView = ()=>{
        if(personContact ===  true){
            setpersonContact(false)
        } else{
            setpersonContact(true)
        }
    }

    return (
        <div>
            <h1 className='first-h1'>Create a New Contact</h1>
            <br/><br/>
            <div className='contacts-select-div'>
                <button className='create-contact-selector' onClick={()=>handleChangeContactView()} >Create Person Contact</button>
                <button className='create-contact-selector' onClick={()=>handleChangeContactView()}>Create Company Contact</button>
            </div><br/><br/>
            {
                alertPresent ? <AlertComponent message={message} success={success}  handleAlertChange = {()=>handleAlertAlternatorFalse()}  /> : ''
            }
            {
                personContact ? <CreatePersonContact handleMessage = {(value)=>handleAlternatorMessage(value)}  handleAlerts = {()=>handleAlertAlternator()} handleSuccess ={()=>handleSuccess()}  /> : <CreateCompanyContact handleMessage = {(value)=>handleAlternatorMessage(value)}  handleAlerts = {()=>handleAlertAlternator()} handleSuccess ={()=>handleSuccess()} />
            }
            
        </div>
    )
}

export default CreateContact
