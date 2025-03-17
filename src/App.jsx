import './App.css'

import { BrowserRouter, Routes, Route } from "react-router-dom";

import Menu from './pages/Menu';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import NoPage from './pages/NoPage';

const App = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Menu />}>
                  <Route index element={<Home />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="*" element={<NoPage />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}


export default App;