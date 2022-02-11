import { Buffer } from "buffer";

import { api, data } from "@serverless/cloud";

import cors from "cors";

api.use(cors());

api.get("/l/:shortUrl", async (req, res) => {
  let shortUrl = req.params.shortUrl;
  var result = await data.get(shortUrl);
  result.clicks++
  let updatedObj = await data.set(shortUrl, { clicks: result.clicks });
  let fullUrl = `https://${result.url}`;
  console.log(`Short URL: ${shortUrl}, Updated Obj: ${JSON.stringify(updatedObj)}`);
  res.redirect(fullUrl);
});

api.post("/s/:longUrl", async (req, res) => {
  let bufferObj = Buffer.from(req.params.longUrl, "utf8");
  let shortenedUrl = bufferObj.toString("base64");
  console.log(`The encoded base64 string is: ${shortenedUrl}`);
  let result = await data.set(shortenedUrl, { url: req.params.longUrl, clicks: 0 });

  res.send(`Result: ${JSON.stringify(result)}<br><br>Short URL: ${shortenedUrl}`);
});
