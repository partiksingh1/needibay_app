// context/AuthContext.tsx
import { createContext, useContext, useReducer, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';
import { AuthState, AuthContextType, SignUpData } from '../types/auth';
import { api } from '../services/api';

const initialState: AuthState = {
    user: null,
    token: null,
    isLoading: true,
    error: null,
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

type AuthAction =
    | { type: 'SET_USER'; payload: { user: AuthState['user']; token: string } }
    | { type: 'SET_LOADING'; payload: boolean }
    | { type: 'SET_ERROR'; payload: string }
    | { type: 'SIGN_OUT' };

function authReducer(state: AuthState, action: AuthAction): AuthState {
    switch (action.type) {
        case 'SET_USER':
            return {
                ...state,
                user: action.payload.user,
                token: action.payload.token,
                isLoading: false,
                error: null,
            };
        case 'SET_LOADING':
            return { ...state, isLoading: action.payload };
        case 'SET_ERROR':
            return { ...state, error: action.payload, isLoading: false };
        case 'SIGN_OUT':
            return { ...initialState, isLoading: false };
        default:
            return state;
    }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [state, dispatch] = useReducer(authReducer, initialState);

    useEffect(() => {
        loadStoredAuth();
    }, []);

    async function loadStoredAuth() {
        try {
            const token = await SecureStore.getItemAsync('userToken');
            const userData = await SecureStore.getItemAsync('userData');

            if (token && userData) {
                dispatch({
                    type: 'SET_USER',
                    payload: { user: JSON.parse(userData), token },
                });
            } else {
                dispatch({ type: 'SET_LOADING', payload: false });
            }
        } catch (error) {
            dispatch({ type: 'SET_ERROR', payload: 'Failed to load stored auth' });
        }
    }

    async function signIn(email: string, password: string) {
        try {
            dispatch({ type: 'SET_LOADING', payload: true });

            const response = await api.post('/auth/signin', { email, password });
            const { user, token } = response.data;

            await SecureStore.setItemAsync('userToken', token);
            await SecureStore.setItemAsync('userData', JSON.stringify(user));

            dispatch({ type: 'SET_USER', payload: { user, token } });
        } catch (error) {
            dispatch({ type: 'SET_ERROR', payload: 'Invalid credentials' });
        }
    }

    async function signUp(userData: SignUpData) {
        try {
            dispatch({ type: 'SET_LOADING', payload: true });

            const response = await api.post('/auth/signup', userData);
            const { user, token } = response.data;

            await SecureStore.setItemAsync('userToken', token);
            await SecureStore.setItemAsync('userData', JSON.stringify(user));

            dispatch({ type: 'SET_USER', payload: { user, token } });
        } catch (error) {
            dispatch({ type: 'SET_ERROR', payload: 'Signup failed' });
        }
    }

    async function signOut() {
        try {
            await SecureStore.deleteItemAsync('userToken');
            await SecureStore.deleteItemAsync('userData');
            dispatch({ type: 'SIGN_OUT' });
        } catch (error) {
            dispatch({ type: 'SET_ERROR', payload: 'Sign out failed' });
        }
    }

    return (
        <AuthContext.Provider value={{ ...state, signIn, signUp, signOut }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}