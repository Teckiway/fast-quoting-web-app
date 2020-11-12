import React,{useState} from 'react';
import './EditProducts.css';
import {AiOutlineArrowLeft} from 'react-icons/ai';
import EditPriceEditor from '../../components/EditPriceEditor/ServicePriceBoxEditor';
import AlertComponent from '../../components/AlertComponent/AlertComponent';
import {useHistory, useLocation} from 'react-router-dom'
import { useEffect } from 'react';
import { firestore } from 'firebase';

 const EditProducts = ()=> {

     const [alertPresent, setAlertPresent] = useState(false)
     const [alertMessage, setAlertMessage] = useState('')
     const [globalKey, setGlobalKey] =  useState('')
     const [alertType, setAlertType] = useState('')

     const history =  useHistory()

     const location = useLocation()

     const handleAlertPresentTrue = ()=>{
         setAlertPresent(true)
     }

     const handleAlertPresentFalse = ()=>{
         setAlertPresent(false)
     }

     const handleAlertMessage = (value)=>{
         setAlertMessage(value)
     }

     const handleAlertType = (value)=>{
         setAlertType(value)
     }

     useEffect(()=>{
        let locationPath =  location.pathname
        let splittedPath = locationPath.split('/')
        let mainId = splittedPath[1]
        setGlobalKey(mainId)
     },[])

     const handleBackButton = ()=>{
         history.push(`/${globalKey}/manage-templates`)
     }

    return (
        <div>
            <div className="navigation-inner">
                {
                    alertPresent ?  <AlertComponent handleAlertChange={()=>handleAlertPresentFalse()} message={alertMessage} success={alertType} /> : ""

                }
                <div onClick={()=>handleBackButton()} style={{display:"flex", flexDirection:"row", pointer:"cusor"}}>
                    <AiOutlineArrowLeft style={{marginLeft:"10px", marginTop:"15px"}}  size={20}/>
                    <p style={{marginLeft:'10px'}}>Items</p>
                </div> <br/><br/>
                <EditPriceEditor
             handleAlertPresentTrue = {()=>handleAlertPresentTrue()} handleAlertPresentFalse={()=>handleAlertPresentFalse()} handleAlertMessage = {(value)=>handleAlertMessage(value)}   handleAlertType = {(value)=>{handleAlertType(value)}} />
            </div>
        </div>
    )
}

export default EditProducts
