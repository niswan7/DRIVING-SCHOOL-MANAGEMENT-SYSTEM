import HOME from './Home/home.jsx'
import Login from './Login/login.jsx'
import { Route, Routes } from 'react-router-dom'
function App() {

  return (
    <Routes> 
         <Route path='/' element={<HOME/>}/>
         <Route path='/Login' element={<Login/>}/>
    </Routes>
  );
}

export default App
