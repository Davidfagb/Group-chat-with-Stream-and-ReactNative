// src/screens/LoginScreen.tsx
import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, Platform } from 'react-native';

type Props = {
  onLoggedIn: (args: { userId: string, token: string, apiKey: string }) => void;
};

export default function LoginScreen({ onLoggedIn }: Props) {
  const [userId, setUserId] = useState('joel');
  const [serverUrl, setServerUrl] = useState(
    Platform.select({ ios: 'http://127.0.0.1:5050', default: 'http://10.0.2.2:5050' })!
  );

  const login = async () => {
    try {
      const res = await fetch(`${serverUrl}/token`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: userId })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || 'Failed');
      onLoggedIn({ userId, token: data.token, apiKey: data.api_key });
    } catch (e:any) {
      Alert.alert('Login failed', e.message);
    }
  };

  return (
    <View style={{ flex: 1, padding: 20, gap: 12, justifyContent: 'center' }}>
      <Text style={{ fontSize: 22, fontWeight: '600' }}>Sign in</Text>
      <Text>Pick a username (must match a seeded user or any string):</Text>
      <TextInput
        value={userId}
        onChangeText={setUserId}
        placeholder="e.g. joel"
        style={{ borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 12 }}
        autoCapitalize="none"
      />
      <Text>Token server URL</Text>
      <TextInput
        value={serverUrl}
        onChangeText={setServerUrl}
        placeholder="http://10.0.2.2:5050 (Android Emulator)"
        style={{ borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 12 }}
        autoCapitalize="none"
      />
      <Button title="Continue" onPress={login} />
    </View>
  );
}
