// src/screens/ChannelScreen.tsx
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { Channel, MessageList, MessageInput, useChatContext } from 'stream-chat-expo';
import type { StackScreenProps } from '@react-navigation/native-stack';

type RootStackParamList = {
  ChannelList: undefined;
  Channel: { channelId: string };
  NewGroup: undefined;
};

type Props = StackScreenProps<RootStackParamList, 'Channel'>;

export default function ChannelScreen({ route }: Props) {
  const { client } = useChatContext();
  const [chan, setChan] = useState<any>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      const c = client.channel('messaging', route.params.channelId);
      await c.watch();
      if (mounted) setChan(c);
    })();
    return () => { mounted = false; };
  }, [client, route.params.channelId]);

  if (!chan) return <View style={{ flex:1, justifyContent:'center', alignItems:'center' }}><ActivityIndicator /></View>;

  return (
    <Channel channel={chan}>
      <MessageList />
      <MessageInput />
    </Channel>
  );
}
