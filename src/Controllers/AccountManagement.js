
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
  static getAllAccounts = async (req, res) => {
    try {
      const accounts = await db.Account.findAll({ include: "User" });

      if (!accounts.length) return res.status(404).json({ message: "No accounts found" });

      return res.json(accounts);
    } catch (error) {
      return res.status(500).json({ message: "Error fetching accounts", error: error.message });
    }
  };
}

export default AccountController;
