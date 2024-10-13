import { Text, View } from 'react-native';
import {useSession} from "@/components/AuthContext";


export default function Index() {
    const { signOut } = useSession();
    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text>
                admin
            </Text>
        </View>
    );
}
