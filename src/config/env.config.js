import dotenv from 'dotenv'
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const loadPath = path.join(__dirname, '../.env');

dotenv.config({ silent: false, path: loadPath });

const jwtKey = process.env.JWT_KEY;
const mongoSecret = process.env.MONGO_SECRET;

export { jwtKey, mongoSecret };