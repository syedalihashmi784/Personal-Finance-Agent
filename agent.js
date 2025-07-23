import { GROQ_API_KEY } from './config/index.js';
import Groq from 'groq-sdk';
import readline from 'node:readline/promises';


//dummy db
const expenseDB = [];

//Initialize Groq instance with the API key
// instance -> Api Key
const groq = new Groq({ apiKey: GROQ_API_KEY });

//calling agent using function
async function callAgent() {
    const messages = [
        //pass array of messages
        //every message is an object
        {
            role: "system",
            //giving personal to our agent -> role: sys
            content: `You are Josh, a friendly and knowledgeable personal finance assistant.
            Your job is to help users track expenses, manage balances, and plan their finances. 
            Speak in a natural, human-like tone when interacting.
            Only call one tool/function at a time.
            Wait for the tool's result before calling another.
            If you get something wrong, apologize and give user the error
            You have access to the following tools (functions):
            1. **addExpense**: Use this to record a new expense.
            - Requires: 'name' (item name) and 'amount' (cost as a number).
            2. **getTotalExpense**: Use this to calculate the total money spent between two dates.
            - Requires: 'from' (start date) and 'to' (end date).
            Today is ${new Date().toUTCString()}.`
        }
    ]
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

    while (true) {
        const question = await rl.question("User: ");
        messages.push({ role: "user", content: question });
        //if user types exit, break the loop
        if (question.toLowerCase() === "exit") {
            console.log("Exiting...");
            break;
        }
        while (true) {
            const completion = await groq.chat.completions
                .create({
                    messages: messages,
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
                        },
                        {
                            type: 'function',
                            function: {
                                name: 'addExpense',
                                description: 'Add item bought to database array using its name and price',
                                parameters: {
                                    type: 'object',
                                    properties: {
                                        name: {
                                            type: 'string',
                                            description: 'name of item purchased'

                                        },
                                        amount: {
                                            type: 'string',
                                            description: 'Amount paid for the item'
                                        }
                                    }
                                }
                            }
                        }

                    ]
                })
            // console.log(JSON.stringify(completion.choices[0], null, 2));
            // .then((chatCompletion) => {
            //   console.log(chatCompletion.choices[0]?.message?.content || "");
            // });
            const toolCall = completion.choices[0].message.tool_calls;
            //push all messages to the array
            messages.push(completion.choices[0].message);

            if (!toolCall) {
                console.log("Assistant:", completion.choices[0].message.content || "");
                break; // Exit the loop if no tool call is present
            }
            let result = "";
            for (const tool of toolCall) {
                const functionName = tool.function.name;
                const functionArgs = tool.function.arguments;
                if (functionName === "getTotalExpense") {
                    //call function and get its result
                    result = getTotalExpense(JSON.parse(functionArgs));
                    messages.push({
                        role: "tool",
                        tool_call_id: tool.id,
                        content: String(result)
                    });


                } else if (functionName === "addExpense") {
                    //call function and get its result
                    result = addExpense(JSON.parse(functionArgs));
                    messages.push({
                        role: "tool",
                        tool_call_id: tool.id,
                        content: String(result)
                    });
                    // messages.push(completion.choices[0].message);
                }
            }



        }
    }

    rl.close();




    // console.log("------------MESSAGES------------");
    // // console.log(JSON.stringify(messages, null, 2));
    // console.log(expenseDB);

    // console.log("------------------------");




}
callAgent();


/* Get total expense */

function getTotalExpense({ from, to }) {
    return expenseDB.reduce((acc, exp) => acc + exp.amount, 0);

}

function addExpense({ name, amount }) {
    expenseDB.push({ name, amount: Number(amount) });
    return "Added to expense DB"
}

