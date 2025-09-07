import app from './app';
import { config } from 'dotenv';
import prisma from "./shared/prisma";

config();

const PORT = process.env.PORT || 8000;

async function startServer(){
  try{
    await prisma.$connect()
    console.log('Database connected successfully');

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
    
  }catch(e){
     console.error('Failed to connect to database:', e);
    process.exit(1); // E
  }
}

startServer()