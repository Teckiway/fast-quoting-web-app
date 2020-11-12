import React,{useEffect, useState} from 'react';
import './ManageContacts.css';
import SearchContact from '../../components/SearchContact/SearchContact';
import ContactList from '../../components/ContactList/ContactList';
import SpinnerComponent from '../../components/spinnerComponent/spinnerComponent'
import {firebase, firestore} from '../../firebase';
import {useLocation} from 'react-router-dom';
import DeletePopup from '../../components/DeletePopup/deletePopup'
import AlertComponent from '../../components/AlertComponent/AlertComponent';
import ContactListCompany from '../../components/ContactListCompany/ContactList';
import Header from '../../components/Header/Header'

const  ManageContacts = ()=> {

    const location  = useLocation()

    const [personContacts, setpersonContacts] = useState([])
    const [companyContacts, setCompanyContacts] =  useState([])
    const [dataLoaded, setDataLoaded] = useState(false)
    const [globalKey, setGlobalKey] = useState('')
    const [deleteTriggered, setDeleteTriggered] =  useState(false)
    const [tempoaryStateOfContactId, setTempoaryStateOfContactId] =  useState('')
    const [searchButtonClicked, setSearchButtonClicked] =  useState(false)
    const [alertPresent, setAlertPresent] =  useState(false)
    const [alertMessage, setAlertMessage] = useState('')
    const [alertCondiction, setAlertCondiction] =  useState(false)
    const [focusCompanyContacts, setFocusCompanyContacts] = useState(false)



    useEffect(()=>{
        let locationPath =  location.pathname
        let splittedPath = locationPath.split('/')
        let mainId = splittedPath[1]
        console.log(mainId)
        firestore.collection("Contacts").where("globalKey","==", mainId).get()
        .then(querySnapshot=>{
            console.log(querySnapshot)
            const data = querySnapshot.docs.map(doc=>doc.data())
            if(data.length === 0){
                setAlertMessage("Sorry, You don't have any Contacts")
                setAlertCondiction(false)
                setAlertPresent(true)
                setDataLoaded(true)
            } 
            else{
                setpersonContacts(data)
                setDataLoaded(true)
                console.log(data)
                setGlobalKey(mainId)
            }
        })
        .catch(()=>{
            setAlertMessage("Sorry, an error occured.. , try again or contact support")
            setAlertCondiction(false)
            setAlertPresent(true)
            setDataLoaded(true)
        })
            firestore.collection("companyContacts").where("globalKey","==", mainId).get()
            .then(querySnapshot=>{
                const data = querySnapshot.docs.map(doc=>doc.data())
                if(data.length === 0){
                    setAlertMessage("Sorry, You don't have any Contacts")
                    setAlertCondiction(false)
                    setAlertPresent(true)
                    setDataLoaded(true)
                } 
                else{
                    setCompanyContacts(data)
                    console.log(data)
                    setDataLoaded(true)
                    setSearchButtonClicked(false)
                }
            })
            .catch(()=>{
                setAlertMessage("Sorry, an error occured.. , try again or contact support")
                setAlertCondiction(false)
                setAlertPresent(true)
                setDataLoaded(true)
            })
    },[])

    const handleDataLoading = ()=>{
        setDataLoaded(false)
        firestore.collection("Contacts").where("globalKey","==", globalKey).get()
        .then(querySnapshot=>{
            const data = querySnapshot.docs.map(doc=>doc.data())
            if(data.length === 0){
                setAlertMessage("Sorry, You don't have any Contacts")
                setAlertCondiction(false)
                setAlertPresent(true)
                setDataLoaded(true)
            } 
            else{
                setpersonContacts(data)
                setDataLoaded(true)
                console.log(data)
            }
         })
         .catch(()=>{
            setAlertMessage("Sorry, an error occured, try again or contact support")
            setAlertCondiction(false)
            setAlertPresent(true)
            setDataLoaded(true)
         })
    }

    const handleDeletePopUpFalse = ()=>{
        setDeleteTriggered(false)
    }

    const handleDeletePopUpTrue = (contactId)=>{
        setDeleteTriggered(true)
        setTempoaryStateOfContactId(contactId)
        console.log(contactId)
    }

    const handleDeleteContact = ()=>{
        firestore.collection("Contacts").doc(tempoaryStateOfContactId).delete()
        .then(data=>{
            setDeleteTriggered(false)
            handleDataLoading()
        })
        .catch(()=>{
            setDeleteTriggered(false)
            setAlertMessage("Sorry, an error occured.. , try again or contact support")
            setAlertCondiction(false)
            setAlertPresent(true)
            setDataLoaded(true)
        })
    }

    const handleRemovePopUp = ()=>{
        setDeleteTriggered(false)
    }

    const handleCompanyContactSearch = (name)=>{
        let result = companyContacts.filter(company=>{
            let companyNameMatched = company.companyName.trim().toLowerCase() === name.trim().toLowerCase() 
            return companyNameMatched
        })

        if(result.length !== 0){
            setCompanyContacts(result)
            console.log('done')
            setSearchButtonClicked(true)
        } else{
            setAlertMessage(`Sorry None of Your Contact has name  "${name}"`)
            setAlertCondiction(false)
            setAlertPresent(true)
            setDataLoaded(true)
        }
    }

    const handleUniversalSearch = (name)=>{
        if(focusCompanyContacts){
            return handleCompanyContactSearch(name)
        } else{
            return handleSearchContactName(name)
        }
    }

    const handleSearchContactName = (name)=>{
        console.log(name)
        let filteredNames = personContacts.filter(personContact =>{
           let nameMatched = personContact.firstName.toLowerCase().trim() === name.toLowerCase().trim()
           if(nameMatched){
               return nameMatched
           } else{
               let nameMatched =  personContact.lastName.toLowerCase().trim() === name.toLowerCase().trim()
               if(nameMatched){
                   return nameMatched
               }
               else{
                   let fullName = `${personContact.firstName} ${personContact.lastName}`

                   let nameMatched = fullName.trim().toLowerCase() === name.trim().toLowerCase()
                   console.log(nameMatched)
                   return nameMatched
               }
           } 
        })
        console.log(filteredNames)

        if(filteredNames.length !== 0){
            setpersonContacts(filteredNames)
            console.log('done')
            setSearchButtonClicked(true)
        } else{
            setAlertMessage(`Sorry None of Your Contact has name  "${name}"`)
                setAlertCondiction(false)
                setAlertPresent(true)
                setDataLoaded(true)
        }

        }

        const handleResetButton = ()=>{
             if(focusCompanyContacts === true){
                setDataLoaded(false)
                firestore.collection("companyContacts").where("globalKey","==", globalKey).get()
                .then(querySnapshot=>{
                    const data = querySnapshot.docs.map(doc=>doc.data())
                    if(data.length === 0){
                        setAlertMessage("Sorry, You don't have any Contacts")
                        setAlertCondiction(false)
                        setAlertPresent(true)
                        setDataLoaded(true)
                    } 
                    else{
                        setCompanyContacts(data)
                        console.log(data)
                        setDataLoaded(true)
                        setSearchButtonClicked(false)
                    }
                })
                .catch(()=>{
                    setAlertMessage("Sorry, an error occured.. , try again or contact support")
                    setAlertCondiction(false)
                    setAlertPresent(true)
                    setDataLoaded(true)
                })
             } else{
                setDataLoaded(false)
                firestore.collection("Contacts").where("globalKey","==", globalKey).get()
                .then(querySnapshot=>{
                    const data = querySnapshot.docs.map(doc=>doc.data())
                    if(data.length === 0){
                        setAlertMessage("Sorry, You don't have any Contacts")
                        setAlertCondiction(false)
                        setAlertPresent(true)
                        setDataLoaded(true)
                    } 
                    else{
                        setpersonContacts(data)
                        console.log(data)
                        setDataLoaded(true)
                        setSearchButtonClicked(false)
                    }
                })
                .catch(()=>{
                    setAlertMessage("Sorry, an error occured.. , try again or contact support")
                    setAlertCondiction(false)
                    setAlertPresent(true)
                    setDataLoaded(true)
                })
             }
           
        }
        

        const handleAlertChange = ()=>{
            setAlertPresent(false)
            setAlertCondiction(false)
            setAlertMessage('')
        }

        const handleViewPersonData = ()=>{
            if(personContacts.length !== 0){
                setFocusCompanyContacts(false)
            } else{
                setDataLoaded(false)
                firestore.collection("Contacts").where("globalKey","==", globalKey).get()
                .then(querySnapshot=>{
                    const data = querySnapshot.docs.map(doc=>doc.data())
                    if(data.length === 0){
                        setAlertMessage("Sorry, You don't have any Contacts")
                        setAlertCondiction(false)
                        setAlertPresent(true)
                        setDataLoaded(true)
                    } 
                    else{
                        setpersonContacts(data)
                        console.log(data)
                        setDataLoaded(true)
                        setSearchButtonClicked(false)
                    }
                })
                .catch(()=>{
                    setAlertMessage("Sorry, an error occured.. , try again or contact support")
                    setAlertCondiction(false)
                    setAlertPresent(true)
                    setDataLoaded(true)
                })
            }
            
        }

        const handleViewCompanyContacts = ()=>{
            if(companyContacts.length !== 0){
                setFocusCompanyContacts(true)
            }
             else{
                setDataLoaded(false)
                firestore.collection("companyContacts").where("globalKey","==", globalKey).get()
                .then(querySnapshot=>{
                    const data = querySnapshot.docs.map(doc=>doc.data())
                    if(data.length === 0){
                        setAlertMessage("Sorry, You don't have any Contacts")
                        setAlertCondiction(false)
                        setAlertPresent(true)
                        setDataLoaded(true)
                    } 
                    else{
                        setCompanyContacts(data)
                        console.log(data)
                        setDataLoaded(true)
                        setSearchButtonClicked(false)
                    }
                })
                .catch(()=>{
                    setAlertMessage("Sorry, an error occured.. , try again or contact support")
                    setAlertCondiction(false)
                    setAlertPresent(true)
                    setDataLoaded(true)
                })
             }
        }

    return (
        <div>
            <Header/>
            <h2 className='h2-ManageQuotes'>Manage Contacts</h2><br/>
            {
                deleteTriggered ? <DeletePopup handleDelete = {()=>handleDeleteContact()} handleRemovePopUp = {()=>handleRemovePopUp()}  /> : ""
            }
            {
                alertPresent ?  <AlertComponent handleAlertChange={()=>handleAlertChange()} message={alertMessage} success = {alertCondiction} /> : ''

            }
            {
                dataLoaded ? <div>
                    <div className = 'change-pages-div' >
                   <button className='reset-button-manage-contacts' onClick={()=>handleViewPersonData()} >View Person Contacts</button>
                   <button className='reset-button-manage-contacts' onClick={()=>handleViewCompanyContacts()}>View Company Contacts</button>
               </div> <br/><br/>

               <SearchContact handleSearchContact  = {(value)=>handleUniversalSearch(value)} /><br/>
               {
                   searchButtonClicked ? <div>
<button className='reset-button-manage-contacts' onClick={()=>handleResetButton()}>Reset</button><br/><br/><br/>
                   </div>  : ''

               }

               
               <br/><br/>

               {
                   focusCompanyContacts ? <div className='main-quote-div-list'><br/><br/><br/>

                       {
                            companyContacts.length !==0 ? companyContacts.map((company,i)=>{
                                let fullName = company.companyName
                                let contactId =  company.companyId
                                let lastEdited = company.lastEdited
                                return <ContactListCompany key={i} name={fullName} contactId = {contactId} globalKey = {globalKey} lastEdited={lastEdited} changeDataLoadingState  ={()=>handleDataLoading()} changePopUpTrue = {(contactId)=>handleDeletePopUpTrue(contactId)} changePopUpFalse = {()=>handleDeletePopUpFalse()} />
                            }) : ''
                       }

                   </div> : <div className="main-quote-div-list"><br/><br/><br/>
            
            {
               personContacts.length !==0 ? personContacts.map((person,i)=>{
                    let fullName = `${person.firstName} ${person.lastName}`
                    let contactId =  person.id
                    let lastEdited = person.lastEdited
                    return <ContactList key={i} name={fullName} contactId = {contactId} globalKey = {globalKey} lastEdited={lastEdited} cchangeDataLoadingState  ={()=>handleDataLoading()} changePopUpTrue = {(contactId)=>handleDeletePopUpTrue(contactId)} changePopUpFalse = {()=>handleDeletePopUpFalse()} />
                })
            : ''}
          </div>
               }
                </div> : <SpinnerComponent/>
            }
            
        </div>
    )
}

export default ManageContacts
