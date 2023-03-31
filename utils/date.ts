// src/common/utils/date.ts
import moment from 'moment';
import config from '../config/index';

/**
 * 格式化时间
 * @param date
 * @param pattern
 * @returns
 */
export function format(date: Date, pattern = config.DEFAULT_DATE_FORMAT) {
  return moment(date).format(pattern);
}
