import express from 'express';
import cors from 'cors';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';
import connectToMongo from './db.js';
import authRoutes from './routes/auth.js';

// __dirname is not available in ES modules, so derive it from import.meta.url
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ?? 8181;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'build')));

// Routes
app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.use('/api/auth', authRoutes);

// Unknown API paths get a JSON 404 instead of the React app
app.use('/api', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Send index.html for any other GET request so React Router can handle the URL
app.use((req, res, next) => {
  if (req.method !== 'GET') return next();
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

// Connect to MongoDB before accepting requests
const start = async () => {
  try {
    await connectToMongo();
    app.listen(PORT, () => {
      console.log(`Server is running on port http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

start();