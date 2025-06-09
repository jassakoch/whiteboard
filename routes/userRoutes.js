import express from 'express';
import bcrypt from 'bcrypt';
import User from '../models/User.js';
import jwt from 'jsonwebtoken'; 
import protect from '../middleware/auth.js'; 


const userRouter = express.Router();

// POST route for user registration
userRouter.post('/register', async (req, res) => {
    const { firstName, lastName, email, password } = req.body;

    if (!firstName || !lastName || !email || !password) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    try {
        // Check if the email is already in use
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({ message: 'Email already registered' });
        }

       

        // Create new user
        const newUser = new User({
            firstName,
            lastName,
            email,
            password,
        });

        await newUser.save();

        res.status(201).json({ message: 'User registered successfully' });

    } catch (err) {
        console.error('Error registering user:', err);
        res.status(500).json({ message: 'Server error' });
    }
});



// POST /api/users/login
userRouter.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        
        if (!user) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        console.log('isMatch:', isMatch);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        // Generate JWT token
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
            expiresIn: '1h',
        });

        res.status(200).json({
            message: 'Login successful',
            token, // frontend/client stores this
        });
    } catch (err) {
        console.error('Login error:', err);
        res.status(500).json({ message: 'Server error' });
    }
});




// PUT route to update password
userRouter.put('/update-password', protect, async (req, res) => {
    const { currentPassword, newPassword } = req.body;

    try {
        // Assuming user is authenticated and user ID is available in req.user
        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Check if current password is correct
        const isMatch = await bcrypt.compare(currentPassword, user.password);

        if (!isMatch) {
            return res.status(400).json({ message: 'Current password is incorrect' });
        }

        // Hash the new password and save
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(newPassword, salt);
        await user.save();

        res.status(200).json({ message: 'Password updated successfully' });
    } catch (err) {
        console.error('Error updating password:', err);
        res.status(500).json({ message: 'Server error' });
    }
});


export default userRouter;
