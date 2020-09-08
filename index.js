const express = require('express')
const middleware = require('@line/bot-sdk').middleware
const JSONParseError = require('@line/bot-sdk').JSONParseError
const SignatureValidationFailed = require('@line/bot-sdk').SignatureValidationFailed
const Client = require('@line/bot-sdk').Client;
const app = express()

const config = {
  channelAccessToken: 'YOUR_CHANNEL_ACCESS_TOKEN',
  channelSecret: 'YOUR_CHANNEL_SECRET'
}

const client = new Client(config);

app.use(middleware(config))

app.get('/webhook', (req, res) => {
  res.json({});
})

app.post('/webhook', (req, res) => {
  const event = req.body.events[0];
  console.log(req.body.events);
  return client.replyMessage(event.replyToken, {
    type: 'text',
    text: JSON.stringify(event)
  });   
})

app.use((err, req, res, next) => {
  if (err instanceof SignatureValidationFailed) {
    res.status(401).send(err.signature)
    return
  } else if (err instanceof JSONParseError) {
    res.status(400).send(err.raw)
    return
  }
  next(err) // will throw default 500
})

app.listen(3000)