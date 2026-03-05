
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import IndexScreen from './views/IndexSreen'
import Marketplace from './views/MarketplaceScren'
import Login from './views/LoginScreen'

function App() {
  return(
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<IndexScreen />} />  
          <Route path='/indexscreen' element={<IndexScreen />} />  
          <Route path='/marketplace' element={<Marketplace />} />
          <Route path='/login' element={<Login />} />  
          
  
        </Routes>
      </BrowserRouter>
    )
}

export default App
