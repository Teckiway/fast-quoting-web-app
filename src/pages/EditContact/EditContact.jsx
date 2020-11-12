import React,{useState} from 'react'
import './EditContact.css';
import EditPersonContact from '../../components/EditPersonContact/editPersonContact';
import AlertComponent from '../../components/AlertComponent/AlertComponent';

const CreateContact = ()=> {


    const [alertPresent, setAlertPresent] = useState(false)
    const [message, setMessage] =  useState('')
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
            <h1 className='first-h1'>Edit Person Contact</h1>
            <br/><br/>
            {
                alertPresent ? <AlertComponent message={message} success={success}  handleAlertChange = {()=>handleAlertAlternatorFalse()}  /> : ''
            }
            
            <EditPersonContact handleMessage = {(value)=>handleAlternatorMessage(value)}  handleAlerts = {()=>handleAlertAlternator()} handleSuccess ={()=>handleSuccess()}  />
        </div>
    )
}

export default CreateContact
