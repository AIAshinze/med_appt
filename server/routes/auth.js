import express from 'express';
import bcrypt from 'bcryptjs';
import { body, validationResult } from 'express-validator';
import jwt from 'jsonwebtoken';
import session from 'express-session';
import passport from 'passport';
import dotenv from 'dotenv';
import UserSchema from '../models/User.js';
import process from 'node:process';

dotenv.config();

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET ?? 'thisiscodeformediclapplicationwhich isbuiltinreactappproject';
const SESSION_SECRET = process.env.SESSION_SECRET ?? 'keyboard cat';
const SALT_ROUNDS = 10;
const ONE_DAY_MS = 1000 * 60 * 60 * 24;

const signToken = (id) => jwt.sign({ user: { id } }, JWT_SECRET);

router.use(
    session({
        secret: SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
        cookie: {
            httpOnly: true,
            secure: false,
            maxAge: ONE_DAY_MS,
        },
    }),
);

router.use(passport.initialize());
router.use(passport.session());

passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser((id, done) => done(null, id));

// Route 1: Register a new user. POST /api/auth/register. No login required.
router.post(
    '/register',
    [
        body('email', 'Please Enter a Valid Email').isEmail(),
        body('name', 'Username should be at least 4 characters.').isLength({ min: 4 }),
        body('password', 'Password Should Be At Least 8 Characters.').isLength({ min: 8 }),
        body('phone', 'Phone Number Should Be 10 Digits.').isLength({ min: 10 }),
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ error: errors.array() });
        }

        const { email, name, password, phone } = req.body;

        try {
            const existingUser = await UserSchema.findOne({ email });
            if (existingUser) {
                return res.status(403).json({ error: 'A User with this email address already exists' });
            }

            const hash = await bcrypt.hash(password, SALT_ROUNDS);
            const newUser = await UserSchema.create({
                email,
                name,
                password: hash,
                phone,
                createdAt: new Date(),
            });

            res.json({ authtoken: signToken(newUser.id) });
        } catch (error) {
            console.error(error);
            res.status(500).send('Internal Server Error');
        }
    },
);

// Route 2: Log in. POST /api/auth/login. No login required.
router.post(
    '/login',
    [body('email', 'Please Enter a Valid Email').isEmail()],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { email, password } = req.body;

        try {
            const user = await UserSchema.findOne({ email });
            if (!user) {
                return res.status(403).json({ error: 'Invalid Credentials' });
            }

            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res.status(403).json({ error: 'Invalid Credentials' });
            }

            req.session.email = email;
            res.status(200).json({ authtoken: signToken(user.id) });
        } catch (error) {
            console.error(error);
            res.status(500).send('Internal Server Error');
        }
    },
);

// Route 3: Update user by name. PUT /api/auth/update
router.put('/update', async (req, res) => {
    const { name } = req.body;

    try {
        const existingUser = await UserSchema.findOne({ username: name });
        if (!existingUser) {
            return res.status(404).json({ error: 'User not found' });
        }

        existingUser.name = name;
        existingUser.updatedAt = new Date();
        const updatedUser = await existingUser.save();

        res.json({ authtoken: signToken(updatedUser.id) });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

// Route 4: Fetch user data by email header. GET /api/auth/user
router.get('/user', async (req, res) => {
    const { email } = req.headers;
    if (!email) {
        return res.status(400).json({ error: 'Email not found in the request headers' });
    }

    try {
        const user = await UserSchema.findOne({ email });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const { id, name, phone, role, createdAt, updatedAt } = user;
        res.json({ id, name, email: user.email, phone, role, createdAt, updatedAt });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

// Route 5: Update name and phone by email header. PUT /api/auth/user
router.put(
    '/user',
    [
        body('name', 'Username should be at least 4 characters').isLength({ min: 4 }),
        body('phone', 'Phone number should be 10 digits').isLength({ min: 10 }),
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { email } = req.headers;
        if (!email) {
            return res.status(400).json({ error: 'Email not found in the request headers' });
        }

        try {
            const existingUser = await UserSchema.findOne({ email });
            if (!existingUser) {
                return res.status(404).json({ error: 'User not found' });
            }

            existingUser.name = req.body.name;
            existingUser.phone = req.body.phone;
            existingUser.updatedAt = new Date();
            const updatedUser = await existingUser.save();

            res.json({ authtoken: signToken(updatedUser.id) });
        } catch (error) {
            console.error(error);
            res.status(500).send('Internal Server Error');
        }
    },
);

export default router;