import HOME from './Home/home.jsx'
import Login from './Login/login.jsx'
import Register from './Register/register.jsx'
import ForgotPassword from './ForgotPassword/forgotPassword.jsx'
import StudentDashboard from './Student/Student.jsx';
import StudentFeedback from './Student/studentFeedback.jsx';
import ViewInstructorFeedback from './Student/viewInstructorFeedback.jsx';
import InstructorDashboard from './Instructor/instructorDashboard.jsx';
import AdminDashboard from './Admin/Admindashboard.jsx';
import TermsOfService from './Legal/termsOfService.jsx';
import PrivacyPolicy from './Legal/privacyPolicy.jsx';
import { Route, Routes } from 'react-router-dom'
function App() {

  return (
    <Routes> 
         <Route path='/' element={<HOME/>}/>
         <Route path='/Login' element={<Login/>}/>
         <Route path='/Register' element={<Register/>}/>
         <Route path='/ForgotPassword' element={<ForgotPassword/>}/>
          <Route path='/Student' element={<StudentDashboard/>}/>
          <Route path='/student/feedback' element={<StudentFeedback/>}/>
          <Route path='/student/viewfeedback' element={<ViewInstructorFeedback/>}/>
          <Route path='/instructor' element={<InstructorDashboard/>}/>
          <Route path='/Admin' element={<AdminDashboard/>}/>
          <Route path='/terms' element={<TermsOfService/>}/>
          <Route path='/privacy' element={<PrivacyPolicy/>}/>
    </Routes>
  


    
  );
}

export default App

/*
 <Routes> 
       <Route path='/' element={<HOME/>}/>
   

    </Routes>*/