import React from 'react';
import './AlertComponent.css';
import {FaExclamationCircle} from 'react-icons/fa';
import {MdCancel} from 'react-icons/md';
import {AiFillCheckCircle} from 'react-icons/ai'

const AlertComponent = ({handleAlertChange, message, success})=> {
    return (
        <div className='main-div' >
            <div className='content-Wrapper'>
                {
                    success ? <AiFillCheckCircle style={{display:"block",padding:"20px", margin:"auto"}} size={70} color='green' /> : <FaExclamationCircle style={{display:"block",padding:"20px", margin:"auto"}} size={70} color='red'/>
                }
                <br/>
    <h3 style={{fontSize:"20px", textAlign:'center'}}>{message}</h3>
    <button onClick={()=>handleAlertChange()} className='cancelButton'>
        Ok
    </button>
            </div>
        </div>
    )
}

export default AlertComponent
