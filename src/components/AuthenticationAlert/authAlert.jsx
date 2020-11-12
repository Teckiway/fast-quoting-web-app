import React from 'react';
import './authAlert.css';
import {AiFillExclamationCircle, AiFillCheckCircle} from 'react-icons/ai'
import {MdCancel} from 'react-icons/md'

function AuthAlert({response, cancelPop }) {


const {message, outcome} = response

    return (
        <div className='authAlertDiv'>
            {
                outcome === 'bad' ? <AiFillExclamationCircle color={'red'} size={25} style={{marginTop:'7px', marginLeft:"10px"}} /> : 
                <AiFillCheckCircle color={'green'} size={25} style={{marginTop:'7px', marginLeft:"10px"}} />
            }
            <p style={{marginTop:'10px', marginLeft:"20px"}}>{message}</p>
            <MdCancel onClick={()=>cancelPop()} color={'red'} size={25} style={{marginTop:'7px', marginLeft:"10px"}} />
        </div>
    )
}

export default AuthAlert
