import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import router from './routes';
import httpStatus from 'http-status';
import GlobalErrorHandler from './middlewares/globalErrorHandler';


dotenv.config(); // Load .env variables

const app = express();
export const corsOptions = {
  origin: [
    "http://localhost:3001",
    "http://localhost:3000",
    "https://jharr0919-frontend.vercel.app",
    "https://grindandunwind.co",
    "https://www.grindandunwind.co",
  ],
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
}

// Middlewares
app.use(helmet()); 
app.use(cors(corsOptions)); 
app.use(morgan('dev')); 
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies
app.use(cookieParser()); // Parse cookies

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 mins
  max: 100, // Limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Routes
app.use('/api/v1', router);

app.use(GlobalErrorHandler)

app.use((req, res, next) => {
  res.status(httpStatus.NOT_FOUND).json({
    success: false,
    message: "Api Not Found",
    error: {
      path: req.originalUrl,
      message: "Your requested path is not found!",
    }
  })
})

export default app;
