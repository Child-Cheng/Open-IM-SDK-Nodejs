import OpenIMSDK from '../src/im';
import { ChatGPTAPI } from 'chatgpt';
import { ChatGPTUnofficialProxyAPI } from 'chatgpt';
import fetch from 'node-fetch';
declare global {
  var openIm: OpenIMSDK;
  var chatGPTAPI: ChatGPTAPI | ChatGPTUnofficialProxyAPI;
  // function fetch(url: RequestInfo, init?: RequestInit): () => '1231312';
}
export {};
