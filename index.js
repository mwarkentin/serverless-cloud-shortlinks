import { Buffer } from 'buffer';

import { api, data } from "@serverless/cloud";

api.get("/", async (req, res) => {
  res.send("<h1>Hello Serverless Cloud!</h1>");
});

api.get('/l/:shortUrl', async (req,res) => {
  let result = await data.get(req.params.shortUrl);
  console.log("Result", result)
  res.send("Short URL: " + req.params.shortUrl + "<br><br>Long URL: " + result)
})

// TODO: Switch to POST
api.get('/s/:longUrl', async (req,res) => {
  let bufferObj = Buffer.from(req.params.longUrl, "utf8");
  let shortenedUrl = bufferObj.toString("base64");
  console.log("The encoded base64 string is:", shortenedUrl);
  await data.set(shortenedUrl, req.params.longUrl);

  res.send("Long URL: " + req.params.longUrl + "<br><br>Short URL: " + shortenedUrl)
})