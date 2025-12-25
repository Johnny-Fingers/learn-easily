import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import UserModel from "../models/userModel.js";

const UserController = {
    // REGISTER A NEW USER
    register: async (req, res) => {
        try {
            const { email, name, lastname, password } = req.body;
            // Validate the input
            if (!email || !name || !lastname || !password) {
                return res.status(400).json({
                    error: 'All fields are required'
                });
            }
            // Check if the user already exists
            const existingUser = await UserModel.findByEmail(email);
            if (existingUser) {
                return res.status(400).json({
                    error: 'Email already registered'
                });
            }
            // Hash the password
            const saltRounds = 10;
            const hashedPassword = await bcrypt.hash(password, saltRounds);
            // Create the user
            const createdUser = await UserModel.create(email, name, lastname, hashedPassword);

            return res.status(201).json({
                message: 'User created successfully',
                userId: createdUser.lastID
            });

        } catch (error) {
            console.error('Register error:', error);
            return res.status(500).json({
                error: 'Error registering user'
            });
        }
    },

    // LOGIN
    login: async (req, res) => {
        try {
            const { email, password } = req.body;
            // Validate the input
            if (!email || !password) {
                return res.status(400).json({
                    error: 'All fields are required'
                });
            }
            // Find user
            const user = await UserModel.findByEmail(email);
            if (!user) {
                return res.status(401).json({
                    error: 'Invalid credentials'
                });
            }
            // Check password
            const isPasswordValid = await bcrypt.compare(password, user.password);
            if (!isPasswordValid) {
                return res.status(401).json({
                    error: 'Invalid credentials'
                });
            }
            // Create JWT token
            const token = jwt.sign(
                { userId: user.id, email: user.email },
                process.env.JWT_SECRET,
                { expiresIn: '6h' }
            );
            // Remove password from response
            const { password: _, ...userWithoutPassword } = user;
            res.status(200).json({
                message: 'Login successful',
                token: token,
                user: userWithoutPassword
            });

        } catch (error) {
            console.error('Login error:', error);
            return res.status(500).json({
                error: 'Error logging in'
            });
        }
    },

    // LOGOUT
    logout: async (req, res) => {
        try {
            res.json({
                message: 'Logout successful'
            });
        } catch (error) {
            return res.status(500).json({
                error: 'Error logging out'
            });
        }
    },

    // GET USER PROFILE
    getProfile: async (req, res) => {
        try {
            const userId = req.params.id;

            const user = await UserModel.findById(userId);
            if (!user) {
                return res.status(404).json({
                    error: 'User not found'
                });
            }

            res.json(user);
        } catch (error) {
            console.error('Get profile error:', error);
            return res.status(500).json({
                error: 'Error getting user profile'
            });
        }
    },

    // UPDATE USER PROFILE
    updateProfile: async (req, res) => {
        try {
            const userId = req.params.id;
            const { name, lastname } = req.body;

            if (!name || !lastname) {
                return res.status(400).json({
                    error: 'Name and lastname are required'
                });
            }

            await UserModel.update(userId, name, lastname);

            res.json({
                message: 'User profile updated successfully'
            });
        } catch (error) {
            console.log('Update profile error:', error);
            return res.status(500).json({
                error: 'Error updating user profile'
            });
        }
    },

    // UPDATE USER EMAIL
    updateEmail: async (req, res) => {
        try {
            const userId = req.params.id;
            const { email } = req.body;

            if (!email) {
                return res.status(400).json({
                    error: 'Email is required'
                });
            }

            await UserModel.updateEmail(userId, email);

            res.json({
                message: 'Email updated successfully'
            });
        } catch (error) {
            console.log('Update email error:', error);
            return res.status(500).json({
                error: 'Error updating user email'
            });
        }
    },

    // UPDATE USER PASSWORD
    updatePassword: async (req, res) => {
        try {
            const userId = req.params.id;
            const { oldPassword, newPassword } = req.body;

            if (!oldPassword || !newPassword) {
                return res.status(400).json({
                    error: 'Old and new password are required'
                });
            }

            const user = await UserModel.findById(userId);

            const isPasswordValid = await bcrypt.compare(oldPassword, user.password);
            if (!isPasswordValid) {
                return res.status(400).json({
                    error: 'Current password is incorrect'
                });
            }

            const hashedPassword = await bcrypt.hash(newPassword, 10);

            await UserModel.updatePassword(userId, hashedPassword);

            res.json({
                message: 'Password updated successfully'
            });
        } catch (error) {
            console.log('Update password error:', error);
            return res.status(500).json({
                error: 'Error updating user password'
            });
        }
    },

    // DELETE USER
    deleteUser: async (req, res) => {
        try {
            const userId = req.params.id;

            await UserModel.delete(userId);

            res.json({
                message: 'User deleted successfully'
            });
        } catch (error) {
            console.log('Delete user error:', error);
            return res.status(500).json({
                error: 'Error deleting user'
            });
        }
    }
};

export default UserController;