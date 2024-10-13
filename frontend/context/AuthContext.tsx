import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {jwtDecode} from 'jwt-decode';  // Ensure jwtDecode is imported correctly
import axios from 'axios';
import { useRouter, useSegments } from 'expo-router';

// Define the shape of the user object
interface User {
    id: string;
    role: 'ADMIN' | 'SALESPERSON' | 'DISTRIBUTOR';
}

// Define the shape of the auth context
interface AuthContextType {
    user: User | null;
    login: (email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
}

// Create the auth context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Custom hook to use the auth context
export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}

// Auth provider component
export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const router = useRouter();
    const segments = useSegments();

    // Effect for handling auth state changes
    useEffect(() => {
        const inAuthGroup = segments[0] === '(auth)';

        if (!user && !inAuthGroup) {
            // Redirect to the sign-in page if user isn't signed in
            router.replace('/login');
        } else if (user && inAuthGroup) {
            // Redirect away from the sign-in page if user is signed in
            router.replace('/');
        }
    }, [user, segments, router]);

    // Check for stored token on app start
    useEffect(() => {
        const checkToken = async () => {
            const token = await AsyncStorage.getItem('userToken');
            if (token) {
                const decoded: any = jwtDecode(token);
                setUser({
                    id: decoded.id,
                    role: decoded.role,
                });
            }
        };
        checkToken();
    }, []);  // Empty dependency array ensures this runs only once, on mount

    // Login function
    const login = async (email: string, password: string) => {
        try {
            const response = await axios.post('http://10.0.2.2:3000/api/auth/login', {
                email,
                password,
            });

            const { token } = response.data;
            await AsyncStorage.setItem('userToken', token);

            const decoded: any = jwtDecode(token);
            setUser({
                id: decoded.id,
                role: decoded.role,
            });

            router.replace('/');
        } catch (error) {
            console.error('Login error:', error);
            throw error;
        }
    };

    // Logout function
    const logout = async () => {
        await AsyncStorage.removeItem('userToken');
        setUser(null);
        router.replace('/login');
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}
