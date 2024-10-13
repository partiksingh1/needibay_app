import { useEffect, useCallback, useReducer } from 'react';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

type UseStateHook<T> = [[boolean, T | null], (value: T | null) => void];

// Reducer function for updating the state
function useAsyncState<T>(
    initialValue: [boolean, T | null] = [true, null],
): UseStateHook<T> {
    return useReducer(
        (state: [boolean, T | null], action: T | null = null): [boolean, T | null] => [false, action],
        initialValue
    ) as UseStateHook<T>;
}

// Function to set the storage item
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
        if (value === null) {
            await SecureStore.deleteItemAsync(key);
        } else {
            await SecureStore.setItemAsync(key, value);
        }
    }
}

// Hook to manage state using secure or local storage
export function useStorageState(key: string): UseStateHook<string> {
    const [state, setState] = useAsyncState<string>();

    // Get the value from storage on mount
    useEffect(() => {
        if (Platform.OS === 'web') {
            try {
                if (typeof localStorage !== 'undefined') {
                    const storedValue = localStorage.getItem(key);
                    setState(storedValue);
                }
            } catch (e) {
                console.error('Local storage is unavailable:', e);
            }
        } else {
            SecureStore.getItemAsync(key).then(value => {
                setState(value);
            });
        }
    }, [key]);

    // Set the value in state and storage
    const setValue = useCallback(
        (value: string | null) => {
            console.log(`Setting value: ${value} for key: ${key}`); // Log the value and key
            setState(value);
            setStorageItemAsync(key, value).then(() => {
                console.log(`Value successfully stored for key: ${key}`); // Log after async storage is done
            }).catch((error) => {
                console.error(`Error setting storage item for key: ${key}`, error); // Log error if any
            });
        },
        [key]
    );



    return [state, setValue];
}
