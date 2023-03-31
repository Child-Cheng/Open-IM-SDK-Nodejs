import config from '../config/index';
import { CbEvents } from '../src/constants';
import OpenIMSDK from '../src/im';
import { v4 as uuidv4 } from 'uuid';
import {
  ImageMsgParams,
  InitConfig,
  OfflinePush,
  PicBaseInfo,
  SendMsgParams,
} from '../src/types';
import request from 'request';
import { getData, setData, selectDb, setDataExpire } from '../db/redis';
import { punctuate_text } from './utils';

export function im_init(openIM: OpenIMSDK) {
  openIM.on(CbEvents.ONCONNECTFAILED, (data: any) => {
    if (data.errCode === 702) {
      imLogin(openIM);
    }
    // 连接失败...
    console.log('connect failed...', data);
  });
  openIM.on(CbEvents.ONCONNECTSUCCESS, (data: any) => {
    // 连接成功...
    console.log('connect success...');
  });
  openIM.on(CbEvents.ONCONNECTING, (data: any) => {
    // 连接中...
    console.log('connecting...');
  });
  openIM.on(CbEvents.ONKICKEDOFFLINE, (data: any) => {
    // 被踢下线...
    imLogin(openIM);
    console.log('kicked offline...');
  });
  openIM.on(CbEvents.ONUSERTOKENEXPIRED, (data: any) => {
    // token过期...
    console.log('token expired...');
  });
  setGlobalIMlistener(openIM);
  imLogin(openIM);
  if (config.continuous_dialogue) {
    selectDb(config.REDIS.DB).then((res) => {
      console.log('res', res);
    });
  }
}

export function setGlobalIMlistener(openIM: OpenIMSDK) {
  const newMessagesHandler = (messages: any) => {
    try {
      const messageList = JSON.parse(messages.data);
      config.imagesType == 'true'
        ? ImageGenerations({
            prompt: messageList.content,
            n: 1,
            size: config.imageSize,
          })
            ?.then(async (res: any) => {
              // const img: any = await getBase64(res);
              const baseInfo: PicBaseInfo = {
                uuid: uuidv4(),
                type: 'png',
                size: 12465,
                width: 480,
                height: 480,
                url: res,
              };
              const options: ImageMsgParams = {
                sourcePicture: baseInfo,
                bigPicture: baseInfo,
                snapshotPicture: baseInfo,
              };
              openIM
                .createImageMessage(options)
                .then(({ data }) => {
                  console.log('创建图片消息成功', data);
                  const offlinePushInfo: OfflinePush = {
                    title: data.senderNickname,
                    desc: '',
                    ex: '',
                    iOSPushSound: '',
                    iOSBadgeCount: true,
                  };
                  const options: SendMsgParams = {
                    recvID: messageList.sendID,
                    groupID: '',
                    offlinePushInfo: offlinePushInfo,
                    message: data,
                  };

                  openIM
                    .sendMessageNotOss(options)
                    .then(({ data, errCode }) => {
                      console.log('发送消息成功', data);
                    })
                    .catch((err) => {
                      console.log('发送消息失败', err);
                    });
                })
                .catch((err) => {
                  console.log('创建图片消息失败', err);
                });
            })
            .catch((err) => {
              console.log('err', err);
            })
        : Completions(messageList)?.then((res: any) => {
            openIM
              .createTextMessage(res.text, config.userID)
              .then(({ data }) => {
                console.log('data', data);
                const offlinePushInfo: OfflinePush = {
                  title: data.senderNickname,
                  desc: '',
                  ex: '',
                  iOSPushSound: '',
                  iOSBadgeCount: true,
                };
                const options: SendMsgParams = {
                  recvID: messageList.sendID,
                  groupID: '',
                  offlinePushInfo: offlinePushInfo,
                  message: data,
                };
                sendMessage(openIM, options);
              })
              .catch((err) => {
                console.log('创建消息err', err);
              });
          });
    } catch (e) {
      //TODO handle the exception
      console.log('处理新的消息出错', e);
    }
  };
  openIM.on(CbEvents.ONRECVNEWMESSAGE, newMessagesHandler);
}

export function sendMessage(openIM: OpenIMSDK, options: SendMsgParams) {
  openIM
    .sendMessage(options)
    .then(({ data, errCode }) => {
      console.log('发送消息成功', data);
    })
    .catch((err) => {
      console.log('发送消息失败', err);
    });
}

export function ImageGenerations(data: any) {
  return new Promise((resolve, reject) => {
    try {
      request(
        {
          url: 'https://api.openai.com/v1/images/generations',
          method: 'POST',
          json: true,
          headers: {
            'content-type': 'application/json',
            Authorization: 'Bearer ' + config.onpen_token,
          },
          body: data,
        },
        function (error, response, body) {
          if (!error && response.statusCode == 200) {
            let res = body;
            resolve(res.data[0].url);
          } else {
            reject(error);
          }
        }
      );
    } catch (e) {
      reject(e);
    }
  });
}

export function Completions(data: any) {
  try {
    return new Promise(async (resolve, reject) => {
      try {
        const { content, sendID } = data;
        let res = null;
        console.log('进来了:::', content);
        if (config.continuous_dialogue) {
          let parentData = await getData(sendID);
          let options = {};
          options =
            parentData == null || parentData == undefined || parentData == ''
              ? {}
              : {
                  conversationId: JSON.parse(parentData).conversationId,
                  parentMessageId: JSON.parse(parentData).parentMessageId,
                };
          console.log('options', options, punctuate_text(content));
          res = await global.chatGPTAPI.sendMessage(
            punctuate_text(content),
            options
          );
          setDataExpire(
            sendID,
            JSON.stringify({
              parentMessageId: res.parentMessageId,
              conversationId: res.conversationId,
            }),
            15
          ); //保存到redis 并设置过期时间为15秒
        } else {
          res = await global.chatGPTAPI.sendMessage(punctuate_text(content));
          console.log('res', res);
        }
        resolve(res);
      } catch (e) {
        //TODO handle the exception
        reject(e);
      }
    });
  } catch (err) {
    return null;
  }
}

export function imLogin(openIM: OpenIMSDK) {
  request(
    {
      url: config.apiUrl + '/auth/user_token',
      method: 'POST',
      json: true,
      headers: {
        'content-type': 'application/json',
      },
      body: {
        operationID: config.userID,
        platform: config.platformID,
        secret: config.secret,
        userID: config.userID,
      },
    },
    function (error, response, body) {
      if (!error && response.statusCode == 200) {
        let res = body;
        if (body.errCode === 0) {
          config.userID = res.data.userID;
          config.token = res.data.token;
          login(openIM);
        }
      }
    }
  );
}

export function login(openIM: OpenIMSDK) {
  const init_config: InitConfig = {
    userID: config.userID, // 用户ID
    token: config.token, // 用户token
    url: config.wsUrl, // jssdk server ws地址
    platformID: config.platformID, // 平台号
    operationID: config.userID, // 业务号  可以使用UUID
  };
  try {
    openIM
      .login(init_config)
      .then((res) => {
        console.log('login suc...');
      })
      .catch((err) => {
        console.log('login failed...', err);
      });
  } catch (e) {
    //TODO handle the exception
    console.log('login failed...', e);
  }
}
