import dotenv from 'dotenv'
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const loadPath = path.join(__dirname, '../.env');

dotenv.config({ silent: false, path: loadPath });

const jwtKey = process.env.JWT_KEY;
const mongoSecret = process.env.MONGO_SECRET;
const mongoUrlTest = process.env.MONGO_URL_TEST;
const nodeEnv = process.env.NODE_ENV;
const port = process.env.PORT;
const mongoUrl = process.env.MONGO_URL;
const mailingService = process.env.MAILING_SERVICE;
const mailingUser = process.env.MAILING_USER;
const mailingPassword = process.env.MAILING_PASSWORD;
const mailingPort = process.env.MAILING_PORT

export { jwtKey, mongoSecret, mongoUrlTest, nodeEnv, port, mongoUrl, mailingService, mailingUser, mailingPassword, mailingPort };