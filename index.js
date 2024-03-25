import express from "express";
import { AccessToken } from "livekit-server-sdk";
const app = express();
const port = process.env.PORT || 3100; // Choose your port
import cors from "cors";
const apiKey = "APIGsgjgy3uBfYe";
const apiSecret = "1ubeXhmB5G1KksCIceUJ4BewSf000UjyDRMot62fi7aG";

console.log(apiKey, apiSecret);
const createToken = (userInfo, grant) => {
  console.log(apiKey, apiSecret);
  const at = new AccessToken(apiKey, apiSecret, userInfo);
  at.ttl = "5m";
  at.addGrant(grant);
  return at.toJwt();
};
app.use(cors());
// const roomPattern = /\w{4}\-\w{4}/;

// get video conference token
app.get("/get-token", async (req, res) => {
  try {
    const { roomName, identity, name, metadata } = req.query;

    console.log(metadata);

    if (typeof identity !== "string" || typeof roomName !== "string") {
      return res.status(403).end();
    }

    if (Array.isArray(name)) {
      throw new Error("provide max one name");
    }
    if (Array.isArray(metadata)) {
      throw new Error("provide max one metadata string");
    }

    // // enforce room name to be xxxx-xxxx
    // if (!roomName.match(roomPattern)) {
    //   return res.status(400).end();
    // }

    const grant = {
      room: roomName,
      roomJoin: true,
      canPublish: true,
      canPublishData: true,
      canSubscribe: true,
    };

    console.log(grant);
    const token = await createToken({ identity, name, metadata }, grant);
    console.log(token);
    const result = {
      identity,
      accessToken: token,
    };

    return res.status(200).json(result);
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
