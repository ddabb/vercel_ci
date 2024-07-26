const express = require('express');
const bodyParser = require('body-parser');
const crypto = require('crypto');

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

function checkSignature(token, signature, timestamp, nonce) {
  const arr = [token, timestamp, nonce].sort().join('');
  const sha1 = crypto.createHash('sha1');
  sha1.update(arr);
  const result = sha1.digest('hex');
  return result === signature;
}

app.get('/', (req, res) => {
  const { signature, timestamp, nonce, echostr } = req.query;

  const token = 'testtoken'; // 请替换为您在微信公众号平台设置的 token

  if (checkSignature(token, signature, timestamp, nonce)) {
    res.send(echostr);
  } else {
    res.send('error');
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});