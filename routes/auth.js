const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const router = express.Router();

// In-memory user store (for testing)
const users = [];

// In-memory reset tokens store (for testing)
const resetTokens = new Map();

const JWT_SECRET = process.env.JWT_SECRET || 'test-secret-key';

// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Validation
    if (!username || !email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields'
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        error: 'Password must be at least 6 characters'
      });
    }

    // Check if user exists
    if (users.find(u => u.email === email)) {
      return res.status(409).json({
        success: false,
        error: 'User already exists'
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = {
      id: `user_${Date.now()}`,
      username,
      email,
      password: hashedPassword,
      createdAt: new Date()
    };

    users.push(user);

    // Generate token
    const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, {
      expiresIn: '24h'
    });

    res.status(201).json({
      success: true,
      userId: user.id,
      token
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields'
      });
    }

    // Find user
    const user = users.find(u => u.email === email);
    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials'
      });
    }

    // Verify password
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials'
      });
    }

    // Generate token
    const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, {
      expiresIn: '24h'
    });

    res.status(200).json({
      success: true,
      userId: user.id,
      token
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST /api/auth/forgot-password
// FIRE-35: Request password reset
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        error: 'Email is required'
      });
    }

    // Find user
    const user = users.find(u => u.email === email);
    if (!user) {
      // Don't reveal if email exists (security best practice)
      return res.status(200).json({
        success: true,
        message: 'If that email exists, a password reset link has been sent'
      });
    }

    // Generate reset token
    const resetToken = `reset_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const expiresAt = Date.now() + (24 * 60 * 60 * 1000); // 24 hours

    // Store token
    resetTokens.set(resetToken, {
      email: user.email,
      expiresAt,
      used: false
    });

    // In production, send email with reset link
    // For testing, just return success
    console.log(`[FIRE-35] Password reset token for ${email}: ${resetToken}`);
    console.log(`[FIRE-35] Reset link: http://localhost:3000/reset-password?token=${resetToken}`);

    res.status(200).json({
      success: true,
      message: 'If that email exists, a password reset link has been sent',
      // In production, don't include token in response
      _devToken: resetToken // Only for testing
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST /api/auth/reset-password
// FIRE-35: Reset password using token
router.post('/reset-password', async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      return res.status(400).json({
        success: false,
        error: 'Token and new password are required'
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        error: 'Password must be at least 6 characters'
      });
    }

    // Validate token
    const tokenData = resetTokens.get(token);
    if (!tokenData) {
      return res.status(400).json({
        success: false,
        error: 'Invalid or expired reset token'
      });
    }

    // Check if token expired
    if (Date.now() > tokenData.expiresAt) {
      resetTokens.delete(token);
      return res.status(400).json({
        success: false,
        error: 'Reset token has expired'
      });
    }

    // Check if token already used
    if (tokenData.used) {
      return res.status(400).json({
        success: false,
        error: 'Reset token has already been used'
      });
    }

    // Find user
    const user = users.find(u => u.email === tokenData.email);
    if (!user) {
      return res.status(400).json({
        success: false,
        error: 'User not found'
      });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password
    user.password = hashedPassword;

    // Mark token as used and delete it
    resetTokens.delete(token);

    console.log(`[FIRE-35] Password reset successful for ${user.email}`);

    res.status(200).json({
      success: true,
      message: 'Password reset successful. You can now login with your new password.'
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
