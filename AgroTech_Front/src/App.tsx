
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import IndexScreen from './views/IndexSreen'
import Marketplace from './views/MarketplaceScren'

function App() {
  return(
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<h1>Hola</h1>} />  
          <Route path='/indexscreen' element={<IndexScreen />} />  
          <Route path='/marketplace' element={<Marketplace />} />  
  
  
        </Routes>
      </BrowserRouter>
    )
}

export default App
