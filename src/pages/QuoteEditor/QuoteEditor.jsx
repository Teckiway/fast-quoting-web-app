import React, { useEffect, useState } from 'react'
import './QuoteEditor.css';
import ServicePriceBoxEditor from '../../components/ServicePriceEditor/ServicePriceBoxEditor'
import QuoteInfo from '../../components/QuoteInfo/QuoteInfo';
import {useHistory, useLocation} from 'react-router-dom'
import { firestore } from '../../firebase';
import {v4 as uuid} from 'uuid';
import CreateContact from '../../components/CreatePersonContact-forQuote/createPersonContact';
import AlertComponent from '../../components/AlertComponent/AlertComponent'

const QuoteEditor = ()=> {

     const location = useLocation()

     const id = uuid()

    const [moreSettingsClicked, setMoreSettingsClicked] = useState(false)
    const [itemObject, setItemObject] = useState([])
    const [subTotal,setSubTotal] = useState(0.00)
    const [taxTotal, setTaxTotal] =  useState(0.00)
    const [totalSum, setTotalSum ] =  useState(0.00)
    const [taxState, setTaxState] =  useState('Tax Exclusive (Inclusive Total)')
    const [numberOfItems, setNumberofItems] =  useState([])
    const [numberOfInfoBox, setNumberOfInfoBox] =  useState([])
    const [infoBoxObjects, setInfoBoxObjects] =  useState([])
    const [contacts, setContacts] = useState([])
    const [quoteId, setQuoteId] = useState('')
    const [globalKey, setGlobalKey] =  useState('')
    const [compiledDates, setCompiledDate] = useState('')
    const [contactClicked, setContactClicked] = useState(false)
    const [finalContactObject, setFinalContactObject] = useState({})
    const [finalDisplayName, setFinalDisplayName] = useState('')
    const [contactOptions, setContactOptions] = useState([])
    const [listOfProducts, setListOfProducts] = useState([])
    const [listOfInfoBox, setListInfoBox] =  useState([])
    const [createContactActive, setCreateContactActive] = useState(false)
    const [viewCreateContactButton, setViewCreateContactButton]  =  useState(false)
    const [alertPresent, setAlertPresent] = useState(false)
    const [alertType, setAlertType] = useState(false)
    const [alertMessage, setAlertMessage] = useState('')

    const date = new Date()
    const year = date.getFullYear()
    const day = date.getDate()
    const month = date.getMonth()
    const monthStringList = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"]
    const monthString = monthStringList[month]

    const fullDate = `${monthString}, ${day} ${year}`


    let compiledDate = `${day}/${month+1}/${year}`

    useEffect(()=>{
    let id  = uuid()
        console.log(fullDate)
        setCompiledDate(compiledDate)
        let locationPath =  location.pathname
        let splittedPath = locationPath.split('/')
        let mainId = splittedPath[1]
        setGlobalKey(mainId)
        setQuoteId(id)

        setNumberOfInfoBox([...numberOfInfoBox, id])
        setNumberofItems([...numberOfItems, id])

        firestore.collection("Contacts").where("globalKey", "==" ,mainId).get()
        .then(querySnapShot=>{
            let data = querySnapShot.docs.map(doc=>doc.data())
            if(data.length > 0){
                console.log(data)
                setContacts(data)
            } else{
                setContacts([])
            }
        })

        firestore.collection("ProductTemplates").where("globalKey", "==", mainId).get()
        .then(querySnapShot=>{
            let data = querySnapShot.docs.map(doc=>doc.data())
            if(data.length > 0){
                console.log(data)
                setListOfProducts(data)
            } else{
                setListOfProducts([])
            }
        })

        firestore.collection("InfoBoxTemplates").where("globalKey", "==", mainId).get()
        .then(querySnapShot=>{
            let data  = querySnapShot.docs.map(doc=>doc.data())
            if(data.length > 0){
                console.log(data)
                setListInfoBox(data)
            } else{
                setListInfoBox([])
            }
        })

    },[])

    

    const handleMoreSettingsClicked = ()=>{
        setMoreSettingsClicked(true)
    }

    const handlePriceEditor = (value)=>{
        console.log(value)
        console.log(itemObject.length)
        let newObject = itemObject
        if(itemObject.length === 0){
            let newTotalPrice = value.totalPrice
            let newTotalTax = value.tax
            let newTaxandTotal = value.totaltaxPriceSum
            setTaxTotal(newTotalTax)
            setSubTotal(newTotalPrice)
            setTotalSum(newTaxandTotal)
            console.log(newTotalPrice)
            setItemObject([...itemObject, value])
        } else{
            if(itemObject.some(product=>product.id === value.id)){
                console.log(true)
                let uneditedObjects = itemObject.filter(products=>{
                    return products.id !== value.id
                })
                const focusedObjectIndex = itemObject.findIndex(product=>product.id === value.id)
                console.log(focusedObjectIndex)
                 uneditedObjects.splice(focusedObjectIndex, 0  , value)
                console.log(uneditedObjects)
               let newTotalPrice =  uneditedObjects.reduce((accumulator, num)=>{
                    return accumulator + num.totalPrice
                }, 0)

                let newTotalTax = uneditedObjects.reduce((accumulator, num)=>{
                    return accumulator + num.tax
                }, 0)

                let newTotalSum = uneditedObjects.reduce((accumulator, num)=>{
                    return accumulator + num.totaltaxPriceSum
                }, 0)

                console.log(newTotalPrice)
                console.log(newTotalTax)
                setSubTotal(newTotalPrice)
                setTaxTotal(newTotalTax)
                setTotalSum(newTotalSum)
                setItemObject(uneditedObjects)
            } else{
                console.log(false)
                setItemObject([...itemObject, value])
            newObject.push(value)
        let newTotalPrice = newObject.reduce((accumulator, num)=>{
            console.log(accumulator, num.totalPrice)
            return accumulator + num.totalPrice
        },0)

        let newTotalTax = newObject.reduce((accumulator, num)=>{
            return accumulator + num.tax
        },0)

        let newTotalSum =  newObject.reduce((accumulator, num)=>{
            return accumulator + num.totaltaxPriceSum
        },0)
        console.log(newTotalSum, newTotalTax, newTotalPrice)
        console.log(newObject, newTotalPrice)
        setSubTotal(newTotalPrice)
        setTaxTotal(newTotalTax)
        setTotalSum(newTotalSum)
            }
            
    }
    }

    const handleTaxStateChange = (value)=>{
        console.log(value)
        setTaxState(value)
    }

    const handleNumberofItems  = ()=>{
        setNumberofItems([...numberOfItems, id])
    }
    
   const handleSingleProjectDelete  = (value, key)=>{
       if(itemObject.some(product=>product.id === value)){

           console.log(true)
           let newItems = itemObject

           let resultingItems = newItems.filter(items=>{
               return items.id !== value
           })

           let newTotalPrice =  resultingItems.reduce((accumulator, num)=>{
            return accumulator + num.totalPrice
            }, 0)

        let newTotalTax = resultingItems.reduce((accumulator, num)=>{
            return accumulator + num.tax
        }, 0)

        let newTotalSum = resultingItems.reduce((accumulator, num)=>{
            return accumulator + num.totaltaxPriceSum
        }, 0)

           console.log(resultingItems)
           console.log(newTotalPrice, newTotalSum, newTotalTax)

                setSubTotal(newTotalPrice)
                setTaxTotal(newTotalTax)
                setTotalSum(newTotalSum)
                setItemObject(resultingItems)

              let newNumberOfItemsArray = numberOfItems.filter(number=>{
                  return number !== key
              })
              console.log(newNumberOfItemsArray)
              if(numberOfItems.length === 0){
                  setNumberofItems([...numberOfItems, id])
              } else{
                  console.log('hi')
              }

             } else{
                 console.log('hi')
                 
          let currentNumberOfItems = numberOfItems

          let newListOfItems = numberOfItems.filter(number=>{
              return number !== key
          })

          
            setNumberofItems(newListOfItems)

            console.log(newListOfItems)


            if(newListOfItems.length === 0){
                let newNumberOfItem = newListOfItems
                console.log(numberOfItems)
                newNumberOfItem.push(1)
                setNumberofItems(newNumberOfItem)
                console.log(newNumberOfItem)
            }
       }
   }

   const handleSetInfoBoxes = (object)=>{
       if(infoBoxObjects.length === 0){
           setInfoBoxObjects([...infoBoxObjects,object ])
       }
       else{
           if(infoBoxObjects.some(infoObject=>infoObject.id === object.id)){
               console.log(true)

               let uneditedInfoObjects = infoBoxObjects.filter(infoBox=>{
                   return infoBox.id !== object.id
               })

               console.log(uneditedInfoObjects)

               let indexOfFocusedInfoBox = infoBoxObjects.findIndex(infoBox=>infoBox.id === object.id)

               console.log(indexOfFocusedInfoBox)

               uneditedInfoObjects.splice(indexOfFocusedInfoBox, 0  ,object)
               console.log(uneditedInfoObjects)
               setInfoBoxObjects(uneditedInfoObjects)
           } else{
               setInfoBoxObjects([...infoBoxObjects, object])

           }
       }
   }

   const handleNumberoFInfoBox = ()=>{
    setNumberOfInfoBox([...numberOfInfoBox, id ])
   }


   const handleInfoBoxDelete = (value, key)=>{
       if(infoBoxObjects.some(infoBox=>infoBox.id === value.id)){
           console.log(true)
           
           if(numberOfInfoBox.length > 1){

           let newInfoBoxArray = infoBoxObjects.filter(infoBox=>{
               return infoBox.id !== value.id
           })

           console.log(numberOfInfoBox, key)
           console.log(newInfoBoxArray)

           let localNumberOfInfoBoxes = numberOfInfoBox

          let newNumberOfInfoBoxs =  localNumberOfInfoBoxes.filter(numbers=>{
              return numbers !== key
          })


           setNumberOfInfoBox(newNumberOfInfoBoxs)
            
        }
        else{
           console.log('yes') 
        }
    } else{
        console.log('no')
        if(numberOfInfoBox.length > 1){

            let localNumberOfInfoBoxes = numberOfInfoBox

            let newNumberOfInfoBoxs =  localNumberOfInfoBoxes.filter((numbers,i)=>{
                return  numbers !== key
            })
  
             console.log('done')

             console.log(numberOfInfoBox)

             console.log(newNumberOfInfoBoxs)

             setNumberOfInfoBox(newNumberOfInfoBoxs) 
        }
        
    }
       
   }

   const handleClientNameSelect = (value)=>{
       if(value === ''){
           setContactClicked(false)
           setContactOptions([])
           setViewCreateContactButton(true)
       } else{
        let contactsToBeFiltered = contacts

        let filteredContacts = contactsToBeFiltered.filter(contact=>{
            let contactFullName = contact.firstName + contact.lastName
            return contactFullName.trim().toLowerCase().includes(value.trim().toLowerCase())
        })
        console.log(filteredContacts)
 
        if(filteredContacts.length > 0){
            setContactOptions(filteredContacts)
            setViewCreateContactButton(false)
        } else{
            setViewCreateContactButton(true)

        }
           }


       setFinalDisplayName(value)

      


   }

   const handleContactPopUp = (contactObject)=>{
       setContactClicked(true)
       setFinalContactObject(contactObject)
       setFinalDisplayName(`${contactObject.firstName} ${contactObject.lastName}`)
   }

   const handleClickCreateContactButton = ()=>{
       if(createContactActive === true){
        setCreateContactActive(false)
       } else{
           setCreateContactActive(true)
       }
   }

   const handleContactCreated = (object)=>{

    setFinalContactObject(object)
    setCreateContactActive(false)
    setFinalDisplayName(`${object.firstName} ${object.lastName}`)
    setViewCreateContactButton(false)
    setContactClicked(true)
   }

   const handleAlertAlternator = (value)=>{
   setAlertPresent(true)
    setAlertMessage(value)
}

const handleAlternatorMessage = (value)=>{
    setAlertMessage(value)
    console.log(value)
}

const handleAlertAlternatorFalse  =()=>{
    setAlertPresent(false)
    setAlertType(false)
}

const handleSuccess = ()=>{
    setAlertType(true)
}

    return (
        <div className='main-qouing-window'>
            <div className="top-section">
            <div className="to-main-section">
            <div className="to-section">
                <h3 className='to-text'>To</h3>
                <div>
                <input type="text" name="" value={finalDisplayName}  className='to-inputBox' onChange={(event)=>handleClientNameSelect(event.target.value)} />

{ contactClicked === false && contactOptions.length > 0 ?

<div className='to-input-pop-up'>
{
  contactOptions.map((contact, i)=>{
        return <div className='contact-card' key = {i} onClick = {()=>handleContactPopUp(contact)} >
            <p>Name: {contact.firstName + "" + contact.lastName}</p><br/>
            <p>Email: {contact.email}</p>
        </div>
    })
  
      }
            </div>
: viewCreateContactButton ? 
<div  onClick={()=>handleClickCreateContactButton()} className='create-contact-button'>
<p>Create New Contact</p>
</div>:""}
                </div>
                
            </div>
            
            <h4 className='to-option-suggestions'>User Name /  Email Address </h4>
            
            <div>
            
    
            </div>
            </div>
            <div className={moreSettingsClicked ? 'top-section-divider-opened' :'top-section-divider'}></div>
            <div className='settings-section'>
                <h4>Settings (Quote Settings)</h4>
                <div>
                <p>Payment Due</p>
                <input type="text" name=""  className='paymentDue-box' placeholder='13th November 2020 8:45 PM ' />
                </div>
                {
                   moreSettingsClicked ? <div className='more-settings-div'>
                       <div>
                       <p>Date</p>
                    <input type="text" name="" className='paymentDue-box' placeholder={fullDate} />
                       </div>
                       <div>
                       <p>From</p>
                       <select name="" id="" className='options-select'>
                           <option value="Amena Cliff">Amena Cliff</option>
                       </select>
                       </div>
                       <div>
                       <p>Total Sum (Tax Factors)</p>
                       <select onChange= {(event)=>handleTaxStateChange(event.target.value)}  name="" id="" className='options-select'>
                           <option defaultValue value="Tax Exclusive (Inclusive Total)">Tax Exclusive (Inclusive Total)</option>
                           <option value="Tax Inlcuded">Tax Included</option>
                           <option value="Tax Excluded">Tax Excluded</option>
                           <option value="No Tax">No Tax</option>
                       </select>
                       </div>
                </div>
                : ''}
                
                { moreSettingsClicked === false ?
                    <button className='extend-settings-buttons' onClick={()=>handleMoreSettingsClicked()}>More Settings</button>

                : <button className='extend-settings-buttons' onClick={()=>setMoreSettingsClicked(false)}>Hide Settings</button> }
            </div>
            </div>
            
            <div className="title-name-section"><br/><br/>
            <input type="text" className= 'title-name-box' placeholder='Title of Quote' />    
            </div>

{
    createContactActive ?  <div className='create-contact-div'><br/>

    {
        alertPresent ? <AlertComponent message={alertMessage} success={alertType}  handleAlertChange = {()=>handleAlertAlternatorFalse()}  /> : ""
    }
            
    <button className='cancelCreateContactModal' onClick={()=>handleClickCreateContactButton()} >Cancel</button>
    <br/><br/><br/>
 <CreateContact handleDoneButton={(object)=>handleContactCreated(object)}   handleMessage = {(value)=>handleAlternatorMessage(value)}  handleAlerts = {()=>handleAlertAlternator()} handleSuccess ={()=>handleSuccess()} /> 

    </div> : ""
}
           

<div className='items-list-div' onDragOver={(event)=>console.log(event)} > 
{
    numberOfItems.map((item, i)=>{
        return <ServicePriceBoxEditor listOfProducts={listOfProducts}   key={item}  numberAssigned ={item} addObject = {handlePriceEditor}  taxationState = {taxState}  handleSingleProjectDelete ={handleSingleProjectDelete} />
    })
}
</div>
            {/* <ServicePriceBoxEditor addObject = {handlePriceEditor}  taxationState = {taxState}  /> */}
            {/* <ServicePriceBoxEditor addObject = {handlePriceEditor} taxationState = {taxState} /> */}
 
            <div className="section-total-and-add" >
                <button className='add-items-text' onClick={()=>handleNumberofItems()}> + Add Item </button>
                <div className='total-sum-section-div'>
                    <div className='total-box-li'>
                    {
                        taxState === 'No Tax' ? '' : taxState === 'Tax Excluded' ? '' : taxState === 'Tax Inlcuded' ? '' : <li>Sub Total: </li>
                    }
                    {
                         taxState === 'No Tax' ? ''  : taxState === 'Tax Exclusive (Inclusive Total)' ? <li>10% Tax</li> : taxState === 'Tax Excluded' ? '' :<li>10% Tax</li>

                    }
                    {
                      taxState === 'No Tax' ? <li>Total: </li> : taxState === 'Tax Excluded' ? <li>Total Exluding Tax</li>  : <li>Total Including Tax</li>
                    }
                    
                    </div>
                    <div className="total-sum-box">
                        <div className="vertical-blue-line"></div>
                        <div>
                            {
                                 taxState === 'No Tax' ? <p>{subTotal}</p> : taxState === 'Tax Excluded' ? <p>{subTotal}</p> : taxState === 'Tax Exclusive (Inclusive Total)' ? <p>{subTotal}</p> :''

                            }
                        {
                           taxState === 'No Tax' ? '' : taxState === 'Tax Excluded' ? '' : taxState === 'Tax Exclusive (Inclusive Total)' ? <p>{taxTotal}</p> : <p>{taxTotal}</p>

                        }
                        
                        {
                            taxState === 'Tax Inlcuded' ? <p>{subTotal}</p> : ''
                        }
                        {
                          taxState === 'No Tax' ?  '' : taxState === 'Tax Included' ?  '' : taxState === 'Tax Exclusive (Inclusive Total)' ? <p>{totalSum}</p> :  ''   
                        }
                        </div>
                        
                    </div>
                </div>
                
            </div>
            {
                numberOfInfoBox.map((number, i)=>{
                    return <QuoteInfo listOfInfoBox={listOfInfoBox} handleInfoAddition = {handleSetInfoBoxes} key={number} indexNumber = {number} handleInfoBoxDelete={handleInfoBoxDelete} />
                })
            }
         <button className='add-items-text' onClick={()=>handleNumberoFInfoBox()}> + Add Items </button>
<br/><br/><br/>
        </div>
    )
}

export default QuoteEditor
