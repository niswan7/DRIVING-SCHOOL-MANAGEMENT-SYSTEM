import HOME from './Home/home.jsx'
import Login from './Login/login.jsx'
import Register from './Register/register.jsx'
import ForgotPassword from './ForgotPassword/forgotPassword.jsx'
import StudentDashboard from './Student/Student.jsx';
import InstructorDashboard from './Instructor/instructorDashboard.jsx';
import AdminDashboard from './Admin/Admindashboard.jsx';
import Courses from './Courses/Courses.jsx';
import PrivacyPolicy from './Legal/PrivacyPolicy.jsx';
import TermsOfService from './Legal/TermsOfService.jsx';
import { Route, Routes } from 'react-router-dom'
function App() {

  return (
    <Routes> 
         <Route path='/' element={<HOME/>}/>
         <Route path='/Login' element={<Login/>}/>
         <Route path='/Register' element={<Register/>}/>
         <Route path='/ForgotPassword' element={<ForgotPassword/>}/>
         <Route path='/Courses' element={<Courses/>}/>
         <Route path='/Privacy' element={<PrivacyPolicy/>}/>
         <Route path='/Terms' element={<TermsOfService/>}/>
          <Route path='/Student' element={<StudentDashboard/>}/>
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