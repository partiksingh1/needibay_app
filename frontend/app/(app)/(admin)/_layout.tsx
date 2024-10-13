import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function AdminLayout() {
    return (
        <Tabs>
            <Tabs.Screen
                name="index"
                options={{
                    title: 'Dashboard',
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="home-outline" size={size} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="manage-users"
                options={{
                    title: 'Manage Users',
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="people-outline" size={size} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="view-orders"
                options={{
                    title: 'View Orders',
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="list-outline" size={size} color={color} />
                    ),
                }}
            />
        </Tabs>
    );
}