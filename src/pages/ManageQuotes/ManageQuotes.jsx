import React,{useState, useEffect} from 'react';
import './ManageQuotes.css';
import SearchQuotes from '../../components/SearchQuotes/SearchQuotes';
import QuoteList from '../../components/QuoteList/QuoteList';
import {storage, firestore} from '../../firebase';
import {useHistory, useLocation} from 'react-router-dom';
import SpinnerComponent from '../../components/spinnerComponent/spinnerComponent';
import AlertComponent from '../../components/AlertComponent/AlertComponent';
import DeletePopUp from '../../components/DeletePopup/deletePopup';
import Header from '../../components/Header/Header'

const  ManageQuotes = ()=> {

    const location = useLocation()

    const history = useHistory()

    const [globalKey, setGlobalKey] =  useState('')
    const [fetchedQuote, setFetchedQute] =  useState([])
    const [quotesFetched, setQuoteFetched] = useState(false)
    const [quoteSearchPrompt, setQuoteSearchPrompt] = useState(false)
    const [alertPresent, setAlertPresent] = useState(false)
    const [alertMessage, setAlertMessage] = useState('')
    const [alertType, setAlertType]  =  useState(false)
    const [tempoaryIdOfFocusQuote, setTempoaryIdOfFocusQuote] =  useState('')
    const [deleteActive, setDeleteActive] =  useState(false)

    useEffect(()=>{
        let locationPath =  location.pathname
        let splittedPath = locationPath.split('/')
        let mainId = splittedPath[1]
        setGlobalKey(mainId)
        firestore.collection("Quotes").where("globalKey", "==", mainId).get()
        .then(querySnapShot=>{
            let data = querySnapShot.docs.map(doc=>doc.data())
            if(data.length > 0){
                setFetchedQute(data)
                setQuoteFetched(true)
            } else{
                setAlertMessage("Sorry You don't have any Quotes, kindly Create one")
                setAlertPresent(true)
                setAlertType(false)
                setQuoteFetched(true)
            }
        })
    },[])

    const handleAlertChange = ()=>{
        if(alertPresent === true){
            setAlertPresent(false)
        } else{
            setAlertPresent(true)
        }
    }

    const handleQuoteSearch = (value)=>{
        let nameFiteredQuotes = fetchedQuote.filter(quote=>{
            return quote.quoteTitle.trim().toLowerCase().includes(value.trim().toLowerCase())
        })

        if(nameFiteredQuotes.length > 0){
            setFetchedQute(nameFiteredQuotes)
            setAlertMessage(`We Found ${nameFiteredQuotes.length} ${nameFiteredQuotes.length  === 1 ? "Quote" : "Quotes"} containing this : ${value} `)
            setAlertType(true)
            setAlertPresent(true)
        } else{
            setAlertMessage(`Sorry You don't have any Quotes containing this : ${value}`)
            setAlertType(false)
            setAlertPresent(true)
        }
    }

    const handleQuoteDelete = ()=>{

        firestore.collection("Quotes").doc(tempoaryIdOfFocusQuote).delete()
        .then(data=>{
            setQuoteFetched(false)
            firestore.collection("Quotes").where("globalKey", "==", globalKey).get()
            setTempoaryIdOfFocusQuote('')
        .then(querySnapShot=>{
            let data = querySnapShot.docs.map(doc=>doc.data())
            if(data.length > 0){
                setFetchedQute(data)
                setQuoteFetched(true)
            } else{
                setAlertMessage("Sorry You don't have any Quotes, kindly Create one")
                setAlertPresent(true)
                setAlertType(false)
                setQuoteFetched(true)
            }
        })
        })
    }

    const showDeletePopUp = (value)=>{
        setDeleteActive(true)
        setTempoaryIdOfFocusQuote(value)
        console.log(value)
    }

    const handlePushToCreateQuote = ()=>{
        history.push(`/${globalKey}/new-quote`)
    }

    const handleRemovePopUp = ()=>{
        setDeleteActive(false)
    }

    return (
        <div>
            <Header/>
            <h2 className='h2-ManageQuotes'>Manage Quotes</h2><br/><br/><br/>
            {
                quotesFetched ? <div>
<SearchQuotes handleQuoteSearch={(value)=>handleQuoteSearch(value)} /><br/><br/><br/>
{
    deleteActive ? <DeletePopUp handleDelete={()=>handleQuoteDelete()} handleRemovePopUp={()=>handleRemovePopUp()} /> : "" 
}
{
    alertPresent ? <AlertComponent message={alertMessage} success={alertType} handleAlertChange={()=>handleAlertChange()}  /> : ""
}


            <div className="main-quote-div-list"><br/><br/><br/>
            {
                fetchedQuote.length > 0 ?  <div>
                    {
                        fetchedQuote.map((quote, i)=>{
                            return <QuoteList key = {i} lastEdited = {quote.lastEdited} quoteId = {quote.quoteId} title= {quote.quoteTitle}  handleQuoteDelete={(value)=>showDeletePopUp(value)}  />
                        })
                    }
                </div> : <div>
                <h3 style={{textAlign:"center"}}>Seems you don't have any Quote Yet  </h3><br/>

<button  onClick={()=>handlePushToCreateQuote()} className='reset-btn'> Create a Quote </button>
                </div>
            }
            </div>
                </div>
             : <SpinnerComponent/>}
            
        </div>
    )
}

export default ManageQuotes
