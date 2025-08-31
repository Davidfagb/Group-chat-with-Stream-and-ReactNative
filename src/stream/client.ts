// src/stream/client.ts
import { StreamChat } from 'stream-chat';

let client: StreamChat | null = null;

export function getStreamClient(apiKey: string) {
  if (!client) client = StreamChat.getInstance(apiKey);
  return client;
}
