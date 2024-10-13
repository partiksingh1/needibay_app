import axios from 'axios';

const API_URL = 'http://localhost:3000'; // Replace with your backend API URL

// Function to log in the user
export const login = async (email: string, password: string) => {
    console.log("calling this")
    const response = await axios.post(`${API_URL}/api/auth/login`, { email, password });
    return response.data; // This returns the user object and token
};
