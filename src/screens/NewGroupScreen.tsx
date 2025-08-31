// src/screens/NewGroupScreen.tsx
import React, { useEffect, useState } from 'react';
import { View, FlatList, Text, Pressable, ActivityIndicator, Alert } from 'react-native';
import { useChatContext } from 'stream-chat-expo';
import type { StackScreenProps } from '@react-navigation/native-stack';

type RootStackParamList = {
  ChannelList: undefined;
  Channel: { channelId: string };
  NewGroup: undefined;
};

type Props = StackScreenProps<RootStackParamList, 'NewGroup'>;

export default function NewGroupScreen({ navigation }: Props) {
  const { client } = useChatContext();
  const [users, setUsers] = useState<any[]>([]);
  const [selected, setSelected] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await client.queryUsers({ id: { $ne: client.userID } }, { created_at: -1 }, { limit: 30 });
        if (mounted) setUsers(res.users);
      } catch (e) {
        Alert.alert('Failed to load users', String(e));
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, [client]);

  const toggle = (id: string) => setSelected(s => ({ ...s, [id]: !s[id] }));

  const createGroup = async () => {
    const members = Object.keys(selected).filter(id => selected[id]);
    if (members.length < 2) {
      Alert.alert('Pick at least 2 people for a group');
      return;
    }
    // include me
    if (client.userID && !members.includes(client.userID)) members.push(client.userID);

    try {
      const channel = client.channel('messaging', { members });
      await channel.create();
      navigation.replace('Channel', { channelId: channel.id! });
    } catch (e) {
      Alert.alert('Create failed', String(e));
    }
  };

  if (loading) return <View style={{ flex:1, justifyContent:'center', alignItems:'center' }}><ActivityIndicator /></View>;

  return (
    <View style={{ flex: 1, padding: 12 }}>
      <FlatList
        data={users}
        keyExtractor={(u) => u.id}
        renderItem={({ item }) => (
          <Pressable
            onPress={() => toggle(item.id)}
            style={{
              padding: 14,
              borderRadius: 10,
              marginVertical: 6,
              backgroundColor: selected[item.id] ? '#dbeafe' : '#f3f4f6'
            }}
          >
            <Text style={{ fontSize: 16, fontWeight: '600' }}>{item.name || item.id}</Text>
            <Text style={{ color: '#555' }}>{item.id}</Text>
          </Pressable>
        )}
      />
      <Pressable
        onPress={createGroup}
        style={{ backgroundColor: '#1f6feb', padding: 14, borderRadius: 10, alignItems: 'center', marginTop: 8 }}
      >
        <Text style={{ color: 'white', fontWeight: '700' }}>Create Group</Text>
      </Pressable>
    </View>
  );
}
