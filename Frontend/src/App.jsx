import HOME from './Home/home.jsx'
import Login from './Login/login.jsx'
import Studentdashboard from './Student/Student.jsx'
import { Route, Routes } from 'react-router-dom'
function App() {

  return (
    <Routes> 
         <Route path='/' element={<HOME/>}/>
         <Route path='/Login' element={<Login/>}/>
         <Route path='/Student' element={<Studentdashboard/>}/>
         {/* <Route path='/Login/Instructor' element={<Instructor/>}/>
         <Route path='/Login/Admin' element={<Admin/>}/> */}
    </Routes>
  );
}

export default App
