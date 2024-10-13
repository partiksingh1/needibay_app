import { useState } from 'react';
import { Text, View, TextInput, Button, ActivityIndicator, Alert } from 'react-native';
import { router } from 'expo-router';
import { useSession } from "@/components/AuthContext";

export default function SignIn() {
    const { signIn, isLoading } = useSession(); // Get signIn and loading state
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSignIn = async () => {
        try {
            // Ensure this returns an object containing user and token
            const { user } = await signIn(email, password); // Call the signIn method from context and get user data

            // Redirect based on user role
            switch (user.role) {
                case 'SALESPERSON':
                    router.replace('/(salesperson)'); // Redirect to Salesperson route
                    break;
                case 'DISTRIBUTOR':
                    router.replace('/(distributor)'); // Redirect to Distributor route
                    break;
                case 'ADMIN':
                    router.replace('/(admin)'); // Redirect to Admin route
                    break;
                default:
                    Alert.alert('Error', 'Unknown role.'); // Handle unexpected roles
            }
        } catch (error) {
            Alert.alert('Error', 'Failed to sign in. Please check your credentials.'); // Show error message
        }
    };

    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 16 }}>
            <TextInput
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                style={{ width: '100%', padding: 10, borderColor: '#ccc', borderWidth: 1, marginBottom: 12 }}
            />
            <TextInput
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                style={{ width: '100%', padding: 10, borderColor: '#ccc', borderWidth: 1, marginBottom: 12 }}
            />
            <Button title="Sign In" onPress={handleSignIn} disabled={isLoading} />
            {isLoading && <ActivityIndicator size="large" color="#0000ff" style={{ marginTop: 20 }} />}
        </View>
    );
}
