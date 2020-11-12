import React,{useState,useEffect} from 'react';
import './ManageTemplates.css';
import SearchTemplates from '../../components/SearchTemplates/SearchTeamplates';
import TemplateList from '../../components/TemplateList/TemplateList';
import Header from '../../components/Header/Header';
import {firestore, storage} from '../../firebase';
import {useHistory, useLocation} from 'react-router-dom';
import AlertComponent from '../../components/AlertComponent/AlertComponent';
import SpinnerComponent from '../../components/spinnerComponent/spinnerComponent'
import DeletePopUp from '../../components/DeletePopup/deletePopup'



const  ManageTemplates = ()=> {

    const location  =  useLocation()

    const history = useHistory()

    const [quoteTemplates, setQuoteTemplates]  = useState([])
    const [productTemplates, setProdutTemplates] = useState([])
    const [infoBoxTemplates, setInfoBoxTemplates] = useState([])
    const [viewController, setViewController] = useState('products')
    const [globalKey, setGlobalKey] =  useState('')
    const [alertPresent, setAlertPresent] =  useState(false)
    const [alertMessage, setAlertMessage] =  useState('')
    const [alertType, setAlertType] =  useState(false)
    const [onSearch, setOnSearch] =  useState(false)
    const [fetchedData, setFetchedData] =  useState(false)
    const [tempoaryStateOfId, setTempoaryStateOfId] =  useState('')
    const [deletePrompted, setDeletePrompted] =  useState(false)





    useEffect(()=>{
        let locationPath =  location.pathname
        let splittedPath = locationPath.split('/')
        let mainId = splittedPath[1]
        setGlobalKey(mainId)

        firestore.collection("ProductTemplates").where("globalKey", "==", mainId).get()
        .then(querySnapshot=>{
            let data =  querySnapshot.docs.map(doc=>doc.data())
            setProdutTemplates(data)
            setFetchedData(true)
        })
        .catch(()=>{
            setAlertPresent(true)
            setAlertMessage(`Sorry an Error occured, try again later`)
            setAlertType(false)
        })
    },[])


    const handleSearchTemplates = (value)=>{
        console.log(value)
        if(viewController === 'products'){
            let filteredResult = productTemplates.filter(product=>{
                return product.productName.trim().toLowerCase() === value.toLowerCase().trim()
            })
            if(filteredResult.length !== 0){
                setProdutTemplates(filteredResult)
                setOnSearch(true)
            } else{
                setAlertPresent(true)
                setAlertMessage(`Sorry an Error occured, try again later:  "${value}"`)
                setAlertType(false)
            }
        }
    }


    const handleAlertPresence = ()=>{
        setAlertPresent(false)
        setAlertMessage('')
        setAlertType(false)
    }

    const handleViewController = (value)=>{
        setViewController(value)
        if(value === 'products' && onSearch === true){
            setFetchedData(false)
            firestore.collection("ProductTemplates").where("globalKey", "==", globalKey).get()
        .then(querySnapshot=>{
            let data =  querySnapshot.docs.map(doc=>doc.data())
            setProdutTemplates(data)
            setFetchedData(true)
        })
        .catch(()=>{
            setAlertPresent(true)
            setAlertMessage(`Sorry an Error occured, try again later`)
            setAlertType(false)
            setFetchedData(true)
        })
        } else if (value === 'products'){
            setFetchedData(false)
            firestore.collection("ProductTemplates").where("globalKey", "==", globalKey).get()
        .then(querySnapshot=>{
            let data =  querySnapshot.docs.map(doc=>doc.data())
            setProdutTemplates(data)
            setFetchedData(true)
        })
        .catch(()=>{
            setAlertPresent(true)
            setAlertMessage(`Sorry an Error occured, try again later`)
            setAlertType(false)
            setFetchedData(false)
        })

        }

        else if( value === 'infoBoxTemplates'){
            setFetchedData(false)
            firestore.collection("InfoBoxTemplates").where("globalKey", "==", globalKey).get()
            .then(querySnapshot=>{
                let data =  querySnapshot.docs.map(doc=>doc.data())
                setInfoBoxTemplates(data)
                setFetchedData(true)
                console.log(data)
            })
            .catch(()=>{
                setAlertPresent(true)
            setAlertMessage(`Sorry an Error occured, try again later`)
            setAlertType(false)
            setFetchedData(false)
            })
        }
    }

    const handleResetButton = ()=>{
        if(viewController === 'products'){
            setFetchedData(false)
            firestore.collection("ProductTemplates").where("globalKey", "==", globalKey).get()
        .then(querySnapshot=>{
            let data =  querySnapshot.docs.map(doc=>doc.data())
            console.log(data)
            setProdutTemplates(data)
        })
        }
    }

    const handleCreateProductTemplate = ()=>{
        if(viewController === 'products'){
            history.push(`/${globalKey}/create-product`)

        } else{
            history.push(`/${globalKey}/create-info-box`)
        }
    }

    const handleMainDelete = ()=>{
        if(viewController === 'products'){
            firestore.collection("ProductTemplates").doc(tempoaryStateOfId).get()
            .then(data=>{
                let resultingData =  data.data()
                
                const {images} = resultingData

                if(images.length !== 0){
                    images.map(image=>{
                        storage.ref(image.fullPath).delete()
                        .then(data=>{
                            console.log('done')
                        })
                    })
                }
                    firestore.collection("ProductTemplates").doc(tempoaryStateOfId).delete()
                    .then(data=>{
                        setFetchedData(false)

        firestore.collection("ProductTemplates").where("globalKey", "==", globalKey).get()
        .then(querySnapshot=>{
            let data =  querySnapshot.docs.map(doc=>doc.data())
            setProdutTemplates(data)
            setFetchedData(true)
            setDeletePrompted(false)
        })
        .catch(()=>{
            setAlertPresent(true)
            setAlertMessage(`Sorry an Error occured, try again later`)
            setAlertType(false)
            setDeletePrompted(false)
        })
                    })
                }
            )
        } else if(viewController === 'infoBoxTemplates'){
            firestore.collection("InfoBoxTemplates").doc(tempoaryStateOfId).get()
            .then(data=>{
                let resultingData =  data.data()
                
                const {images} = resultingData

                if(images.length !== 0){
                    images.map(image=>{
                        storage.ref(image.fullPath).delete()
                        .then(data=>{
                            console.log('done')
                        })
                    })
                }

                    firestore.collection("InfoBoxTemplates").doc(tempoaryStateOfId).delete()
                    .then(data=>{
                        setFetchedData(false)

        firestore.collection("InfoBoxTemplates").where("globalKey", "==", globalKey).get()
        .then(querySnapshot=>{
            let data =  querySnapshot.docs.map(doc=>doc.data())
            setInfoBoxTemplates(data)
            setFetchedData(true)
            setDeletePrompted(false)
        })
        .catch(()=>{
            setAlertPresent(true)
            setAlertMessage(`Sorry an Error occured, try again later`)
            setAlertType(false)
            setDeletePrompted(false)
        })
                    })
                }
            )
        }
    }

    const handleDeleteButton = (id)=>{
       setTempoaryStateOfId(id)
       setDeletePrompted(true)
    }


    const handleRemovePopUp = ()=>{
        setDeletePrompted(false)
        setTempoaryStateOfId('')
    }

    return (
        <div>
            <Header/>
            <h2 className='h2-ManageQuotes'>Manage Templates , Products & Info Boxes</h2><br/>
            <div className='change-pages-div'>
            <button className='button-change-page' onClick={()=>handleViewController('products')} >Products</button>
                <button className='button-change-page'>Template</button>
                <button className='button-change-page' onClick={()=>handleViewController('infoBoxTemplates')}>Info Boxes </button>
                </div><br/><br/>
            <br/>
            {
                alertPresent ? <AlertComponent handleAlertChange = {()=>handleAlertPresence()} success = {alertType} message={alertMessage} /> : ''
            }

            {
               fetchedData === false ? <SpinnerComponent/> :  
            <div>

{
    deletePrompted ? <DeletePopUp handleDelete = {()=>handleMainDelete()} handleRemovePopUp = {()=>handleRemovePopUp()}  /> : ""
}

            <SearchTemplates stateView = {viewController} handleQueryTemplates = {(value)=>handleSearchTemplates(value)} /><br/><br/><br/>

            {
                onSearch ?  <div>
                    <button className='reset-btn' onClick={()=>handleResetButton()} >Reset</button><br/><br/>

                    </div> : ""

            }

            {
                viewController === 'products' ?  <div className="main-quote-div-list"><br/><br/><br/>
               {
                 productTemplates.length !== 0 ?  productTemplates.map((product, i)=>{
                       let name = product.productName
                       let productId = product.id;
                       let lastEdited = product.lastEdited
                       return <TemplateList  handleDelete  = {(value)=>handleDeleteButton(value)} key={i} name={name} productId = {productId} stateView = {viewController} lastEdited={lastEdited} /> 

                   }) : <div>
                       <h3 style={{textAlign:"center"}}>Seems you don't have any product templates, </h3><br/>

                       <button  onClick={()=>handleCreateProductTemplate()} className='reset-btn'>Create Product Template</button>

                   </div> 
               }
            </div> : viewController === 'infoBoxTemplates' ?  <div className="main-quote-div-list"><br/><br/><br/>
               {
                 infoBoxTemplates.length !== 0 ?  infoBoxTemplates.map((infoBox, i)=>{
                       let name = infoBox.title
                       let infoBoxId = infoBox.id
                       let lastEdited = infoBox.lastEdited
                       return <TemplateList handleDelete  = {(value)=>handleDeleteButton(value)} key={i} name={name} productId = {infoBoxId} stateView = {viewController} lastEdited={lastEdited} /> 

                   }) : <div>
                       <h3 style={{textAlign:"center"}}>Seems you don't have any InfoBox templates, </h3><br/>

                       <button  onClick={()=>handleCreateProductTemplate()} className='reset-btn'>Create InfoBox Templates</button>

                   </div> 
               }
            </div>   : ""
            }  <br/> <br/><br/>
           
            </div>
            }
        </div>
    )
}

export default ManageTemplates
