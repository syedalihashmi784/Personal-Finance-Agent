import dotenv from 'dotenv';

dotenv.config();

export const {
  GROQ_API_KEY,
  DB_URL
} = process.env;




/* 
    📦 How This Works:
    This code:

    Loads .env file using dotenv.

    Destructures GROQ_API_KEY from process.env.

    Exports GROQ_API_KEY directly for use in other files.

    
*/

/* 
        import { GROQ_API_KEY } from './config.js';
*/