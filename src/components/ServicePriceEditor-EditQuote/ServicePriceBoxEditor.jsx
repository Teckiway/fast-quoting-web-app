import React,{useState, useEffect} from 'react';
import './ServicePriceBoxEditor.css';
import {v4 as uuidv4} from 'uuid';
import {AiFillCheckCircle,} from 'react-icons/ai'
import {MdCancel} from 'react-icons/md';
import ImageUploader from 'react-images-upload';
import {useLocation} from 'react-router-dom';
import {firestore,storage} from '../../firebase';
import SmallSpinnner from '../smallspinner/spinnerComponent'
import ImagePreview from '../ImagePreviewComponent/ImagePreview'

const ServicePriceBoxEditor = ({addObject, taxationState , handleSingleProjectDelete, listOfProducts, itemProduct })=> {

    const location =  useLocation()

    const key = itemProduct.id

    const [productName, setProductName] = useState('')
    const [productDescription, setProductDescription] = useState('')
    const [unitPrice, setUnitPrice] = useState('')
    const [itemQuantity, setItemQuantity] =  useState('')
    const [totalPrice, setTotalPrice] = useState('')
    const [productId, setProductId] = useState('')
    const [globalKey, setGlobalKey] = useState('')
    const [tax, setTax] =  useState(0)
    const [taxSelection, setTaxSelection] =  useState('No Tax')
    const [doneButtonClicked, setDoneButtonClicked] = useState(false)
    const [handleFinalDelete, setHandleFinalDelete] =  useState(false)
    const [lastEdited, setLastEdited] =  useState("")
    const [typeofBusiness, setTypeOfBusiness]  =  useState('')
    const [images, setImages]  = useState([])
    const [imagesNotToBeDeleted, setImagesNotToBeDeleted] = useState([])
    const [IncludedProducts, setIncludedProducts] = useState([])
    const [optionProductClicked, setOptionProductClicked] = useState(false)
    const [imageUploaded, setImageUploadPrompted] =  useState(false)

    let globalDate = new Date()

    let day = globalDate.getDate()

    let month = globalDate.getMonth() + 1

    let year  = globalDate.getYear()

    let compiledDate = `${day}/${month}/${year}`


    useEffect(()=>{
        let locationPath =  location.pathname
        let splittedPath = locationPath.split('/')
        let mainId = splittedPath[1]
        setGlobalKey(mainId)

        const {id, imagesNotToBeDeleted, itemQuantity, productDescription, productImages, productName, tax,totalPrice, totaltaxPriceSum, unitPrice, taxSelection} = itemProduct
        

        setProductId(id)
        setImagesNotToBeDeleted(imagesNotToBeDeleted)
        setItemQuantity(itemQuantity)
        setProductDescription(productDescription)
        setImages(productImages)
        setProductName(productName)
        setTax(tax)
        setTotalPrice(totalPrice)
        setUnitPrice(unitPrice)
        setTaxSelection(taxSelection)

    },[])

    const handleProductName = (value)=>{
        if(value === ''){
            setOptionProductClicked(false)
        }
        setProductName(value)
        setDoneButtonClicked(false)

        let includingProductArray = listOfProducts.filter(product=>{
            return product.productName.trim().toLowerCase().includes(value.trim().toLowerCase())
        })

        if(optionProductClicked === false ){
            setIncludedProducts(includingProductArray)
        }


    }

    const handleProductDescription = (value)=>{
        setProductDescription(value)
        setDoneButtonClicked(false)
    }

    const handleUnitPrice = (value)=>{
        setUnitPrice(Number(value))
        if(itemQuantity === ''){
            setItemQuantity(1)
            setTotalPrice(Number(value))
        } else{
            setTotalPrice(value * itemQuantity)
        }
        setDoneButtonClicked(false)
    }

    const handleItemQuantity = (value)=>{
        setItemQuantity(Number(value))
        setTotalPrice(Number(value * Number(unitPrice)))
        setDoneButtonClicked(false)
    }

    let taxationFee =(tax * totalPrice) / 100 



    const itemPricingObject = {
        "id" : productId,
        "productName": productName,
        "productDescription" : productDescription,
        "unitPrice": unitPrice,
        "itemQuantity": itemQuantity,
        "totalPrice": totalPrice,
        "tax" : taxationFee,
        "totaltaxPriceSum" : totalPrice + taxationFee,
        "productImages" : images,
        "imagesNotToBeDeleted": imagesNotToBeDeleted,
        "taxSelection":taxSelection
    }



    const handleOnDoneButton = ()=>{
        console.log(itemPricingObject)

        addObject(itemPricingObject)

        setDoneButtonClicked(true)
    }

    const handleTaxSelect = (value)=>{
            if (value === 'No Tax'){
                setTax(0)
                setTaxSelection(value)
            } else{
                setTax(Number(value))
                setTaxSelection(value)
            }

        
        setDoneButtonClicked(false)
    }


    const handleTypeOfBusiness = (value)=>{
        setTypeOfBusiness(value)
    }

    const handleTaxClick = ()=>{
        if(taxSelection === "No Tax" && taxationState === "Tax Excluded" ){
                alert("Seems Your Qoute Settings doesn't let you add Tax... Mind Changing the Settings of this Quote above ?")
        } else if (taxSelection === "No Tax" && taxationState === 'No Tax' ){
            alert("Seems Your Qoute Settings doesn't let you add Tax... Mind Changing the Settings of this Quote above ?")
        }
       
    }

    const handleProjectDelete = ()=>{
        let imagesInComponent= images

        if(images.length > 0 && imagesNotToBeDeleted.length > 0){
             imagesInComponent.map(images=>{
                let fullPath = images.fullPath
    
                let imageIncluded = imagesNotToBeDeleted.some(image=>image.fullPath === fullPath)
    
                if(imageIncluded === true){
                    return false
                } else{
                    storage.ref(fullPath).delete()
                    .then(data=>{
                        return true
                    })
                }
                console.log(imageIncluded)
            })
            handleSingleProjectDelete(productId, key)

        } else{
            handleSingleProjectDelete(productId, key)
        }

    }

    const handleSetFinalDelete  = ()=>{
        setHandleFinalDelete(true)
    }

    const clickPopUpProducts = (object)=>{
        let {productName, productDescription, images, itemQuantity, tax  ,totalPrice, totaltaxPriceSum, typeOfBusiness, unitPrice, taxSelection} = object

        setProductName(productName)
        setProductDescription(productDescription)

        setImagesNotToBeDeleted(images)

        setImages(images)
        
        setItemQuantity(itemQuantity)
        setTotalPrice(totalPrice)
        setTax(taxSelection)
        setUnitPrice(unitPrice)
        setTaxSelection(taxSelection)
        setTypeOfBusiness(typeOfBusiness)
        setIncludedProducts([])
        setOptionProductClicked(true)
    }

    
    const handleImageDelete  = (value, key)=>{

        let dataImages = images 

        let notDeletedImages = imagesNotToBeDeleted

        let scanImageNotToBeDeleted = notDeletedImages.some(image=>image.fullPath === value)

        console.log(scanImageNotToBeDeleted)

        if(scanImageNotToBeDeleted === true){
            console.log('yeah')
            console.log(imagesNotToBeDeleted)
            if(images.length > 1 ){
                let newData =  dataImages.filter(image=>{
                    return image.fullPath !== value
                })
                setImages(newData)

            }
            else{
                setImages([])
            }
        }
         else{
             console.log('nahhhhh')
             console.log(imagesNotToBeDeleted)
            storage.ref(value).delete()
            .then(data=>{
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
        }

    }

    const handleImageUpload = (event)=>{

        let file = event[0]
        
        console.log(file)

        let fileName = file.name + globalKey + productId

        setImageUploadPrompted(true)

        
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

    return (
        <div className = 'service-box' >
            <div className='price-editor-addons'>
                {/* {
                  handleFinalDelete === false ?   <MdCancel style={{marginLeft:'20vw', paddingTop:'20px'}} color='red' size={30} onClick={()=>handleSetFinalDelete()} />  : ''
                } */}
                
            </div>
        <div className = 'priceEditorDiv-flex' >
            <div className="productNameEditor">
            <input onChange={(event)=>handleProductName(event.target.value)} value={productName}  type="text" className= 'product-name-box' placeholder='Product / Services Name' /> 
            { IncludedProducts.length > 0 ?
            <div className='select-products'>
             { IncludedProducts.map((product, i)=>{
                 let  productName = product.productName
                 let  firstProductDesc =  product.productDescription
                 let finalProductDesc

                 let splittedDescArray = firstProductDesc.split(" ")
                 if(splittedDescArray.length < 10 || splittedDescArray.length === 10){
                     finalProductDesc = splittedDescArray.join(' ') 
                 } else{
                     let newDescription = splittedDescArray.splice(0,10).join(" ")
                     finalProductDesc = newDescription + "..."
                     console.log(newDescription)
                 }

                 let totalPrice = product.totalPrice
                return <div onClick={()=>clickPopUpProducts(product)} key={i} style={{display:"flex", flexDirection:"row", justifyContent:"space-around"}} className='product-select-card' >
                <div>
                <p>{productName}</p>
                <p>{finalProductDesc}</p>
                </div>
                <div>
                <p>total: {totalPrice}</p>
                </div>
                </div> 
            })
        }
        </div>
                : ""
            }
            <textarea  onChange={(event)=>handleProductDescription(event.target.value)} value={productDescription} type="text" className= 'product-desc-box' placeholder='Product / Services Description'/> 
            {
                images.length > 0 ? <div style={{display:'flex', flexWrap:"wrap"}}>

                    {
                        images.map((image, i)=>{
                            return <ImagePreview handleDelete =  {(value,key)=>handleImageDelete(value, key)} key={i} path={image.path} fullPath = {image.fullPath} imageLocalId ={i} />
                        })
                    }
                    {
                        imageUploaded ? <SmallSpinnner/> : ""
                    }

                </div>
 : ""}
            {/* <button className='add-image-btn'>Add Image</button>   */}
            <ImageUploader
                withIcon={true}
                buttonText='Upload Images'
                imgExtension={['.jpg', '.gif', '.png', '.gif']}
                maxFileSize={5242880}
                onChange={(event)=>handleImageUpload(event)}
            />
            </div>
            <div className="productPricingEditor">
                <div className="productPricing-row-flex">
                <select onClick={()=>handleTaxClick()} onChange={(event)=>handleTaxSelect(event.target.value)}  className='options-select' value={taxSelection} >
                    <option defaultValue value="No Tax" className='options-select'>No Tax</option>
                    <option value='10' className='options-select'>10% Tax</option>
                    </select>
                <select  className='options-select' onChange={(event)=>handleTypeOfBusiness(event.target.value)} value={typeofBusiness}>
                    <option value="Product" className='options-select'>Product</option>
                    <option value="Services" className='options-select'>Services</option>
                    </select>
                </div>
                <div className="productUnits-row-flex">
                    <div className="product-form-label-div">
                    <input value={unitPrice} onChange={(event)=>handleUnitPrice(event.target.value)} type="number" className='input-price' />
                    <p>Unit Price</p>
                    </div>
                    <div className="product-form-label-div">
                <input value={itemQuantity} onChange={(event)=>handleItemQuantity(event.target.value)} value={itemQuantity}  type="number" className='input-price' />
                    <p>Quantity</p>
                    </div>
                    <div className="product-form-label-div">
                    <input type="text" className='input-price' value={totalPrice} readOnly />
                    <p>Item Total</p>
                    </div>
                    
                </div>
                <div className="button-check-div">
                <button className='done-button' onClick={()=>handleOnDoneButton()} >Done</button>
                <button className='done-button' onClick={()=>handleProjectDelete()}>Delete</button>
                {
                 doneButtonClicked ?  <AiFillCheckCircle color='green'size={40}  style={{marginLeft:"30px"}} /> : <div></div>
                }
                </div>
            </div>
            </div>
        </div>
    )
}

export default ServicePriceBoxEditor
