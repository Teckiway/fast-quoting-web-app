import React,{useState, useEffect} from 'react'
import './CreateQuoteInfo.css';
import {AiFillCheckCircle,} from 'react-icons/ai'
import {v4 as uuid4} from 'uuid';
import ImageUploader from 'react-images-upload';
import {useHistory, useLocation} from 'react-router-dom'
import {firestore, storage} from '../../firebase';
import SpinnerComponent from '../../components/spinnerComponent/spinnerComponent';
import ImagePreview from '../../components/ImagePreviewComponent/ImagePreview';
import SmallSpinnerComponent from '../../components/smallspinner/spinnerComponent'

const CreateQuoteInfo = ({handleAlertPresentTrue, handleAlertPresentFalse , handleAlertMessage, handleAlertType})=> {
    const [titleText, setTitleText] = useState('')
    const [titleDescription, setTitleDescription] =  useState('')
    const [quoteInfoId, setQuoteInfoId] =  useState('')
    const [doneButtonClicked, setButtonnClicked]  =  useState(false)
    const [imageArray, setImageArray] = useState([])
    const [globalKey, setGlobalKey] =  useState('')
    const [imageUploadPrompted, setImageUploadPrompted] =  useState(false)

    const id = uuid4()

    const location = useLocation()

    let globalDate = new Date()

    let day = globalDate.getDate()

    let month = globalDate.getMonth() + 1

    let year  = globalDate.getFullYear()

    let compiledDate = `${day}/${month}/${year}`

    useEffect(()=>{
        setQuoteInfoId(id)

        let locationPath =  location.pathname
        let splittedPath = locationPath.split('/')
        let mainId = splittedPath[1]
        setGlobalKey(mainId)

    },[])

    const handleTitleText = (value)=>{
        setTitleText(value)
    }

    const handleTitleDescription = (value)=>{
        setTitleDescription(value)
    }

    const infoObject = {
        "id":quoteInfoId,
        "title": titleText,
        "description":titleDescription,
        "globalKey" : globalKey,
        "images" : imageArray,
        "lastEdited" : compiledDate
    }

    const handleButtonClick  = ()=>{

        setButtonnClicked(true)

        firestore.collection("InfoBoxTemplates").doc(quoteInfoId).set(infoObject)
        .then(data=>{
            handleAlertMessage("Saved Successfully")
            handleAlertPresentTrue()
            handleAlertType(true)
            setButtonnClicked(false)
        })


        .catch(()=>{
            handleAlertMessage("An Error Occured, Please Try again")
            handleAlertPresentTrue()
            handleAlertType(true)
            setButtonnClicked(false)
        })

    }

    const handleImageUpload = ()=>{
        
    }

    const handleOnFileChange = (event)=>{
        setImageUploadPrompted(true)
        let file = event[0]
        console.log(file)

        let fileName = file.name + globalKey  + quoteInfoId

        storage.ref(`/${globalKey}/InfoBoxImages/${fileName}`).put(file)
        .then(url=>{
            console.log(url)
            let name = url.metadata.name
            storage.ref(`/${globalKey}/InfoBoxImages`).child(name).getDownloadURL()
            .then(firebaseUrl=>{
                console.log(firebaseUrl)
                let imageObject = {
                    "path": firebaseUrl,
                    "fullPath" : url.metadata.fullPath
                }
                setImageArray([...imageArray, imageObject])
                setImageUploadPrompted(false)
            })
        })

    }

    const handleImageDelete  = (value, key)=>{

        storage.ref(value).delete()
        .then(data=>{
            let dataImages = imageArray

            console.log(dataImages)
            
            if(imageArray.length > 1 ){
                let newData =  dataImages.filter(image=>{
                    return image.fullPath !== value
                })
                setImageArray(newData)

            }
            else{
                setImageArray([])
            }
           
        })
    }

    return (
        <div className='info-area'>
        <div className='info-box'>
            <input onChange={(event)=>handleTitleText(event.target.value)} type="text" className = 'text-header' placeholder='Title of Header' />
        
           <textarea onChange={(event)=>handleTitleDescription(event.target.value)} name="" className="text-desc"placeholder='Description'></textarea>
           <div style={{display:"flex", flexWrap:"wrap"}}>
           {
               imageArray.map((image, i)=>{
                   return <ImagePreview imageLocalId ={i} handleDelete={(value, key)=>handleImageDelete(value, key)} key={i} path={image.path} fullPath={image.fullPath} />
               }) 
           }

            {
               imageUploadPrompted ?  <SmallSpinnerComponent/> : ""
            }

            </div>
           
           <ImageUploader
                withIcon={true}
                buttonText='Upload Image'
                imgExtension={['.jpg', '.gif', '.png', '.gif']}
                maxFileSize={5242880}
                style={{fontFamily: "Rubik, sans-serif"}}
                onChange={(event)=>handleOnFileChange(event)}
                singleImage={true}
            />
        </div> 
        <div className='action-area'>
        <div className='action-buttons'>
        <button onClick={()=>handleButtonClick()} className='done-button'>Create</button>
        </div>

                {
                    doneButtonClicked ? <SpinnerComponent/> : ""
                }
        </div>
        
        </div>
    )
}

export default CreateQuoteInfo
