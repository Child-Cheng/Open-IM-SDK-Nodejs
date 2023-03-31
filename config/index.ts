import config_prod from './config.prod';
import config_dev from './config.dev';
export default process.env.NODE_ENV === 'prod' ? config_prod : config_dev;
