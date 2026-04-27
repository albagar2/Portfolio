import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { authMiddleware } from './infrastructure/http/middlewares/authMiddleware';
import { ExpenseController } from './infrastructure/http/controllers/ExpenseController';
import { AuthController } from './infrastructure/http/controllers/AuthController';
import { UploadController } from './infrastructure/http/controllers/UploadController';

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Multer Configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

// Middlewares
app.use(helmet({
  crossOriginResourcePolicy: false, // Allow loading images from different origins
}));
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(uploadsDir));

// Routes
const expenseController = new ExpenseController();
const authController = new AuthController();
const uploadController = new UploadController();

app.get('/health', (req, res) => res.json({ status: 'ok' }));

// Auth Routes
app.post('/api/auth/login', (req, res) => authController.login(req, res));

import { internalAuthMiddleware } from './infrastructure/http/middlewares/internalAuthMiddleware';

// Protected Routes
app.post('/api/expenses', authMiddleware as any, (req, res) => expenseController.create(req as any, res));
app.get('/api/expenses', authMiddleware as any, (req, res) => expenseController.getAll(req as any, res));

// Internal Sync Route (from Gasoil app)
app.post('/api/internal/expenses', internalAuthMiddleware as any, (req, res) => expenseController.create(req as any, res));

// Upload Route
app.post('/api/upload', authMiddleware as any, upload.single('receipt'), (req, res) => uploadController.uploadReceipt(req as any, res));

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Internal Server Error' });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
