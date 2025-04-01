import db from "../database/models/index.js";

class TransactionsController {
    

    // Deposit money into an account
    static deposit = async (req, res) => {
        const t = await db.sequelize.transaction();
        try {
            const { accountId, amount, currency = 'INR' } = req.body;
            const validCurrencies = ['INR', 'USD', 'EUR']; 

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

}

export default TransactionsController;