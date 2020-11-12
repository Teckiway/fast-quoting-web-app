import React,{useState, useEffect} from 'react'
import './QuoteInfo.css';
import {Draggable} from 'react-beautiful-dnd'
import {AiFillCheckCircle,} from 'react-icons/ai'
import {v4 as uuid4} from 'uuid';
import {useHistory, useLocation} from 'react-router-dom'
import ImagePreview from '../ImagePreviewComponent/ImagePreview';
import SpinnerComponent from '../smallspinner/spinnerComponent';
import ImageUploader from 'react-images-upload';
import {firestore, storage} from '../../firebase'

const QuoteInfo = ({handleInfoAddition, indexNumber , handleInfoBoxDelete, listOfInfoBox})=> {

    const location   = useLocation()

    const [titleText, setTitleText] = useState('')
    const [titleDescription, setTitleDescription] =  useState('')
    const [quoteInfoId, setQuoteInfoId] =  useState('')
    const [doneButtonClicked, setButtonnClicked]  =  useState(false)
    const [imageArray, setImageArray] = useState([])
    const [imageNotToBeDeleted, setImagesNotToBeDeleted] = useState([]) 
    const [divObjectClicked, setDivObjectClicked] =  useState(false)
    const [imageUploadPrompted, setImageUploadPrompted] =  useState(false)
    const [globalKey, setGlobalKey] =  useState('')
    const [infoBoxList, setInfoBoxList] =  useState([])
    const [IncludingInfoBox, setIncludingInfoBox] =  useState([])


    const id = uuid4()

    useEffect(()=>{
        setQuoteInfoId(id)

        let locationPath =  location.pathname
        let splittedPath = locationPath.split('/')
        let mainId = splittedPath[1]
        setGlobalKey(mainId)
    },[])

    const handleTitleText = (value)=>{
        if(value === ''){
            setDivObjectClicked(false)
        }
        setTitleText(value)
        setButtonnClicked(false)

        let resultingArrayInfoBox = listOfInfoBox.filter(infoBox=>{
            return infoBox.title.trim().toLowerCase().includes(value.trim().toLowerCase())
        })

        if(divObjectClicked ===  false){
            setIncludingInfoBox(resultingArrayInfoBox)
            console.log(resultingArrayInfoBox)
        }

    }

    const handleTitleDescription = (value)=>{
        setTitleDescription(value)
    }

    const infoObject = {
        "id":quoteInfoId,
        "title": titleText,
        "description":titleDescription,
    }

    const handleButtonClick  = ()=>{
         setButtonnClicked(true)

         handleInfoAddition(infoObject)
    }

    const handleInfoBoxTrash = ()=>{

        let imagesInComponent = imageArray


        if(imageArray.length > 0 && imageNotToBeDeleted.length > 0){

            imagesInComponent.map(images=>{
                
               let fullPath = images.fullPath
   
               let imageIncluded = imageNotToBeDeleted.some(image=>image.fullPath === fullPath)
   
               if(imageIncluded === true){
                   return false
               } else{
                   storage.ref(fullPath).delete()
                   .then(data=>{
                       return true
                   })
               }

            console.log(imageNotToBeDeleted)

            console.log(imageIncluded)
           })
           handleInfoBoxDelete(infoObject, indexNumber)

       } else{
        handleInfoBoxDelete(infoObject, indexNumber)
       }
    }

    const handleImageUpload = (event)=>{
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

    const handlePopUpClicked = (infoBoxDetails)=>{

        const {title, description, images} = infoBoxDetails

        setTitleText(title)

        setTitleDescription(description)

        setImageArray(images)

        setImagesNotToBeDeleted(images)

        console.log(images)
        setIncludingInfoBox([])

    }

    const handleImageDelete = (value)=>{

        console.log(value)

        let dataImages = imageArray

        let notDeletedImages = imageNotToBeDeleted

        let scanImageNotToBeDeleted = notDeletedImages.some(image=>image.fullPath === value)

        console.log(scanImageNotToBeDeleted)

        if(scanImageNotToBeDeleted === true){
            console.log('yeah')
            console.log(imageNotToBeDeleted)
            if(imageArray.length > 1 ){
                let newData =  dataImages.filter(image=>{
                    return image.fullPath !== value
                })
                setImageArray(newData)

            }
            else{
                setImageArray([])
            }
        }
         else{
             console.log('nahhhhh')
            storage.ref(value).delete()
            .then(data=>{
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


    }

    return (
        <div className='info-area'>
        <div className='info-box'>
            <input value={titleText} onChange={(event)=>handleTitleText(event.target.value)} type="text" className = 'text-header' placeholder='Title of Header' /><br/>
            {  IncludingInfoBox.length > 0 ?
            <div className='select-infoBox' >
                
                {
                    IncludingInfoBox.map((infoBoxDetails, i)=>{
                        let title = infoBoxDetails.title
                        let infoBoxDescription =  infoBoxDetails.description
                        let finalProductDesc

                 let splittedDescArray = infoBoxDescription.split(" ")

                 if(splittedDescArray.length < 10 || splittedDescArray.length === 10){
                     finalProductDesc = splittedDescArray.join('') 
                 } else{
                     let newDescription = splittedDescArray.splice(0,10).join(" ")
                     finalProductDesc = newDescription + "..."
                     console.log(newDescription)
                 }
                        return <div onClick={()=>handlePopUpClicked(infoBoxDetails)} key={i} className='infoBox-select-card'>
                            <div>
                <p>{title}</p>
                <p>{finalProductDesc}</p>
                </div>
                        </div>
                    })
                }
            </div>
:""}
           <textarea value={titleDescription} onChange={(event)=>handleTitleDescription(event.target.value)} name="" className="text-desc"placeholder='Description'></textarea>
           <div style={{display:"flex", flexWrap:"wrap"}}>
           {
               imageArray.length > 0 ? imageArray.map((image,i)=>{
                   return <ImagePreview key={i} fullPath = {image.fullPath} path = {image.path} handleDelete={(value)=>handleImageDelete(value)} />
               }) : ""  
           }
           {
               imageUploadPrompted ? <SpinnerComponent/> : ""
           }
           </div>
           <ImageUploader
                withIcon={true}
                buttonText='Upload Image'
                imgExtension={['.jpg', '.gif', '.png', '.gif']}
                maxFileSize={5242880}
                style={{fontFamily: "Rubik, sans-serif"}}
                onChange={(event)=>handleImageUpload(event)}
                singleImage={true}
            />
        </div> 
        <div className='action-area'>
        <div className='action-buttons'>
        <button onClick={()=>handleButtonClick()} className='done-button'>Done</button>
        <button onClick={()=>handleInfoBoxTrash()} className='delete-button'>Delete</button>
        </div>
        {
               doneButtonClicked ?     <AiFillCheckCircle size={30} color= 'green'  className='check-icon'/> : ''
        }
        </div>
        
        </div>
    )
}

export default QuoteInfo
