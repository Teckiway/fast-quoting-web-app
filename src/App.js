import React, { Fragment } from 'react';
import './App.css';
import QuoteEditor from './pages/QuoteEditor/QuoteEditor';
import ManageQuotes from './pages/ManageQuotes/ManageQuotes'
import ManageContacts from './pages/ManageContacts/ManageContacts'
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom'
import ManageTemplates from './pages/ManageTemplates/ManageTemplates';
import CreateContact from './pages/CreateContact/CreateContact';
import SignUp from './pages/Signup/SignUp';
import Login from './pages/Login/Login';
import EditContact from './pages/EditContact/EditContact';
import EditCompanyContact from './pages/EditCompanyContact/EditCompanyContact';
import Dashboard from './pages/Dashboard/Dashboard';
import CreateProduct from './pages/CreateProducts/CreateProducts';
import EditPriceEditor from './pages/EditProducts/EditProducts';
import CreateInfoBox from './pages/Create Info Box/CreateInfoBox';
import EditInfoBox from './pages/EdiInfo Box/EditQuoteInfo';
import EditQuotes from './pages/EditQuotes/QuoteEditor'

function App() {
  return (
    <Router>
      <Switch>
        <Fragment>
    <div className="App">
      {/* <Route path='/' exact component={}>

      </Route> */}
      <Route path='/:id/new-quote' component={QuoteEditor}/>
      <Route path='/:id/manage-quotes' component={ManageQuotes} />
      <Route path='/:id/manage-contact' component = {ManageContacts} />
      <Route path='/:id/edit-contact/:id' component = {EditContact} />
      <Route path='/:id/manage-templates' component = {ManageTemplates} />
      <Route path= '/:id/create-contact'  component = {CreateContact} />
      <Route path='/:id/edit-company-contact/:id' component = {EditCompanyContact} />
      <Route path='/sign-up' component={SignUp} />
      <Route path='/login' component={Login} />
      <Route path='/:id/dashboard' component={Dashboard}/>
      <Route path='/:id/create-product' component={CreateProduct} />
      <Route path='/:id/edit-product/:id' component ={EditPriceEditor} />
      <Route path='/:id/create-info-box' component={CreateInfoBox} />
      <Route path='/:id/edit-info-box/:id' component={EditInfoBox} />
      <Route path='/:id/edit-quote/:id' component={EditQuotes} />  
    </div>
    </Fragment>
    </Switch>
    </Router>
  );
}

export default App;
