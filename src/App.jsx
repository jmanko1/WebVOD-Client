import './App.css'

import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import NoPage from './pages/NoPage';
import Layout from './pages/Layout';
import InitiateResetPassword from './pages/InitiateResetPassword';
import LoginCode from './pages/LoginCode';
import ResetPassword from './pages/ResetPassword';
import ChangePassword from './pages/ChangePassword';
import Video from './pages/Video';
import VideoUpload from './pages/VideoUpload';
import Channel from './pages/Channel';

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
                    <Route path="/reset-password/:token" element={<ResetPassword />} />
                    <Route path="/change-password" element={<ChangePassword />} />
                    <Route path="/videos/:id" element={<Video />} />
                    <Route path="/upload" element={<VideoUpload />} />
                    <Route path="/channels/:id" element={<Channel />} />
                    <Route path="*" element={<NoPage />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}


export default App;