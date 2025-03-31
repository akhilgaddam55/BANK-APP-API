import jwt from 'jsonwebtoken';
const { sign } = jwt;
import { compare, hash } from 'bcryptjs';
import db from '../database/models/index.js';

class Authentication {
  static handleLogin = async (req, res) => {
    const { email, password } = req.body;

    try {
      let user;
      user = await db.User.findOne({
        where: { email },
      });

      if (!user) {
        return res.status(401).json({ success: false, message: 'Invalid credentials' });
      }

      const isPasswordValid = await compare(password, user.password);

      if (!isPasswordValid) {
        return res.status(401).json({ success: false, message: 'Invalid credentials' });
      }

      const token = sign({ id: user.id, email: user.email}, process.env.JWT_SECRET, {
        expiresIn: '23h',
      });

      return res.json({
        success: true,
        message: 'Login successful',
        token,
        user
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ success: false, message: 'Internal server error' });
    }
  }

  static signUp = async (req, res) => {
    const { email, password} = req.body;

    try {
      const existingUser = await db.User.findOne({ where: { email} });

      if (existingUser) {
        return res.status(400).json({ success: false, message: 'Email is already in use' });
      }

      const hashedPassword = await hash(password, 10);

      const newUser = await db.User.create({
        email,
        password: hashedPassword,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const token = sign({ id: newUser.id, email: newUser.email}, process.env.JWT_SECRET, {
        expiresIn: '23h',
      });

      return res.status(201).json({
        success: true,
        message: 'User registered successfully',
        token,
        user: newUser
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ success: false, message: 'Failed to sign up' });
    }
  }
}

export default Authentication;
