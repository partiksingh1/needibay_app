import { useEffect, useCallback, useReducer } from 'react';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

// Type definition for the state hook
type UseStateHook<T> = [[boolean, T | null], (value: T | null) => void];

// Hook to manage asynchronous state
function useAsyncState<T>(
    initialValue: [boolean, T | null] = [true, null],
): UseStateHook<T> {
    return useReducer(
        (state: [boolean, T | null], action: T | null = null): [boolean, T | null] => [false, action],
        initialValue
    ) as UseStateHook<T>;
}

// Function to set storage item asynchronously
// Function to set storage item asynchronously
export async function setStorageItemAsync(key: string, value: string | null) {
    if (Platform.OS === 'web') {
        try {
            if (value === null) {
                localStorage.removeItem(key);
            } else {
                localStorage.setItem(key, value);
            }
        } catch (e) {
            console.error('Local storage is unavailable:', e);
        }
    } else {
        if (value == null) {
            await SecureStore.deleteItemAsync(key);
        } else {
            await SecureStore.setItemAsync(key, value);
        }
    }
}

// Custom hook to manage storage state
// Custom hook to manage storage state
// Custom hook to manage storage state
export function useStorageState<T>(key: string): UseStateHook<T> {
    const [state, setState] = useAsyncState<T>(); // Use the generic type T

    // Effect to retrieve value from storage
    useEffect(() => {
        const fetchStoredValue = async () => {
            try {
                let value: string | null;

                if (Platform.OS === 'web') {
                    value = localStorage.getItem(key);
                } else {
                    value = await SecureStore.getItemAsync(key);
                }

                setState(value ? (JSON.parse(value) as T) : null); // Parse the value if it's not null
            } catch (e) {
                console.error('Failed to retrieve value from storage:', e);
            }
        };

        fetchStoredValue();
    }, [key]);

    // Function to set value in state and storage
    const setValue = useCallback(
        (value: T | null) => {
            setState(value);
            setStorageItemAsync(key, value ? JSON.stringify(value) : null); // Convert to string before storing
        },
        [key]
    );

    return [state, setValue];
}

