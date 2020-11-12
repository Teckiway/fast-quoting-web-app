import React,{useState, useEffect} from 'react'
import './EditQuoteInfo.css';
import {AiFillCheckCircle,} from 'react-icons/ai'
import {v4 as uuid4} from 'uuid';
import ImageUploader from 'react-images-upload';
import {useHistory, useLocation} from 'react-router-dom'
import {firestore, storage} from '../../firebase';
import SpinnerComponent from '../../components/spinnerComponent/spinnerComponent';
import ImagePreview from '../../components/ImagePreviewComponent/ImagePreview';
import SmallSpinnerComponent from '../../components/smallspinner/spinnerComponent'

const EditQuoteInfo = ({handleAlertPresentTrue, handleAlertPresentFalse , handleAlertMessage, handleAlertType})=> {
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

    let year  = globalDate.getYear()

    let compiledDate = `${day}/${month}/${year}`

    useEffect(()=>{
    
        let locationPath =  location.pathname
        let splittedPath = locationPath.split('/')
        let mainId = splittedPath[1]
        let infoBoxId = splittedPath[splittedPath.length - 1]
        firestore.collection("InfoBoxTemplates").doc(infoBoxId).get()
        .then(data=>{
            let resultingData =  data.data()

            const {title, description, globalKey, images , id } =  resultingData

            setTitleText(title)
            setTitleDescription(description)
            setGlobalKey(globalKey)
            setImageArray(images)
            setQuoteInfoId(id)
        })

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

           handleButtonClick()

           
        })
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

    

    return (
        <div className='info-area'>
        <div className='info-box'>
            <input value={titleText} onChange={(event)=>handleTitleText(event.target.value)} type="text" className = 'text-header' placeholder='Title of Header' />
           <textarea value={titleDescription} onChange={(event)=>handleTitleDescription(event.target.value)} name="" className="text-desc"placeholder='Description'></textarea>
           <div style={{display:"flex", flexWrap:"wrap"}}>
           {
               imageArray.map((image, i)=>{
                   return <ImagePreview key={i} imageLocalId = {i} path={image.path} fullPath = {image.fullPath} handleDelete={(value, key)=>handleImageDelete(value, key)} />
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
        <button onClick={()=>handleButtonClick()} className='done-button'>Save</button>
        </div>

                {
                    doneButtonClicked ? <SpinnerComponent/> : ""
                }
        </div>
        
        </div>
    )
}

export default EditQuoteInfo
