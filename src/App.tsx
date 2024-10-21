import './App.css';
import Login from "./components/Login";
import { Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import Signup from './components/Signup';


function App() {
  return (
    <>
     <main>
     <Routes>
      <Route path="/" element={<Login />} />  
      <Route path="/home" element={<Home />} />  
      <Route path="/signup" element={<Signup />} />
    </Routes>
     </main>
    </>
  );
}

export default App;
