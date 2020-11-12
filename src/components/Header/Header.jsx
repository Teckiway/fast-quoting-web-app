import React from 'react';
import './Header.css';
import {useLocation, Link}from 'react-router-dom'
import { useState, useEffect  } from 'react';

const Header = ()=> {

    const [userId, setUserId] = useState('')

    const location  = useLocation()

    useEffect(()=>{
        let locationPath =  location.pathname
        let splittedPath = locationPath.split('/')
        let mainId = splittedPath[1]
        setUserId(mainId)
    },[])

    const contactPage = `/${userId}/manage-contact`
    const dashboard = `/${userId}/dashboard`
    const templates = `/${userId}/manage-templates`

    return (
        <div className='header-div'>
          <div className='header-menu-list'>
              <ul className='links'>
                  <Link style={{textDecoration:'none'}} to={dashboard} >
                  <li className='linka'>Dashboard</li>
                  </Link>
                  <Link style={{textDecoration:'none'}} to={contactPage} >
                  <li className='linka'>Contact</li>
                  </Link>
                  <Link style={{textDecoration:'none'}} to={contactPage} >
                  <li className='linka'>Quotes</li>
                  </Link>
                  <Link style={{textDecoration:'none'}} to={templates} >
                  <li className='linka'>Templates</li>
                  </Link>
                  
              </ul>
          </div>  
        </div>
    )
}

export default Header
