import { streamText } from 'ai';
import { google } from '@ai-sdk/google';
import fs from 'fs';

const key = fs.readFileSync('.env.local', 'utf8').match(/GOOGLE_GENERATIVE_AI_API_KEY=(.*)/)[1].trim();
process.env.GOOGLE_GENERATIVE_AI_API_KEY = key;

async function run() {
  const res = streamText({
    model: google('gemini-3.5-flash'),
    messages: [{ parts: [{ type: 'text', text: 'hi' }], role: 'user' }]
  });
  try {
    const streamRes = res.toUIMessageStreamResponse();
    console.log('Got response object:', streamRes.headers.get('content-type'));
    const reader = streamRes.body.getReader();
    const decoder = new TextDecoder();
    let count = 0;
    while(true) {
       const { done, value } = await reader.read();
       if (done) break;
       console.log('CHUNK:', decoder.decode(value));
       count++;
       if (count > 2) break; // just check if it streams
    }
  } catch (e) {
    console.error('ERROR:', e);
  }
}
run();
