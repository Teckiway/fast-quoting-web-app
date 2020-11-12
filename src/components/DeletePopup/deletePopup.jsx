import React, { useState } from 'react';
import './deletePopup.css';
import SmallSpinner from '../smallspinner/spinnerComponent'

const DeletePopup = ({handleDelete, handleRemovePopUp})=> {

    const [deleteClicked, setDeleteClicked]  =  useState(false)

    const handleDeleteButton = ()=>{
        setDeleteClicked(true)
        handleDelete()
    }

    return (
        <div className='delete-popup-div'>
            <p className='paragraph-text'>Sure you want to delete this contact?</p><br/><br/>
            <div style={{display:"flex", flexDirection:"row", justifyContent:"space-around"}}>
                
    <button  onClick = {()=>handleDeleteButton()} className='yes-delete-popup'>{
        deleteClicked ? <SmallSpinner/> : "Yes"
    }</button>
                <button onClick={()=>handleRemovePopUp()} className='no-delete-popup'>No</button>
            </div>
        </div>
    )
}

export default DeletePopup
