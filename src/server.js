import { Sequelize } from 'sequelize';
import app from './app.js';

const port = process.env.PORT || 9000;

const sequelize = new Sequelize(process.env.DB_DATABASE, process.env.DB_USERNAME, process.env.DB_PASSWORD, {
  host: process.env.DB_HOST,
  dialect: 'postgres',  
  port: process.env.DB_PORT || 5432, 
});




app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

export default {
  sequelize,
};
