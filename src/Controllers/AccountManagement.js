
import db from "../database/models/index.js";

class AccountController {
  // Create a new account
  static createAccount = async (req, res) => {
    try {
      const { userId, accountType, currency = "INR" } = req.body;

      // Ensure user exists
      const user = await db.User.findOne({ where: { id: userId } });
      if (!user) return res.status(404).json({ message: "User not found" });

      // Create account
      const account = await db.Account.create({
        userId,
        accountType,
        balance: 0,
        currency,
        status: "active",
      });

      return res.status(201).json({ message: "Account created successfully", account });
    } catch (error) {
      return res.status(500).json({ message: "Error creating account", error: error.message });
    }
  };

  // Get account details
    static getAccountDetails = async (req, res) => {
        try {
            const { accountId } = req.params;
            const account = await db.Account.findOne({ where: { id: accountId } });

            if (!account) return res.status(404).json({ message: "Account not found" });

            if (account.status === "locked") {
                return res.status(403).json({ message: "Account is locked. Please unlock to proceed." });
            }

            return res.json(account);
        } catch (error) {
            return res.status(500).json({ message: "Error fetching account details", error: error.message });
        }
    };


   static unlockAccount = async (req, res) => {
    try {
        const { accountId } = req.params;
        const account = await db.Account.findOne({ where: { id: accountId } });

        if (!account) return res.status(404).json({ message: "Account not found" });

        if (account.status !== "locked") {
            return res.status(400).json({ message: "Account is already active" });
        }

        account.status = "active";
        await account.save();

        return res.json({ message: "Account unlocked successfully" });
    } catch (error) {
        return res.status(500).json({ message: "Error unlocking account", error: error.message });
    }
};

  // Get account balance
  static getBalance = async (req, res) => {
    try {
      const { accountId } = req.params;
      const account = await db.Account.findOne({ where: { id: accountId } });

      if (!account) return res.status(404).json({ message: "Account not found" });

      return res.json({ balance: account.balance, currency: account.currency });
    } catch (error) {
      return res.status(500).json({ message: "Error fetching balance", error: error.message });
    }
  };

  // Lock an account
  static lockAccount = async (req, res) => {
    try {
      const { accountId } = req.params;
      const account = await db.Account.findOne({ where: { id: accountId } });

      if (!account) return res.status(404).json({ message: "Account not found" });

      account.status = "locked";
      await account.save();

      return res.json({ message: "Account locked successfully" });
    } catch (error) {
      return res.status(500).json({ message: "Error locking account", error: error.message });
    }
  };

  // Get all accounts
  static getUsersAccounts= async (req, res) => {
    try {
      const { userId } = req.params;
      const accounts = await db.Account.findAll({ where: { userId } });

      if (!accounts.length) return res.status(402).json({ message: "No accounts found" });

      return res.json(accounts);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: "Error fetching accounts", error: error.message });
    }
  };

  //get alerts
  static getUsersAlerts= async (req, res) => {
    try {
      const { email } = req.params;
      const alerts = await db.Alert.findAll({ where: { recipient:email } });

      if (!alerts.length) return res.status(402).json({ message: "No alerts found" });

      return res.json(alerts);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: "Error fetching alerts", error: error.message });
    }
  };

  //Dashboard
  static getUsersDashboard = async (req, res) => {
    try {
      const { userId } = req.params;
  
      // Get all accounts for the user, including their transactions
      const accounts = await db.Account.findAll({
        where: { userId },
        include: [
          {
            model: db.Transaction,
            as: "transactions",
          },
        ],
      });
  
      if (!accounts.length) {
        return res.status(404).json({ message: "No accounts found" });
      }
  
      // Initialize counters
      let totalBalance = 0;
      let transactionCount = 0;
      let deposits = 0;
      let withdrawals = 0;
      let transfers = 0;
      let depositAmount = 0;
      let withdrawalAmount = 0;
      let transferAmount = 0;
  
      const balanceByType = {
        savings: 0,
        current: 0,
      };
  
      for (const account of accounts) {
        totalBalance += parseFloat(account.balance);
        balanceByType[account.accountType] += parseFloat(account.balance);
  
        const transactions = account.transactions || [];
        transactionCount += transactions.length;
  
        for (const tx of transactions) {
          const amt = parseFloat(tx.amount);
          if (tx.type === "deposit") {
            deposits++;
            depositAmount += amt;
          } else if (tx.type === "withdrawal") {
            withdrawals++;
            withdrawalAmount += amt;
          } else if (tx.type === "transfer") {
            transfers++;
            transferAmount += amt;
          }
        }
      }
  
      const dashboardData = {
        totalAccounts: accounts.length,
        totalBalance,
        balanceByType,
        transactionSummary: {
          totalTransactions: transactionCount,
          counts: { deposits, withdrawals, transfers },
          totals: {
            depositAmount,
            withdrawalAmount,
            transferAmount,
          },
        },
      };
  
      return res.json(dashboardData);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Error fetching dashboard", error: error.message });
    }
  };
  
}

export default AccountController;
