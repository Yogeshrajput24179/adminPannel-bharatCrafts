import React from 'react'
import Navbar from './components/Navbar/Navbar.jsx'
import Sidebar from './components/sidebar/Sidebar.jsx'
import { Route, Routes } from 'react-router-dom'
import Add from './pages/Add/Add.jsx'
import List from './pages/List/List.jsx'
import Order from './pages/Orders/Order.jsx'
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const App = () => {
  const url="http://localhost:8282"
  return (
    <div>
   <ToastContainer/>
      <Navbar/>
      <hr/>
      <div className='app-content'>
     <Sidebar/>
     <Routes>
      <Route path='/add' element={<Add url={url}></Add>}/>
      <Route path='/List' element={<List  url={url}></List>}/>
      <Route path='/Orders' element={<Order  url={url}></Order>}/>
     </Routes>
      </div>
    </div>
  )
}

export default App