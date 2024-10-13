// app/(app)/_layout.tsx
import {useAuth} from "@/context/AuthContext";
import {Redirect} from "expo-router";


export default function AppLayout() {
    const { user } = useAuth();

    if (!user) {
        return <Redirect href="/login" />;
    }

    switch (user.role) {
        case 'ADMIN':
            return <Redirect href="/(admin)" />;
        case 'SALESPERSON':
            return <Redirect href="/(salesperson)" />;
        case 'DISTRIBUTOR':
            return <Redirect href="/(distributor)" />;
        default:
            return <Redirect href="/login" />;
    }
}