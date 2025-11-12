import HOME from './Home/home.jsx'
import Login from './Login/login.jsx'
import Register from './Register/register.jsx'
import ForgotPassword from './ForgotPassword/forgotPassword.jsx'
import InstructorDashboard from './Instructor/instructorDashboard.jsx';
import AdminDashboard from './Admin/Admindashboard.jsx';
import { Route, Routes } from 'react-router-dom'
import StudentDashboard from './Student/Dashboard.jsx'

function App() {

  return (
    <Routes> 
         <Route path='/' element={<HOME/>}/>
         <Route path='/Login' element={<Login/>}/>
         <Route path='/Register' element={<Register/>}/>
         <Route path='/ForgotPassword' element={<ForgotPassword/>}/>
         
         {/* Student Dashboard with nested routes */}
         <Route path="/Dashboard/*" element={<StudentDashboard />} />
         <Route path="/Student/*" element={<StudentDashboard />} />
         
         <Route path='/Instructor' element={<InstructorDashboard/>}/>
         <Route path='/Admin' element={<AdminDashboard/>}/>
    </Routes>
  


    
  );
}

export default App

/*
 <Routes> 
       <Route path='/' element={<HOME/>}/>
   

    </Routes>*/