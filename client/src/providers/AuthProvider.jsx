import React, { useState, useEffect } from 'react';
import axios from '../api/axios';
import { AuthContext } from '../contexts/AuthContext';

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const verifyToken = async () => {
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    const res = await axios.get('/auth/me');
                    setUser(res.data.data.user);
                } catch (error) {
                    console.error("Token verification failed:", error);
                    localStorage.removeItem('token');
                }
            }
            setLoading(false);
        };
        verifyToken();
    }, []);

    const login = (userData, token) => {
        localStorage.setItem('token', token);
        setUser(userData);
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};
