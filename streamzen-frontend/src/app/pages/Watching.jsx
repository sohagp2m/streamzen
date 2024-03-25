import { useEffect, useMemo, useState } from "react";
import { LiveKitRoom } from "@livekit/components-react";

import { faker } from "@faker-js/faker";
import { jwtDecode } from "jwt-decode";
import Actions from "../../utils/actions";
import StreamPlayerWrapper, { StreamPlayer } from "../../components/SteramPlayer";
import ChatBox from "../../components/ChatBox";
import StreamInfo from "../../components/StreamInfo";
import { useParams } from "react-router-dom";

export default function Watching() {
  const { slug, room } = useParams();
  const [viewerToken, setViewerToken] = useState("");
  const [viewerName, setViewerName] = useState("");
  const { createViewerToken } = Actions();
  const fakeName = useMemo(() => faker.person.fullName(), []);

  useEffect(() => {
    const getOrCreateViewerToken = async () => {
      const SESSION_VIEWER_TOKEN_KEY = `${slug}-viewer-token`;
      const sessionToken = sessionStorage.getItem(SESSION_VIEWER_TOKEN_KEY);

      if (sessionToken) {
        const payload = jwtDecode(sessionToken);
        console.log(payload);
        if (payload.exp) {
          const expiry = new Date(payload.exp * 1000);
          console.log("Token expiry:", expiry);
          console.log("Current time:", new Date());

          const hasExpired = payload.exp * 1000 < new Date().getTime();
          console.log("Has token expired?", hasExpired);
          if (expiry < new Date()) {
            sessionStorage.removeItem(SESSION_VIEWER_TOKEN_KEY);
            const token = await createViewerToken(room, fakeName);
            setViewerToken(token);
            const jti = jwtDecode(token);
            console.log(jti);
            jti && setViewerName(jti);
            sessionStorage.setItem(SESSION_VIEWER_TOKEN_KEY, token);
            return;
          }
        }

        if (payload.sub) {
          console.log(payload);
          setViewerName(payload.sub);
        }

        setViewerToken(sessionToken);
      } else {
        const token = await createViewerToken(slug, fakeName);
        setViewerToken(token);
        const jti = jwtDecode(token)?.sub;
        console.log(jti);
        jti && setViewerName(jti);
        sessionStorage.setItem(SESSION_VIEWER_TOKEN_KEY, token);
      }
    };
    getOrCreateViewerToken();
  }, []);

  console.log(viewerToken, viewerName);
  if (viewerToken === "" || viewerName === "") {
    return null;
  }

  return (
    <LiveKitRoom
      token={viewerToken}
      serverUrl={import.meta.env.VITE_PUBLIC_LIVEKIT_WS_URL}
      className="flex flex-1 flex-col">
      {/* <WatchingAsBar viewerName={viewerName} /> */}
      <div className="flex h-full flex-1">
        <div className="flex-1 flex-col container">
          <StreamPlayer
            participant={viewerName}
            streamerIdentity={slug}
          />
          <StreamInfo
            streamerIdentity={slug}
            viewerIdentity={slug}
          />
        </div>
        <div className="sticky hidden w-80 border-l md:block">
          <div className="absolute top-0 bottom-0 right-0 flex h-full w-full flex-col gap-2 p-2">
            <ChatBox participantName={viewerName} />
          </div>
        </div>
      </div>
    </LiveKitRoom>
  );
}
