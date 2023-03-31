// require('dotenv').config();
import config from './config/index';
import Express from 'express';
import bodyParser from 'body-parser';
import { OpenIMSDK, CbEvents } from './src';
import { im_init, ImageGenerations, Completions } from './utils/im';
import { debug } from 'console';
require('isomorphic-fetch');
let app = Express();
let PORT = config.HTTP_PORT || 3000;
console.log(process.env.IMAGES_TYPE);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.all('*', function (req, res, next) {
  //设置跨域访问
  //设置允许跨域的域名，*代表允许任意域名跨域
  res.header('Access-Control-Allow-Origin', 'http://localhost:8000');
  //允许的header类型
  // res.header("Content-Type", "application/x-www-form-urlencoded");
  // 设置请求头中允许携带的参数
  res.header('Access-Control-Allow-Headers', 'Content-Type,request-origin');
  // 允许客户端携带证书式访问。保持跨域请求中的Cookie。注意：此处设true时，Access-Control-Allow-Origin的值不能为 '*'
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-control-max-age', '3600');
  //跨域允许的请求方式
  res.header('Access-Control-Allow-Methods', 'DELETE,PUT,POST,GET,OPTIONS');
  next();
});

app.get('/', (req, res) => {
  res.send('hello world!');
});
app.get('/ChatGPTAPI', (req, res) => {
  let text = req.query.text;
  let wx_id = req.query.wxid || '';
  if (String(text).match(/(\u753b|\u6765)(\u5f20|\u4e2a)?\S+\u56fe?/)) {
    ImageGenerations({
      prompt: text,
      n: 1,
      size: '512x512',
    })
      ?.then((data: any) => {
        res.send(data);
      })
      .catch((error) => {
        res.send(error);
      });
  } else {
    Completions({ content: text, sendID: wx_id })
      ?.then((data: any) => {
        res.send(data.text);
      })
      .catch((error) => {
        res.send(error);
      });
  }
});
app.set('port', config.HTTP_PORT || 3000);

try {
  const openIM = new OpenIMSDK();
  im_init(openIM);
  global.openIm = openIM;

  initChatGPT();
} catch (e) {
  console.log('init failed...', e);
  //TODO handle the exception
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error: any) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  var bind = typeof PORT === 'string' ? 'Pipe ' + PORT : 'Port ' + PORT;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
  var addr = server.address();
  var bind =
    typeof addr === 'string' ? 'pipe ' + addr : 'port ' + app.get('port');
  debug('Listening on ' + bind);
}

async function initChatGPT() {
  // To use ESM in CommonJS, you can use a dynamic import
  // const { ChatGPTAPI } = await import('chatgpt');
  // const api = new ChatGPTAPI({ apiKey: config.onpen_token, debug: false });
  const { ChatGPTAPI, ChatGPTUnofficialProxyAPI } = await import('chatgpt');
  const api = config.open_ai_type
    ? config.proxyUrl == ''
      ? new ChatGPTUnofficialProxyAPI({
          accessToken: config.session_token,
          debug: false,
        })
      : new ChatGPTUnofficialProxyAPI({
          accessToken: config.session_token,
          apiReverseProxyUrl: config.proxyUrl,
          debug: false,
        })
    : new ChatGPTAPI({
        apiKey: config.onpen_token,
        debug: false,
        // apiBaseUrl: 'https://openai.ceapnews.com',
        completionParams: {
          model: config.model,
        },
      });
  global.chatGPTAPI = api;
}

let server = app.listen(app.get('port'));
server.on('error', onError);
server.on('listening', onListening);
