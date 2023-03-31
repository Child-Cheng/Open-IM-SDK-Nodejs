// const isDev = process.env.NODE_ENV === 'development'

export default class Config {
  // 服务器端口
  public static readonly HTTP_PORT = process.env.PORT || 9100;
  // 接口前缀
  public static readonly API_PREFIX = '/api/';

  public static readonly apiUrl = ''; //api域名地址

  public static readonly wsUrl = ''; //jssdk server ws地址

  public static readonly platformID = 5; // 平台号

  public static userID = process.env.IM_USERID || ''; // 用户ID   (要作为机器人的用户ID)

  public static token = ''; // 用户token 登录成功后返回自动写入

  public static readonly secret = process.env.SECRET || ''; //

  public static readonly proxyUrl = ''; // 代理地址 http://

  // 会话token
  public static readonly session_token = ''; //

  //api 接口 token
  public static readonly onpen_token = 'sk-';

  public static readonly open_ai_type = false; //是否启用模拟请求chatgpt官方接口 false:使用api接口  true:使用模拟官方请求

  public static readonly continuous_dialogue = true; //是否启用连续对话

  // 默认时间格式
  public static readonly DEFAULT_DATE_FORMAT = 'YYYY-MM-DD HH:mm:ss';

  public static readonly model = process.env.GPT_MODEL || 'gpt-3.5-turbo'; //模型 gpt-4、gpt-3.5-turbo、davinci-003

  public static readonly imagesType = process.env.IMAGES_TYPE || 'false';

  public static readonly imageSize = process.env.IMAGES_SIZE || '1024x1024'; //'256x256', '512x512', '1024x1024', '2048x2048', '4096x4096', '512x512', '1024x768', '1920x1080', '2048x1080', '2560x1440', '3840x2160'
  // 根目录
  //  public static readonly BASE = isDev ? 'src' : 'dist/src'

  // mysql配置
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
    PORT: 6375,
    HOST: '',
    PASSWORD: '',
    DB: 0,
  };
}
