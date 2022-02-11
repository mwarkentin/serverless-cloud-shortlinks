import { Buffer } from "buffer";

import { api, data } from "@serverless/cloud";

import cors from "cors";

api.use(cors());

api.get("/l/:shortUrl", async (req, res) => {
  let result = await data.get(req.params.shortUrl);
  let fullUrl = `https://${result}`;
  console.log(`Short URL: ${req.params.shortUrl}, Long URL: ${fullUrl}`);
  res.redirect(fullUrl);
});

api.post("/s/:longUrl", async (req, res) => {
  let bufferObj = Buffer.from(req.params.longUrl, "utf8");
  let shortenedUrl = bufferObj.toString("base64");
  console.log(`The encoded base64 string is: ${shortenedUrl}`);
  await data.set(shortenedUrl, req.params.longUrl);

  res.send(`Long URL: ${req.params.longUrl}<br><br>Short URL: ${shortenedUrl}`);
});
