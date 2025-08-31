// src/screens/ChannelListScreen.tsx
import React from 'react';
import { View, Pressable, Text } from 'react-native';
import { ChannelList, useChatContext } from 'stream-chat-expo';
import type { StackScreenProps } from '@react-navigation/native-stack';

type RootStackParamList = {
  ChannelList: undefined;
  Channel: { channelId: string };
  NewGroup: undefined;
};

type Props = StackScreenProps<RootStackParamList, 'ChannelList'>;

export default function ChannelListScreen({ navigation }: Props) {
  const { client } = useChatContext();

  const filters = { type: 'messaging', members: { $in: [client.userID!] } };
  const sort = { last_message_at: -1 };
  const options = { watch: true, state: true };

  return (
    <View style={{ flex: 1 }}>
      <ChannelList
        filters={filters}
        sort={sort}
        options={options}
        onSelect={(channel) => navigation.navigate('Channel', { channelId: channel.id! })}
      />
      <Pressable
        onPress={() => navigation.navigate('NewGroup')}
        style={{
          position: 'absolute',
          right: 16,
          bottom: 32,
          backgroundColor: '#1f6feb',
          paddingHorizontal: 18,
          paddingVertical: 12,
          borderRadius: 24
        }}
      >
        <Text style={{ color: 'white', fontWeight: '600' }}>New Group</Text>
      </Pressable>
    </View>
  );
}
