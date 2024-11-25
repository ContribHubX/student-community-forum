import ngrok, { type Listener } from "@ngrok/ngrok";
import dotenv from "dotenv";
dotenv.config();

export const ngrokListener = async (): Promise<Listener> => {
  // create session
  const session = await new ngrok.SessionBuilder()
    .authtoken(process.env.NGROK_AUTHTOKEN!)
    .metadata("Online test")
    .connect();

  // create listener
  const listener = await session
    .httpEndpoint()
    .requestHeader("X-Req-Yup", "true")
    .listen();

  return listener;
};