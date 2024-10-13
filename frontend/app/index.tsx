import { Redirect } from 'expo-router';
import { useAuth } from "@/context/AuthContext";

export default function Index() {
    const { user } = useAuth();

    if (!user) {
        return <Redirect href="/login" />;
    }

    if(user.role.toLowerCase()==="admin"){
        return <Redirect href="/(admin)" />;
    }
    if(user.role.toLowerCase()==="salesperson"){
        return <Redirect href="/(salesperson)" />;
    }
    if(user.role.toLowerCase()==="distributor"){
        return <Redirect href="/(distributor)" />;
    }
}