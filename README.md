# 基本于 Open-IM 官方的 Open-IM-SDK-Web 改造支持 nodejs

```bash
npm install
```

```bash
npm run start
```

- 需要配置的 config/config.ts

  ```bash

      export default class Config {
          // 服务器端口
          public static readonly HTTP_PORT = 9000;
          // 接口前缀
          public static readonly API_PREFIX = '/api/';

          public static readonly apiUrl = 'http://ip:10002'; //api 域名地址

          public static readonly wsUrl = 'ws://ip:10003'; //jssdk server ws 地址

          public static readonly platformID = 5; // 平台号

          public static userID = ''; // 用户 ID  (要作为机器人的用户 ID)

          public static token = ''; // 用户 token 登录成功后返回自动写入

          public static readonly secret = ''; // //后台验证的 key  usualConfig.yaml文件中查找  secret

          public static readonly onpen_token ='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'; // openai token 目前该key来源https://api.aa1.cn/special/chatgpt 公益key

          public static readonly open_ai_type = false; //是否启用模拟请求 chatgpt 官方接口 false:使用 api 接口 true:使用模拟官方请求

          public static readonly continuous_dialogue = false; //是否启用连续对话  为true时,必须配置redis 不然报 redis 未配置错误

          // 默认时间格式
          public static readonly DEFAULT_DATE_FORMAT = 'YYYY-MM-DD HH:mm:ss';
          // 根目录
          // public static readonly BASE = isDev ? 'src' : 'dist/src'

          // mysql 配置
          public static readonly MYSQL = {
            DB_NAME: 'ts',
            HOST: '127.0.0.1',
            PORT: 3306,
            USER_NAME: 'admin',
            PASSWORD: 'admin',
            CONNECTION_LIMIT: 60 * 60 * 1000,
            CONNECT_TIMEOUT: 1000 * 60 * 60 * 1000,
            ACQUIRE_TIMEOUT: 60 * 60 * 1000,
            TIMEOUT: 1000 * 60 * 60 * 1000,
          };

          public static readonly REDIS = {
            PORT: 6379,
            HOST: '127.0.0.1',
            PASSWORD: 'admin',
            DB: 0,
          };
      }
  ```

- Get more API list and demo you can visit [官方地址](https://doc.rentsoft.cn/)

```

```
