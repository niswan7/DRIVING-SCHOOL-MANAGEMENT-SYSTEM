import HOME from './Home/home.jsx'
import { Route, Routes } from 'react-router-dom'
function App() {

  return (
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