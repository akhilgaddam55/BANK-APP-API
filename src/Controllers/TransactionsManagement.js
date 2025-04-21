import db from "../database/models/index.js";

class TransactionsController {
    // Get all transactions
    static getAllTransactions = async (req, res) => {
        try {
            const { userId } = req.params;
    
            const transactions = await db.Transaction.findAll({
                include: [
                    {
                        model: db.Account,
                        as: 'account',
                        where: { userId }, // filter by userId from the associated Account
                        attributes: [] // don't need to return account data here
                    }
                ],
                order: [['createdAt', 'DESC']]
            });
    
            return res.json(transactions);
        } catch (error) {
            return res.status(500).json({
                message: "Error fetching transactions",
                error: error.message
            });
        }
    };
    
    // Get transactions for a specific account
    static getTransactionsByAccount = async (req, res) => {
        try {
            const { accountId } = req.params;
            const transactions = await db.Transaction.findAll({ 
                where: { accountId },
                order: [['createdAt', 'DESC']]
            });

            if (!transactions.length) {
                return res.status(404).json({ 
                    message: "No transactions found for this account" 
                });
            }

            return res.json(transactions);
        } catch (error) {
            return res.status(500).json({ 
                message: "Error fetching transactions", 
                error: error.message 
            });
        }
    };

    // Deposit money into an account
    static deposit = async (req, res) => {
        const t = await db.sequelize.transaction();
        try {
            const { accountId, amount, currency = 'INR' } = req.body;
            const validCurrencies = ['INR', 'USD', 'EUR']; // Add more as needed

            // Validations
            if (amount <= 0) {
                await t.rollback();
                return res.status(400).json({ 
                    message: "Amount must be greater than zero" 
                });
            }

            if (!validCurrencies.includes(currency)) {
                await t.rollback();
                return res.status(400).json({ 
                    message: "Invalid currency" 
                });
            }

            const account = await db.Account.findByPk(accountId, { transaction: t });
            if (!account) {
                await t.rollback();
                return res.status(404).json({ 
                    message: "Account not found" 
                });
            }

            if (account.status !== 'active') {
                await t.rollback();
                return res.status(400).json({ 
                    message: "Account is not active" 
                });
            }

            // Create deposit transaction
            const transaction = await db.Transaction.create({
                accountId,
                type: "deposit",
                amount: parseFloat(amount).toFixed(2),
                currency,
                status: "completed"
            }, { transaction: t });

            // Update account balance
            const newBalance = (
                parseFloat(account.balance) + parseFloat(amount)
            ).toFixed(2);
            
            await account.update({ balance: newBalance }, { transaction: t });

            await t.commit();
            return res.status(201).json({ 
                message: "Deposit successful", 
                transaction, 
                newBalance 
            });
        } catch (error) {
            await t.rollback();
            return res.status(500).json({ 
                message: "Error processing deposit", 
                error: error.message 
            });
        }
    };

    // Withdraw money from an account
    static withdraw = async (req, res) => {
        const t = await db.sequelize.transaction();
        try {
            const { accountId, amount } = req.body;

            // Validations
            if (amount <= 0) {
                await t.rollback();
                return res.status(400).json({ 
                    message: "Amount must be greater than zero" 
                });
            }

            const account = await db.Account.findByPk(accountId, { transaction: t });
            if (!account) {
                await t.rollback();
                return res.status(404).json({ 
                    message: "Account not found" 
                });
            }

            if (account.status !== 'active') {
                await t.rollback();
                return res.status(400).json({ 
                    message: "Account is not active" 
                });
            }

            // Check balance
            if (parseFloat(account.balance) < parseFloat(amount)) {
                await t.rollback();
                return res.status(400).json({ 
                    message: "Insufficient balance" 
                });
            }

            // Create withdrawal transaction
            const transaction = await db.Transaction.create({
                accountId,
                type: "withdrawal",
                amount: parseFloat(amount).toFixed(2),
                currency: account.currency,
                status: "completed"
            }, { transaction: t });

            // Update account balance
            const newBalance = (
                parseFloat(account.balance) - parseFloat(amount)
            ).toFixed(2);
            
            await account.update({ balance: newBalance }, { transaction: t });

            await t.commit();
            return res.status(201).json({ 
                message: "Withdrawal successful", 
                transaction, 
                newBalance 
            });
        } catch (error) {
            await t.rollback();
            return res.status(500).json({ 
                message: "Error processing withdrawal", 
                error: error.message 
            });
        }
    };


