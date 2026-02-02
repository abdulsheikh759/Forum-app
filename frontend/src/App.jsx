import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Header from './Components/Header'
import Signup from './Pages/Signup'
import Login from './Pages/Login'
import Home from './Pages/Home';
import Posts from './Pages/Posts';
import { AuthProvider } from './ContextApi/AuthContext';
import ProtectedRoute from './Components/ProtectedRoute';


const App = () => {
  return (
    
    <BrowserRouter>
      <AuthProvider>

        <Header />

        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          <Route
            path="/home"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />

          <Route
            path="/group/:id"
            element={
              <ProtectedRoute>
                <Posts />
              </ProtectedRoute>
            }
          />
        </Routes>

      </AuthProvider>
    </BrowserRouter>
  )
}

export default App