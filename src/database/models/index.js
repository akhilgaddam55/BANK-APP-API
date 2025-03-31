import { readdir } from 'fs/promises';
import { basename as _basename, join, dirname } from 'path';
import { fileURLToPath } from 'url';
import Sequelize, { DataTypes } from 'sequelize';
import { env as _env } from 'process';
import config from '../config/config.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const basename = _basename(__filename);
const env = _env.NODE_ENV || 'development';
const dbConfig = config[env];

const db = {};

let sequelize;
if (dbConfig.use_env_variable) {
  sequelize = new Sequelize(process.env[dbConfig.use_env_variable], dbConfig);
} else {
  sequelize = new Sequelize(dbConfig.database, dbConfig.username, dbConfig.password, dbConfig);
}

const files = await readdir(__dirname);
await Promise.all(
  files
    .filter(file => file !== basename && file.endsWith('.js') && !file.endsWith('.test.js'))
    .map(async file => {
      const module = await import(`file://${join(__dirname, file)}`);
      const modelInstance = module.default(sequelize, DataTypes);
      db[modelInstance.name] = modelInstance;
    })
);


Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

export default db;