    static transfer = async (req, res) => {
        const t = await db.sequelize.transaction();
        try {
            const { fromAccountId, toAccountId, amount } = req.body;
          
            if (amount <= 0) {
                await t.rollback();
                return res.status(400).json({ message: "Amount must be greater than zero" });
            }
    
            if (fromAccountId === toAccountId) {
                await t.rollback();
                return res.status(400).json({ message: "Cannot transfer to the same account" });
            }
    
            const fromAccount = await db.Account.findByPk(fromAccountId, { transaction: t });
            const toAccount = await db.Account.findByPk(toAccountId, { transaction: t });

            console.log('from banace',fromAccount.balance);
            console.log('to  banace',fromAccount.balance);
    
            if (!fromAccount || !toAccount) {
                await t.rollback();
                return res.status(404).json({ message: "One or both accounts not found" });
            }
            
            const senderUser = await db.User.findOne({
                where:{id: fromAccount .userId},
                attributes: ['email']
            })

            const receiverUser = await db.User.findOne({
                where:{id: toAccount.userId},
                attributes: ['email']
            })
    
            if (fromAccount.status !== 'active' || toAccount.status !== 'active') {
                await t.rollback();
                return res.status(400).json({ message: "One or both accounts are not active" });
            }
    
            // Check balance
            if (parseFloat(fromAccount.balance) < parseFloat(amount)) {
                await t.rollback();
                return res.status(400).json({ message: "Insufficient balance for transfer" });
            }
    
            // Deduct from sender
            const fromNewBalance = (parseFloat(fromAccount.balance) - parseFloat(amount)).toFixed(2);
            await fromAccount.update({ balance: fromNewBalance }, { transaction: t });
    
            // Add to receiver
            const toNewBalance = (parseFloat(toAccount.balance) + parseFloat(amount)).toFixed(2);
            await toAccount.update({ balance: toNewBalance }, { transaction: t });
    
            // Create transfer transactions
            const transactionOut = await db.Transaction.create({
                accountId: fromAccountId,
                type: "transfer",
                amount: parseFloat(amount).toFixed(2),
                currency: fromAccount.currency,
                status: "completed"
            }, { transaction: t });

            await db.Alert.create({
                message: `Hello, You have successfully Sent INR ${amount} to Account ${toAccount.accountNumber}`,
                recipient: senderUser.email,
              }, { transaction: t });
    
            const transactionIn = await db.Transaction.create({
                accountId: toAccountId,
                type: "deposit",
                amount: parseFloat(amount).toFixed(2),
                currency: toAccount.currency,
                status: "completed"
            }, { transaction: t });


            await db.Alert.create({
                message: `Hello, You have Received INR ${amount} from Account ${fromAccount.accountNumber}`,
                recipient: receiverUser.email,
              }, { transaction: t });
           
    
            await t.commit();
    
            return res.status(201).json({
                message: "Transfer successful",
                transactions: {
                    debit: transactionOut,
                    credit: transactionIn
                },
                balances: {
                    fromAccount: fromNewBalance,
                    toAccount: toNewBalance
                }
            });
        } catch (error) {
            console.log(error);
            await t.rollback();
            return res.status(500).json({
                message: "Error processing transfer",
                error: error.message
            });
        }
    };
}

export default TransactionsController;