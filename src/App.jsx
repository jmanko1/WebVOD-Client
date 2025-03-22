import './App.css'

import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import NoPage from './pages/NoPage';
import Layout from './pages/Layout';
import InitiateResetPassword from './pages/InitiateReseTPassword';
import LoginCode from './pages/LoginCode';

const App = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Layout />}>
                  <Route index element={<Home />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/login/code" element={<LoginCode />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/reset-password" element={<InitiateResetPassword />} />
                  <Route path="*" element={<NoPage />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}


export default App;