import { Router } from 'express';
const routes = Router();
import Authentication from '../middlewares/Authentication.js';
import authenticate from '../middlewares/authenticate.js';
import AccountController from '../Controllers/AccountManagement.js';
import TransactionsController from "../Controllers/TransactionsManagement.js";

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

export default routes;
