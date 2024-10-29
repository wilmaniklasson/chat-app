import './App.css';
import Login from "./components/Login";
import { Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import Signup from './components/Signup';
import Guest from './components/Guest';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
    return (
        <>
            <main>
                <Routes>
                    <Route path="/" element={<Login />} />  
                    <Route path="/home" element={<ProtectedRoute element={<Home />} />} />
                    <Route path="/guest" element={<Guest />} />
                    <Route path="/signup" element={<Signup />} />
                </Routes>
            </main>
        </>
    );
}

export default App;
