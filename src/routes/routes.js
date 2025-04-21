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
 *     summary: Create a new account
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
 * /accounts/{accountId}:
 *   get:
 *     summary: Get account details
 *     description: Fetches details of a specific account.
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
 *         description: Returns account details.
 *       403:
 *         description: Account is locked.
 *       404:
 *         description: Account not found.
 *       500:
 *         description: Internal server error.
 */
routes.get("/accounts/:accountId", authenticate, AccountController.getAccountDetails);

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
 * /accounts/{accountId}/lock:
 *   put:
 *     summary: Lock an account
 *     description: Locks an account to prevent transactions.
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
 *         description: Account locked successfully.
 *       404:
 *         description: Account not found.
 *       500:
 *         description: Internal server error.
 */
routes.put("/accounts/:accountId/lock", authenticate, AccountController.lockAccount);

/**
 * @swagger
 * /accounts/{accountId}/unlock:
 *   put:
 *     summary: Unlock an account
 *     description: Unlocks a locked account.
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
 *         description: Account unlocked successfully.
 *       404:
 *         description: Account not found.
 *       400:
 *         description: Account is already active.
 *       500:
 *         description: Internal server error.
 */
routes.put("/accounts/:accountId/unlock", authenticate, AccountController.unlockAccount);

/**
 * @swagger
 * /accounts:
 *   get:
 *     summary: Get all accounts
 *     description: Retrieves a list of all accounts.
 *     tags: [Accounts]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Returns all accounts.
 *       404:
 *         description: No accounts found.
 *       500:
 *         description: Internal server error.
 */
routes.get("/user-accounts/:userId", authenticate, AccountController.getUsersAccounts);

/**TRANSACTIONS */
/**
 * @swagger
 * /transactions:
 *   get:
 *     summary: Retrieve all transactions
 *     description: Fetch a list of all transactions from the database.
 *     tags:
 *       - Transactions
 *     responses:
 *       200:
 *         description: A list of transactions.
 *       500:
 *         description: Internal server error.
 */
routes.get("/transactions/:userId", TransactionsController.getAllTransactions);

/**
 * @swagger
 * /transactions/{accountId}:
 *   get:
 *     summary: Retrieve transactions for a specific account
 *     description: Fetch all transactions related to a given account.
 *     tags:
 *       - Transactions
 *     parameters:
 *       - in: path
 *         name: accountId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the account to fetch transactions for.
 *     responses:
 *       200:
 *         description: A list of transactions for the account.
 *       404:
 *         description: No transactions found.
 *       500:
 *         description: Internal server error.
 */
routes.get("/transactions/:accountId", TransactionsController.getTransactionsByAccount);

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
routes.post("/transactions/deposit", TransactionsController.deposit);

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
routes.post("/transactions/withdraw", TransactionsController.withdraw);

/**
 * @swagger
 * /transactions/transfer:
 *   post:
 *     summary: Transfer money between accounts
 *     description: Moves money from one account to another.
 *     tags:
 *       - Transactions
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - fromAccountId
 *               - toAccountId
 *               - amount
 *             properties:
 *               fromAccountId:
 *                 type: string
 *                 description: The ID of the sender's account.
 *               toAccountId:
 *                 type: string
 *                 description: The ID of the recipient's account.
 *               amount:
 *                 type: number
 *                 description: Amount to be transferred.
 *     responses:
 *       201:
 *         description: Transfer successful.
 *       400:
 *         description: Insufficient balance or invalid input.
 *       500:
 *         description: Internal server error.
 */
routes.post("/transactions/transfer", TransactionsController.transfer);

routes.get('/dashboard/:userId', AccountController.getUsersDashboard);

routes.get("/alerts/:email", authenticate, AccountController.getUsersAlerts);

export default routes;
