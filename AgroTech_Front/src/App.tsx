
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import IndexScreen from './views/IndexSreen'
import Marketplace from './views/MarketplaceScren'
import Login from './views/LoginScreen'
import TrazabilidadScreen from './views/TrazabilidadScreeen'
import AdminDashboard from './views/AdminScreen'
import ClientDashboard from './views/ClientDashboard'
import ClientProfile from './views/ClientProfile'

function App() {
  return(
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<IndexScreen />} />  
          <Route path='/indexscreen' element={<IndexScreen />} />  
          <Route path='/marketplace' element={<Marketplace />} />
          <Route path='/login' element={<Login />} />
          <Route path='/trazabilidad' element={<TrazabilidadScreen />} />
          <Route path='/dashboard' element={<AdminDashboard />} />
          <Route path='/areacliente' element={<ClientDashboard />} />
          <Route path='/perfil' element={<ClientProfile />} />
           
          
  
        </Routes>
      </BrowserRouter>
    )
}

export default App
