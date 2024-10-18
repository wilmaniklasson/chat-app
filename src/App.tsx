import './App.css';
import Login from "./components/Login";
import { Routes, Route } from 'react-router-dom';
import Home from './components/Home';


function App() {
  return (
    <>
     <main>
     <Routes>
      <Route path="/" element={<Login />} />  
      <Route path="/home" element={<Home />} />  
    </Routes>
     </main>
    </>
  );
}

export default App;
