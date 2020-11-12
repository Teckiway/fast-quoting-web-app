import React, {useState} from 'react';
import './ImagePreview.css';
import {MdCancel} from 'react-icons/md';

const ImagePreview = ({path, handleDelete, imageLocalId, fullPath, })=> {

    const [deleteVisable, setDeleteVisable] = useState(false)

     const handleDeleteVisableChange = ()=>{
         if(deleteVisable ===  true){
             setDeleteVisable(false)
         } else{
            setDeleteVisable(true)
         }
         
     } 

     const handleDeleteClicked = ()=>{
         handleDelete(fullPath, imageLocalId)
     }

    return (
        <div onMouseEnter = {()=>handleDeleteVisableChange()}  onMouseLeave={()=>handleDeleteVisableChange()} >
{
    deleteVisable ? <MdCancel onClick={()=>handleDeleteClicked()} style={{float:"right", position:"absolute"}} size={20} color='red' />
 : ""
}
            <img src= {path} alt="bla"  className='image-preview'/>
        </div>
    )
}

export default ImagePreview
