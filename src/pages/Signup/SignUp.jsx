import React, { useState } from 'react';
import './SignUp.css';
import SignupImages from '../../images/signupImage.png'
import {Link, useHistory} from 'react-router-dom';
import {v4 as uuidv4} from 'uuid';
import {firestore, firebase} from '../../firebase/';
import AuthAlert from '../../components/AuthenticationAlert/authAlert'
import SpinnerComponent from '../../components/spinnerComponent/spinnerComponent'
const SignUp = ()=> {

    const history = useHistory()

    const [email, setEmail] = useState('') 
    const [password, setPassword] =  useState('')
    const [responseSent, setResponseSent] = useState(false)
    const [response, setResponse] = useState({})
    const [responseGotten, setResponseGotten]  =  useState(false)

    const handleEmailForm = (value)=>{
        setEmail(value)
    }

    const handlePasswordForm = (value) =>{
        setPassword(value)
    }

    const handleFormSubmission = ()=>{

        let uniqueId = uuidv4()
        let userData = {
            "email" : email.toLowerCase(),
            "password":password,
            "userId" : uniqueId
        }

        setResponseSent(true)

        fetch('https://93baf421f82c.ngrok.io/fastquoting/us-central1/app/handleSignUp', {
            "method":"POST",
            "body":JSON.stringify(userData),
            headers:{
                'Content-Type' : 'application/json'
            }
        })
        .then(res=>res.json())
        .then(data=>{
            console.log(data)
            if(data.res === 'success'){
                setResponse({
                    "message":"Signed Up Successfully",
                    "outcome":"good",
                    "id":data.userId
                })
                setResponseGotten(true)
                setResponseSent(false)
                setTimeout(()=>{
                    history.push('/login')
                },2000)
            } 
            else if (data.res === 'email exists'){
                setResponse({
                    "message":"Email Already Exists",
                    "outcome":"bad",
                })
                setResponseGotten(true)
                setResponseSent(false)
            } else{
                setResponse({
                    "message":"An Error Occured",
                    "outcome":"bad",
                })
                setResponseGotten(true)
                setResponseSent(false)
            }
        })
        .catch((err)=>{
            console.log(err)
            setResponse({
                "message":"An Error Occured",
                "outcome":"bad",
            })
            setResponseGotten(true)
            setResponseSent(false)
        })
        
    }

    const cancelPopUp = ()=>{
        setResponseGotten(false)
    }

    return (
        <div className= 'main-div-signup'>
            <div>
            <img  className='signup-Image'   src={SignupImages} alt=""/>
            </div>
            <div>
                <h3 className='sign-up-h3'>Sign Up</h3><br/><br/><br/>
                {
                    responseGotten ? <AuthAlert response={response} cancelPop = {()=>cancelPopUp()} /> : ''
                }

                {
                    responseSent ?<SpinnerComponent/> : ''

                }

                
                <input onChange={(event)=>handleEmailForm(event.target.value)}  type="text" placeholder='Email Address' className='input-signup'/><br/><br/>
                <input onChange={(event)=>handlePasswordForm(event.target.value)}  type="password" placeholder='Password' className='input-signup'/><br/><br/>
                <div style={{display:"flex", flexDirection:"row"}}>
                <button className='signupButton' onClick={()=>handleFormSubmission()} >Sign Up</button>
                <Link to='/login'  style={{marginTop:'20px', marginLeft:"10px"}}>Have an Account ? Login</Link>
                </div>
            </div>
        </div>
    )
}

export default SignUp
