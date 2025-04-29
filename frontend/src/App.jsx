import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import MainLayout from './layouts/MainLayout';
import './App.css';

function App() {
    return (
        <BrowserRouter>
            <AuthProvider>
                <MainLayout />
            </AuthProvider>
        </BrowserRouter>
    );
}

export default App;