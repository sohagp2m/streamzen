import { useEffect, useState } from "react";

import { LiveKitRoom } from "@livekit/components-react";
import { jwtDecode } from "jwt-decode";

import { useParams } from "react-router-dom";
import HostControls from "./HostControls";
import Actions from "../utils/actions";
import ChatBox from "./ChatBox";

export default function Host() {
  const { createStreamerToken } = Actions();
  const [streamerToken, setStreamerToken] = useState("");
  const { slug, room } = useParams();
  useEffect(() => {
    const getOrCreateStreamerToken = async () => {
      const SESSION_STREAMER_TOKEN_KEY = `${slug}-streamer-token`;
      const sessionToken = sessionStorage.getItem(SESSION_STREAMER_TOKEN_KEY);

      if (sessionToken) {
        const payload = jwtDecode(sessionToken);

        if (payload.exp) {
          console.log(payload);
          const expiry = new Date(payload.exp * 1000);
          if (expiry < new Date()) {
            sessionStorage.removeItem(SESSION_STREAMER_TOKEN_KEY);
            const token = await createStreamerToken(slug, room);

            setStreamerToken(token);
            sessionStorage.setItem(SESSION_STREAMER_TOKEN_KEY, token);
            return;
          }
        }

        setStreamerToken(sessionToken);
      } else {
        const token = await createStreamerToken(slug);
        console.log(token);
        setStreamerToken(token);
        sessionStorage.setItem(SESSION_STREAMER_TOKEN_KEY, token);
      }
    };
    void getOrCreateStreamerToken();
  }, [slug]);

  console.log(streamerToken);

  return (
    <LiveKitRoom
      token={streamerToken}
      serverUrl={import.meta.env.VITE_NEXT_PUBLIC_LIVEKIT_WS_URL}
      className="flex flex-1 flex-col">
      <div className="flex h-full flex-1">
        <div className="flex-1 flex-col px-8 py-2">
          <HostControls slug={slug} />
        </div>
        <div className="sticky hidden top-0 w-80 h-[100vh] border-l md:block">
          <div className=" right-0 flex h-full w-full flex-col gap-2 p-2">
            {/* chat */}
            <ChatBox participantName={slug} />
          </div>
        </div>
      </div>
    </LiveKitRoom>
  );
}
