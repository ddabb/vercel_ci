const http = require('http');
const crypto = require('crypto');
const url = require('url');
const querystring = require('querystring');
const xml2js = require('xml2js');

// 你的微信公众号 Token
const token = 'testtoken';

const parser = new xml2js.Parser();

async function parseXML(xmlString) {
  return new Promise((resolve, reject) => {
    parser.parseString(xmlString, (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });
  });
}

// 导出一个异步处理函数
export default async function handler(request, response) {
  try {
    if (request.method === 'GET') {
      // 验证签名
      const { signature, timestamp, nonce, echostr } = querystring.parse(url.parse(request.url).query);

      const arr = [token, timestamp, nonce].sort().join('');
      const sha1 = crypto.createHash('sha1').update(arr).digest('hex');

      if (sha1 === signature) {
        // 签名验证成功，返回 echostr
        response.writeHead(200, { 'Content-Type': 'text/plain' });
        response.end(echostr);
      } else {
        // 签名验证失败
        response.writeHead(403, { 'Content-Type': 'text/plain' });
        response.end('Forbidden');
      }
    } else if (request.method === 'POST') {
      let body = '';
      request.on('data', chunk => {
        body += chunk.toString();
      });

      request.on('end', async () => {
        try {
          const data = await parseXML(body);

          // 打印解析后的数据以检查
          console.log('Parsed data:', data);

          if (data.xml && data.xml.MsgType && data.xml.MsgType[0] === 'text') {
            await handleTextMessage(data.xml, response);
          } else {
            response.writeHead(200, { 'Content-Type': 'application/xml' });
            response.end(`<?xml version="1.0" encoding="UTF-8"?><xml><ToUserName><![CDATA[no_response]]></ToUserName><FromUserName><![CDATA[no_response]]></FromUserName><CreateTime>123456789</CreateTime><MsgType><![CDATA[text]]></MsgType><Content><![CDATA[Unknown message type]]></Content><FuncFlag>0</FuncFlag></xml>`);
          }
        } catch (error) {
          console.error('Error parsing XML:', error);
          response.writeHead(500, { 'Content-Type': 'text/plain' });
          response.end('Internal Server Error');
        }
      });
    } else {
      response.writeHead(405, { 'Content-Type': 'text/plain' });
      response.end('Method Not Allowed');
    }
  } catch (error) {
    console.error(error);
    response.writeHead(500, { 'Content-Type': 'text/plain' });
    response.end(`Internal Server Error: ${error.message}`);
  }
}

async function handleTextMessage(message, response) {
  const toUserName = message.ToUserName[0];
  const fromUserName = message.FromUserName[0];
  const content = message.Content[0];

  console.log(`Received text message from ${fromUserName}: ${content}`);
  const reply = `
    <xml>
    <ToUserName><![CDATA[${toUserName}]]></ToUserName>
    <FromUserName><![CDATA[${fromUserName}]]></FromUserName>
    <CreateTime>${Date.now()}</CreateTime>
    <MsgType><![CDATA[text]]></MsgType>
    <Content><![CDATA[已收到您的消息：${content}]]></Content>
  </xml>`;


  response.writeHead(200, { 'Content-Type': 'application/xml' });
  response.end(reply);
}