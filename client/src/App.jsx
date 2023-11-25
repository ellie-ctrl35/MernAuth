import { useState } from 'react'
import {BrowserRouter,Routes,Route} from 'react-router-dom'
import './App.css'
import Signup from './SignUp'
import Login from './Login'
import Dashboard from './Dashboard'
import HomePage from './assets/HomePage'

function App() {

  return (
    <BrowserRouter>
     <Routes>
       <Route path='/' element={<Signup/>}></Route>
       <Route path='/login' element={<Login/>}></Route>
       <Route path='/dashboard' element={<Dashboard/>}></Route>
       <Route path='/homepage' element={<HomePage/>}></Route>
     </Routes>
    </BrowserRouter>
  )
}

export default App
