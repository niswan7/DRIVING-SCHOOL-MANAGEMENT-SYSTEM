import HOME from './Home/home.jsx'

import InstructorDashboard from './Instructor/instructorDashboard.jsx';
import { Route, Routes } from 'react-router-dom'
function App() {

  return (
  <>
 <Routes> 
       <Route path='/' element={<HOME/>}/>
   

    </Routes>
  
  </>

    
  );
}

export default App

/*
 <Routes> 
       <Route path='/' element={<HOME/>}/>
   

    </Routes>*/