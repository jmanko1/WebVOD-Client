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
import VideosManager from './pages/VideosManager';
import VideoEdit from './pages/VideoEdit';
import TFASettings from './pages/TFASettings';
import ChannelInfo from './pages/ChannelSettings/ChannelInfo';
import Security from './pages/ChannelSettings/Security';
import Logout from './pages/Logout';
import History from './pages/History';
import WatchTogether from './pages/WatchTogether';
import { UserProvider } from './contexts/UserContext';
import LikedVideos from './pages/LikedVideos';

const App = () => {
    return (
        <UserProvider>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Layout />}>
                        <Route index element={<Home />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/login/code" element={<LoginCode />} />
                        <Route path="/logout" element={<Logout />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/reset-password" element={<InitiateResetPassword />} />
                        <Route path="/reset-password/:token" element={<ResetPassword />} />
                        <Route path="/channel-settings/password-security/change-password" element={<ChangePassword />} />
                        <Route path="/videos/:id" element={<Video />} />
                        <Route path="/upload" element={<VideoUpload />} />
                        <Route path="/channels/:id" element={<Channel />} />
                        <Route path="/videos-manager" element={<VideosManager />} />
                        <Route path="/videos-manager/:id" element={<VideoEdit />} />
                        <Route path="/channel-settings" element={<ChannelInfo />} />
                        <Route path="/channel-settings/channel-info" element={<ChannelInfo />} />
                        <Route path="/channel-settings/password-security" element={<Security />} />
                        <Route path="/channel-settings/password-security/tfa" element={<TFASettings />} />
                        <Route path="/watch-together" element={<WatchTogether />} />
                        <Route path="/liked-videos" element={<LikedVideos />} />
                        <Route path="/history" element={<History />} />
                        <Route path="*" element={<NoPage />} />
                    </Route>
                </Routes>
            </BrowserRouter>
        </UserProvider>
    );
}


export default App;