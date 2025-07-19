import { GROQ_API_KEY } from './config/index.js';
import Groq from 'groq-sdk';

//Initialize Groq instance with the API key
// instance -> Api Key
const groq = new Groq({ apiKey: GROQ_API_KEY });

//calling agent using function
async function callAgent() {
    const completion = await groq.chat.completions
        .create({
            messages: [
                //pass array of messages
                //every message is an object
                {
                    role: "system",
                    //giving personal to our agent -> role: sys
                    content: `You are Josh, a personal finance assistant. 
                    Your task is to assist user with th eir expenses, balanaces and financial planning ${new Date().toUTCString()}`
                },
                {
                    role: "user",
                    content: "How much money i have spent this month",
                },
            ],
            model: "llama-3.3-70b-versatile",
            tools: [
                {
                    type: 'function',
                    function: {
                        name: 'getTotalExpense',
                        description: 'Get total expense from date to date',
                        parameters: {
                            type: 'object',
                            properties: {
                                from: {
                                    type: 'string',
                                    description: 'From date to get the expense'

                                },
                                to: {
                                    type: 'string',
                                    description: 'To date to get the expense'
                                }
                            }
                        }
                    }
                }
            ]
        })
    // .then((chatCompletion) => {
    //   console.log(chatCompletion.choices[0]?.message?.content || "");
    // });

    console.log(JSON.stringify(completion.choices[0], null, 2));

}
callAgent();


/* Get total expense */

function getTotalExpense({ from, to }) {
    console.log("Calling getTotalExpense Tool");
    // in reality call db
    return 10000

}