// src/common/utils/utils.ts
import { format } from './date';
export function isValidKey(
  key: string | number | symbol,
  object: object
): key is keyof typeof object {
  return key in object;
}

/**
 * 下划线转驼峰
 * @param str
 * @returns
 */
export function lineToHump(str: string): string {
  if (str.startsWith('_')) {
    return str;
  }
  return str.replace(/\_(\w)/g, (all, letter: string) => letter.toUpperCase());
}

/**
 * 驼峰转下划线
 * @param str
 * @returns
 */
export function humpToLine(str = ''): string {
  if (typeof str !== 'string') {
    return str;
  }
  return str.replace(/([A-Z])/g, '_$1').toLowerCase();
}

/**
 * 将对象的所有属性由下划线转换成驼峰
 * @param obj
 * @returns
 */
export function lineToHumpObject(obj: Object) {
  let key: string;
  const element: {
    [key: string]: any;
  } = {};
  for (key in obj) {
    if (obj.hasOwnProperty(key)) {
      if (isValidKey(key, obj)) {
        const value = obj[key];
        if (typeof key === 'string' && (key as string).indexOf('_at') > -1) {
          element[lineToHump(key)] = format(value);
        } else {
          element[lineToHump(key)] = value;
        }
      }
    }
  }
  return {
    ...element,
  };
}

/**
 * 将对象的所有属性由驼峰转换为下划线
 * @param obj
 * @returns
 */
export function humpToLineObject(obj: Object) {
  let key: string;
  const element: {
    [key: string]: any;
  } = {};
  for (key in obj) {
    if (obj.hasOwnProperty(key)) {
      if (isValidKey(key, obj)) {
        const value = obj[key];
        element[humpToLine(key)] = value || null;
      }
    }
  }
  return {
    ...element,
  };
}

//判断字符是否是 汉字
export function isChinese(temp: string) {
  //	var re = /\p{Unified_Ideograph}/u ;
  var regex =
    /(?:[\u3400-\u4DB5\u4E00-\u9FEF\uFA0E\uFA0F\uFA11\uFA13\uFA14\uFA1F\uFA21\uFA23\uFA24\uFA27-\uFA29]|[\uD840-\uD868\uD86A-\uD86C\uD86F-\uD872\uD874-\uD879][\uDC00-\uDFFF]|\uD869[\uDC00-\uDED6\uDF00-\uDFFF]|\uD86D[\uDC00-\uDF34\uDF40-\uDFFF]|\uD86E[\uDC00-\uDC1D\uDC20-\uDFFF]|\uD873[\uDC00-\uDEA1\uDEB0-\uDFFF]|\uD87A[\uDC00-\uDFE0])/;
  if (regex.test(temp)) {
    return true;
  } else {
    return false;
  }
}

//判断字符是否是 中文符号
export function patchEn(temp: string) {
  var reg =
    /[\u3002|\uff1f|\uff01|\uff0c|\u3001|\uff1b|\uff1a|\u201c|\u201d|\u2018|\u2019|\uff08|\uff09|\u300a|\u300b|\u3008|\u3009|\u3010|\u3011|\u300e|\u300f|\u300c|\u300d|\ufe43|\ufe44|\u3014|\u3015|\u2026|\u2014|\uff5e|\ufe4f|\uffe5]/;
  if (reg.test(temp)) {
    return true;
  } else {
    return false;
  }
}

//判断字符是否是 英文半角符号
export function patchABCbiaodian(temp: string) {
  var reg = /[\x21-\x2f\x3a-\x40\x5b-\x60\x7B-\x7F]/;
  if (reg.test(temp)) {
    return true;
  } else {
    return false;
  }
}

/**
 * 获取最后一位字符
 */
export function last_character(str: string) {
  return str.trimEnd().charAt(str.trimEnd().length - 1);
}

/**
 *
 * 给文本加标点符号
 */
export function punctuate_text(text: string) {
  let last_text = last_character(text);
  text = isChinese(last_text) /**判断是不是汉字 */
    ? text + '。'
    : patchEn(last_text) /**判断是不是标点符号 */
    ? text
    : patchABCbiaodian(last_text) /**判断英文标点符号 */
    ? text
    : text + '.'; //获取最后一位字符判断是不是中文,是中文就拼接上一个句号
  return text;
}
