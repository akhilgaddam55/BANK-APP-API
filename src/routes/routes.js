import { Router } from 'express';
const routes = Router();
import Authentication from '../middlewares/Authentication.js';
import authenticate from '../middlewares/authenticate.js';
import AccountController from '../Controllers/AccountManagement.js';
import { graphqlHTTP } from 'express-graphql';
import { buildSchema } from 'graphql';
import TransactionsController from "../Controllers/TransactionsManagement.js";

const schema = buildSchema(`
    type Query {
      getAccountBalance(accountId: String!): Float
    }

    type Mutation {
      createAccount(userId: String!, accountType: String!, currency: String): Account
      depositMoney(accountId: String!, amount: Float!): Transaction
      withdrawMoney(accountId: String!, amount: Float!): Transaction
    }

    type Account {
      accountId: String
      userId: String
      accountType: String
      currency: String
    }

    type Transaction {
      transactionId: String
      accountId: String
      amount: Float
      transactionType: String
      date: String
    }
`);

const root = {
  createAccount: async ({ userId, accountType, currency }) => {
    return AccountController.createAccount({ userId, accountType, currency });
  },
  getAccountBalance: async ({ accountId }) => {
    return AccountController.getBalanceById(accountId);
  },
  depositMoney: async ({ accountId, amount }) => {
    return TransactionsController.deposit(accountId, amount);
  },
  withdrawMoney: async ({ accountId, amount }) => {
    return TransactionsController.withdraw(accountId, amount);
  },
};

/**
 * @swagger
 * tags:
 *   - name: Authentication
 *     description: User authentication endpoints
 *   - name: Accounts
 *     description: Account management endpoints
 */

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: User login
 *     description: Authenticates a user and returns a JWT token.
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: User's email address.
 *               password:
 *                 type: string
 *                 format: password
 *                 description: User's password.
 *     responses:
 *       200:
 *         description: Successful login.
 *       401:
 *         description: Unauthorized - Invalid credentials.
 *       500:
 *         description: Internal server error.
 */
routes.post('/auth/login', Authentication.handleLogin);

/**
 * @swagger
 * /auth/signUp:
 *   post:
 *     summary: User registration
 *     description: Registers a new user and returns a confirmation.
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, email, password]
 *             properties:
 *               name:
 *                 type: string
 *                 description: Full name of the user.
 *               email:
 *                 type: string
 *                 format: email
 *                 description: User's email address.
 *               password:
 *                 type: string
 *                 format: password
 *                 description: User's password.
 *     responses:
 *       201:
 *         description: User registered successfully.
 *       400:
 *         description: Bad request - Invalid input.
 *       500:
 *         description: Internal server error.
 */
routes.post('/auth/signUp', Authentication.signUp);

//***ACCOUNTS **/

/**
 * @swagger
 * /accounts/create:
 *   post:
 *     summary: Create a new Bank account
 *     description: Creates a new bank account for a user.
 *     tags: [Accounts]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [userId, accountType]
 *             properties:
 *               userId:
 *                 type: string
 *                 format: uuid
 *                 description: The ID of the user who owns the account.
 *               accountType:
 *                 type: string
 *                 enum: [savings, checking]
 *                 description: The type of account.
 *               currency:
 *                 type: string
 *                 description: The currency of the account. Default is INR..
 *     responses:
 *       201:
 *         description: Account created successfully.
 *       400:
 *         description: Invalid input data.
 *       500:
 *         description: Internal server error.
 */
routes.post("/accounts/create", authenticate, AccountController.createAccount);


/**
 * @swagger
 * /accounts/{accountId}/balance:
 *   get:
 *     summary: Get account balance
 *     description: Retrieves the balance of a specific account.
 *     tags: [Accounts]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: accountId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the account.
 *     responses:
 *       200:
 *         description: Returns account balance.
 *       404:
 *         description: Account not found.
 *       500:
 *         description: Internal server error.
 */
routes.get("/accounts/:accountId/balance", authenticate, AccountController.getBalance);

/**
 * @swagger
 * /transactions/deposit:
 *   post:
 *     summary: Deposit money into an account
 *     description: Adds a deposit transaction to the specified account.
 *     tags:
 *       - Transactions
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - accountId
 *               - amount
 *               - currency
 *             properties:
 *               accountId:
 *                 type: string
 *                 description: The ID of the account to deposit into.
 *               amount:
 *                 type: number
 *                 description: Amount to be deposited.
 *               currency:
 *                 type: string
 *                 description: Currency of the transaction (e.g., INR, USD).
 *     responses:
 *       201:
 *         description: Deposit successful.
 *       400:
 *         description: Invalid input.
 *       500:
 *         description: Internal server error.
 */
routes.post("/transactions/deposit", authenticate, TransactionsController.deposit);

/**
 * @swagger
 * /transactions/withdraw:
 *   post:
 *     summary: Withdraw money from an account
 *     description: Subtracts an amount from the account balance.
 *     tags:
 *       - Transactions
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - accountId
 *               - amount
 *             properties:
 *               accountId:
 *                 type: string
 *                 description: The ID of the account to withdraw from.
 *               amount:
 *                 type: number
 *                 description: Amount to be withdrawn.
 *     responses:
 *       201:
 *         description: Withdrawal successful.
 *       400:
 *         description: Insufficient balance or invalid input.
 *       500:
 *         description: Internal server error.
 */
routes.post("/transactions/withdraw", authenticate, TransactionsController.withdraw);

/**
 * @swagger
 * tags:
 *   - name: GRAPHQL
 *     description: GraphQL endpoint for interacting with accounts and transactions.
 * 
 * # Test the GraphQL API using Postman
 * /graphql-test:
 *   get:
 *     summary: Test the GraphQL API using Postman
 *     description: Provides step-by-step instructions for testing GraphQL queries and mutations using Postman.
 *     tags: [GRAPHQL]
 *     responses:
 *       200:
 *         description: Instructions for testing GraphQL in Postman.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 instructions:
 *                   type: string
 *                   example: |
 *                     Step-by-step guide to test the GraphQL API in Postman:
 *                     1. Open Postman and create a new **POST** request.
 *                     2. Set the URL to the GraphQL endpoint, e.g., `http://localhost:9000/graphql`.
 *                     3. Go to the **Body** tab and select the **raw** option.
 *                     4. Choose **JSON** from the dropdown next to raw.
 *                     5. In the request body, enter your GraphQL query or mutation. For example:
 *                        ```json
 *                        {
 *                          "query": "{ getAccountBalance(accountId: \"1234\") }"
 *                        }
 *                        ```
 *                     6. Click **Send** to execute the query.
 *                     7. View the response in Postman, which should be a JSON object with the result of your query:
 *                        ```json
 *                        {
 *                          "data": {
 *                            "getAccountBalance": 500.0
 *                          }
 *                        }
 *                        ```
 */
routes.use('/graphql', graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: true, 
  }));
  

export default routes;
