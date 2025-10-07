import HOME from './Home/home.jsx'
import Login from './Login/login.jsx'
import StudentDashboard from './Student/Student.jsx';
import InstructorDashboard from './Instructor/instructorDashboard.jsx';
import { Route, Routes } from 'react-router-dom'
function App() {

  return (
    <Routes> 
         <Route path='/' element={<HOME/>}/>
         <Route path='/Login' element={<Login/>}/>
          <Route path='/Student' element={<StudentDashboard/>}/>
          <Route path='/Instructor' element={<InstructorDashboard/>}/>
    </Routes>
  


    
  );
}

export default App

/*
 <Routes> 
       <Route path='/' element={<HOME/>}/>
   

    </Routes>*/