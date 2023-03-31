import { Redis } from 'ioredis';
import redis from './redis';
/**
 * redis报错回调
 * @param err
 */
export function redisCatch(err: Error) {
  console.log(err);
}

/**
 * 选择数据库
 * @param DbName
 * @returns
 */
export async function selectDb(DbName: number) {
  return new Promise((resolve) => {
    (redis as Redis)
      .select(DbName)
      .then(() => {
        resolve(true);
      })
      .catch(redisCatch);
  });
}

/**
 * 设置数据
 * @param key 键
 * @param value 值
 * @returns
 */
export async function setData(key: string, value: any) {
  return new Promise((resolve) => {
    (redis as Redis).set(key, value);
  });
}

/**
 * 设置数据
 * @param key 键
 * @param value 值
 * @returns
 */
export async function setDataExpire(
  key: string,
  value: any,
  expire: number = 60
) {
  return new Promise((resolve) => {
    (redis as Redis).set(key, value);
    (redis as Redis).expire(key, expire); //60秒自动过期
  });
}

/**
 * 获取数据
 * @param key
 * @returns
 */
export async function getData(key: string): Promise<string | null | undefined> {
  return new Promise((resolve, reject) => {
    (redis as Redis).get(key, (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result); // Prints "value"
      }
    });
  });
}
