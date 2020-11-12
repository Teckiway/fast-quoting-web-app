import React,{useState, useEffect} from 'react';
import './ServicePriceBoxEditor.css';
import {v4 as uuidv4} from 'uuid';
import {AiFillCheckCircle,} from 'react-icons/ai'
import {MdCancel} from 'react-icons/md';
import ImageUploader from 'react-images-upload';
import {useLocation} from 'react-router-dom';
import SpinnerComponent from '../../components/spinnerComponent/spinnerComponent';
import SmallSpinnerComponent from '../../components/smallspinner/spinnerComponent'

import {firebase, firestore, storage} from '../../firebase';
import ImagePreview from '../../components/ImagePreviewComponent/ImagePreview'

const ServicePriceBoxEditor = ({handleAlertPresentTrue, handleAlertMessage, handleAlertType})=> {

    const location =  useLocation()

    const id = uuidv4()


    const [productName, setProductName] = useState('')
    const [productDescription, setProductDescription] = useState('')
    const [unitPrice, setUnitPrice] = useState('')
    const [globalKey, setGlobalKey] = useState('')
    const [itemQuantity, setItemQuantity] =  useState('')
    const [totalPrice, setTotalPrice] = useState('')
    const [productId, setProductId] = useState('')
    const [tax, setTax] =  useState(0)
    const [taxSelection, setTaxSelection] =  useState('No Tax')
    const [typeOfBusiness, setTypeOfBusiness]  = useState('Products')
    const [sumbitButtonClicked, setSubmitButtonClicked] = useState(false)
    const [images, setImages]  =  useState([])
    const [imageUploadPrompted, setImageUploadPrompted] = useState(false)

    const storageRef = storage.ref()

    useEffect(()=>{
        setProductId(id)
        let locationPath =  location.pathname
        let splittedPath = locationPath.split('/')
        let mainId = splittedPath[1]
        setGlobalKey(mainId)
    },[])

    const handleProductName = (value)=>{
        setProductName(value)
    }

    const handleProductDescription = (value)=>{
        setProductDescription(value)
    }

    const handleUnitPrice = (value)=>{
        setUnitPrice(Number(value))
        if(itemQuantity === ''){
            setItemQuantity(1)
            setTotalPrice(Number(value))
        } else{
            setTotalPrice(value * itemQuantity)
        }
    }

    const handleItemQuantity = (value)=>{
        setItemQuantity(Number(value))
        setTotalPrice(Number(value * Number(unitPrice)))
    }

    let taxationFee =(tax * totalPrice) / 100 


    let globalDate = new Date()

    let day = globalDate.getDate()

    let month = globalDate.getMonth() + 1

    let year  = globalDate.getYear()

    let compiledDate = `${day}/${month}/${year}`

    const itemPricingObject = {
        "id" : productId,
        "productName": productName,
        "productDescription" : productDescription,
        "unitPrice": unitPrice,
        "itemQuantity": itemQuantity,
        "totalPrice": totalPrice,
        "globalKey" : globalKey,
        "tax" : taxationFee,
        "totaltaxPriceSum" : totalPrice + taxationFee,
        "typeOfBusiness" : typeOfBusiness,
        "images" : images,
        "taxSelection" : taxSelection,
        "lastEdited" : compiledDate,
    }



    const handleOnDoneButton = ()=>{

        console.log(itemPricingObject)

        setSubmitButtonClicked(true)

        firestore.collection("ProductTemplates").doc(productId).set(itemPricingObject)
        .then(()=>{
            handleAlertMessage("Saved Successfully")
            handleAlertPresentTrue()
            handleAlertType(true)
            setSubmitButtonClicked(false)
        })
        .catch(()=>{
            handleAlertMessage("An Error Occured, Please Try again")
            handleAlertPresentTrue()
            handleAlertType(true)
            setSubmitButtonClicked(false)
        })
        
        
    }

    const handleImageUpload = (event)=>{

        setImageUploadPrompted(true)
        let file =  event[0]
        console.log(file)

        let fileName = file.name + globalKey + productId
        const imageRef = storageRef.child('ProductImages')
        // let Reader = new FileReader()

        // Reader.readAsDataURL(file)

        // Reader.onloadend= (data)=>{
        //     console.log(data)
        // }

        storage.ref(`/${globalKey}/ProductImages/${fileName}`).put(file)
        .then(url=>{
            console.log(url)
            let name = url.metadata.name
            storage.ref(`/${globalKey}/ProductImages`).child(name).getDownloadURL()
            .then(firebaseUrl=>{
                console.log(firebaseUrl)
                let imageObject = {
                    "path": firebaseUrl,
                    "fullPath" : url.metadata.fullPath
                }
                setImages([...images, imageObject])
                setImageUploadPrompted(false)
            })
        })
    }

    const handleTaxSelect = (value)=>{
            if (value === 'No Tax'){
                setTax(0)
                setTaxSelection(value)
            } else{
                setTax(Number(value))
                setTaxSelection(value)
            }
        
    }

    const handleTypeOfBusiness = (value)=>{
        setTypeOfBusiness(value)
    }

    const handleImageDelete  = (value, key)=>{

        storage.ref(value).delete()
        .then(data=>{
            let dataImages = images

            console.log(dataImages)

            if(images.length > 1 ){
                let newData =  dataImages.filter(image=>{
                    return image.fullPath !== value
                })
                setImages(newData)

            }
            else{
                setImages([])
            }
                   
        })
console.log(images)
    }

    return (
        <div className = 'service-box' draggable >
            <div className='price-editor-addons'>
                
            </div>
        <div className = 'priceEditorDiv-flex' >
            <div className="productNameEditor">
            <input onChange={(event)=>handleProductName(event.target.value)}  type="text" className= 'product-name-box' placeholder='Product / Services Name' /> 
            <textarea  onChange={(event)=>handleProductDescription(event.target.value)} type="text" className= 'product-desc-box' placeholder='Product / Services Description'/> 
            {/* <button className='add-image-btn'>Add Image</button>   */}

            <div style={{display:"flex", flexWrap:"wrap"}}>
            {
                images.map((image, i)=>{
                    return <ImagePreview  handleDelete = {(value,key)=>handleImageDelete(value, key)} key={i}   imageLocalId= {i} path={image.path} fullPath={image.fullPath} />
                })
            } 

            {
               imageUploadPrompted ?  <SmallSpinnerComponent/> : ""
            }
           
            </div>
            
            <ImageUploader
                withIcon={true}
                buttonText='Upload Images'
                imgExtension={['.jpg', '.gif', '.png', '.gif']}
                maxFileSize={5242880}
                onChange = {(event)=>handleImageUpload(event)}
                singleImage={true}
            />
            </div>
            <div className="productPricingEditor">
                <div className="productPricing-row-flex">
                <select onChange={(event)=>handleTaxSelect(event.target.value)}  className='options-select'>
                    <option defaultValue value="No Tax" className='options-select'>No Tax</option>
                    <option value='10' className='options-select'>10% Tax</option>
                    </select>
                <select onChange={(event)=>handleTypeOfBusiness(event.target.value)}  className='options-select'>
                    <option value="Product" className='options-select'>Product</option>
                    <option value="Services" className='options-select'>Services</option>
                    </select>
                </div>
                <div className="productUnits-row-flex">
                    <div className="product-form-label-div">
                    <input onChange={(event)=>handleUnitPrice(event.target.value)} type="number" className='input-price' />
                    <p>Unit Price</p>
                    </div>
                    <div className="product-form-label-div">
                <input  onChange={(event)=>handleItemQuantity(event.target.value)} value={itemQuantity}  type="number" className='input-price' />
                    <p>Quantity</p>
                    </div>
                    <div className="product-form-label-div">
                    <input type="text" className='input-price' value={totalPrice} readOnly />
                    <p>Item Total</p>
                    </div>
                    
                </div>
                <div className="button-check-div">
                <button className='done-button' onClick={()=>handleOnDoneButton()} >Create</button>  
                {
                   sumbitButtonClicked ? <SpinnerComponent/> : ""
               
                }
                </div>
            </div>
            </div>
        </div>
    )
}

export default ServicePriceBoxEditor
