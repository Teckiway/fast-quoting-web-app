import React, {useState} from 'react';
import './Login.css';
import LoginImage from '../../images/login-image.png'
import {Link, useHistory} from 'react-router-dom';
import AuthAlert from '../../components/AuthenticationAlert/authAlert';
import SpinnerComponent from '../../components/spinnerComponent/spinnerComponent'

const Login = ()=> {

    const history = useHistory()
    
    const [email, setEmail]  = useState('')
    const [password,setPassword] =  useState('')
    const [responseSent, setResponseSent] =  useState(false)
    const [response, setResponse] =  useState({})
    const [responseGotten, setResponseGotten] = useState(false)

    const handleEmail = (value)=>{
        setEmail(value)
    }

    const handlePassword = (value)=>{
        setPassword(value)
    }

    const handleCancelPop =()=>{
        setResponseGotten(false)
    }

    const handleFormSubmisson = ()=>{

        let userInfo = {
            "email":email.toLowerCase(),
            "password":password
        }

        setResponseSent(true)

        fetch("https://93baf421f82c.ngrok.io/fastquoting/us-central1/app/handleLogin",{
            method:"POST",
            body:JSON.stringify(userInfo),
            headers:{
                'Content-Type' : 'application/json'
            }

        })

        .then(res=>res.json())
        .then(data=>{
            console.log(data)
            setResponseSent(false)
            if(data.res === 'approved'){
                setResponse({
                    "message": "Login Successful - Logging You in Now",
                    "outcome":"good"
                })
                setResponseGotten(true)
            }
            else if (data.res === 'disapproved'){
                setResponse({
                    "message": "Incorrect Email / Password",
                    "outcome": "bad"
                })
                setResponseGotten(true)
            } else if (data.res === 'error'){
                setResponse({
                    "message": "An Error Occured",
                    "outcome": "bad"
                })
                setResponseGotten(true)
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

    return (
        <div className= 'main-div-signup'>
            <div>
            <img  className='signup-Image'   src={LoginImage} alt=""/>
            </div>
            <div>
                <h3 className='sign-up-h3'>Login </h3><br/><br/><br/>
                {
                    responseGotten ? <AuthAlert  cancelPop={()=>handleCancelPop()} response = {response}/> : ''
                }

                {
                    responseSent ?  <SpinnerComponent/> : ''
                }
                <input onChange={(event)=>handleEmail(event.target.value)}  type="text" placeholder='Email Address' className='input-signup'/><br/><br/>
                <input onChange  = {(event)=>handlePassword(event.target.value)} type="password" placeholder='Password' className='input-signup'/><br/><br/>
                <div style={{display:"flex", flexDirection:"row"}}>
                <button onClick={()=>handleFormSubmisson()} className='signupButton' >Login</button>
                <Link style={{marginTop:'20px', marginLeft:"10px"}} to='/forgotten-password'>Forgot Password ?</Link>
                </div>
            </div>
        </div>
    )
}

export default Login
