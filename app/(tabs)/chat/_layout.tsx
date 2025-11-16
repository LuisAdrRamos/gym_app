import { Stack } from 'expo-router';
import React from 'react';

export default function ChatStackLayout() {
    return (
        <Stack>
            {/* index.tsx será la lista de contactos, con header mostrado por (tabs)/_layout */}
            <Stack.Screen name="index" options={{ title: 'Contactos', headerShown: true }} />

            {/* [receiverId].tsx será la conversación, el título se establece dinámicamente */}
            <Stack.Screen
                name="[receiverId]"
                options={{ title: 'Conversación', headerShown: true }}
            />
        </Stack>
    );
}