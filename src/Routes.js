import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './Home';
import About from './About';
import Login from './components/auth/Login';
import Logout from './components/auth/Logout';
import UserRequest from './components/UserRequest';

const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<Home />} />
    <Route path="/about" element={<About />} />
    <Route path="/login" element={<Login />} />
	<Route path="/logout" element={<Logout />} />
	<Route path="/UserRequest" element={<UserRequest />} />
  </Routes>
);
export default AppRoutes;

