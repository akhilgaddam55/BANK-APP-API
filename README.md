# Bank App API

![Railway Deployment](https://img.shields.io/badge/Deployed_on-Railway-0B0D0E?logo=railway)
![Node.js](https://img.shields.io/badge/Node.js-14.x%2B-339933?logo=nodedotjs)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15+-4169E1?logo=postgresql)
![Sequelize](https://img.shields.io/badge/Sequelize-6.x-52B0E7?logo=sequelize)

A secure banking API for user accounts, transactions, and authentication built with Node.js, Express, Sequelize, and PostgreSQL.

## Live Deployment

**Base URL**: `https://bank-app-api-production.up.railway.app`

**Swagger Documentation**: [View API Docs](https://bank-app-api-production.up.railway.app/api-docs)

## Technology Stack

- **Runtime**: Node.js 18.x
- **Framework**: Express.js
- **ORM**: Sequelize 6.x
- **Database**: PostgreSQL 15+
- **Authentication**: JWT (JSON Web Tokens)
- **Documentation**: Swagger UI
- **Deployment**: Railway.app
- **Environment**: Docker containers

## API Features

1. **User Authentication**
   - Registration with email verification
   - JWT-based login/logout
   - Password reset functionality

2. **Account Management**
   - Create/view/update user profiles
   - Multiple bank accounts per user
   - Account balance tracking

3. **Transaction Processing**
   - Funds transfer between accounts
   - Transaction history
   - Deposit/withdrawal operations

4. **Security**
   - Rate limiting
   - Input validation
   - Secure password hashing (bcrypt)

## Endpoint Reference

### Authentication

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/auth/register` | POST | Register new user |
| `/auth/login` | POST | User login |
| `/auth/logout` | POST | Invalidate JWT token |

### Accounts

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/accounts` | GET | List user accounts |
| `/accounts` | POST | Create new account |
| `/accounts/{id}` | GET | Get account details |

### Transactions

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/transactions` | POST | Create new transaction |
| `/transactions/{id}` | GET | Get transaction details |
| `/transactions/account/{accountId}` | GET | Get account transactions |

## Setup Instructions

### Local Development

1. Clone repository:
   ```bash
   git clone https://github.com/your-repo/bank-app-api.git
   cd bank-app-api
2. Install Dependencies
   npm install

3. Set env (should be at the root directory of your file).
   # Application
NODE_ENV=development
PORT=3000
JWT_SECRET=your_secure_jwt_secret_32chars_min

# Database
-DB_USER=postgres
-DB_PASSWORD=your_postgres_password
-DB_DATABASE=bank_app_dev
-DB_HOST=localhost
-DB_PORT=5432
-DB_SSL=false

4. Run Migration
 ```npm run migrate all```


6. Start the application.
  ```npm start```
