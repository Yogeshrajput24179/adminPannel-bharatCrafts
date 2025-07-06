import React from 'react'
import Navbar from './components/Navbar/Navbar.jsx'
import Sidebar from './components/sidebar/Sidebar.jsx'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Add from './pages/Add/Add.jsx'
import List from './pages/List/List.jsx'
import Order from './pages/Orders/Order.jsx'
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const App = () => {
  // Use live backend URL here
  const url = "https://adminpannel-bharatcrafts.onrender.com";

  return (
    <BrowserRouter basename="/adminPannel-bharatCrafts">
      <div>
        <ToastContainer />
        <Navbar />
        <hr />
        <div className='app-content'>
          <Sidebar />
          <Routes>
            <Route path='/add' element={<Add url={url} />} />
            <Route path='/List' element={<List url={url} />} />
            <Route path='/Orders' element={<Order url={url} />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  )
}

export default App;
