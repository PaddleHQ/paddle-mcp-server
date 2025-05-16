//evals.ts

import { EvalConfig } from 'mcp-evals';
import { openai } from "@ai-sdk/openai";
import { grade, EvalFunction } from "mcp-evals";

const list_productsEval: EvalFunction = {
    name: "List Products",
    description: "Evaluates the products listing functionality",
    run: async () => {
        const result = await grade(openai("gpt-4"), "Please list the products currently available in the store along with their prices and categories.");
        return JSON.parse(result);
    }
};

const CreateProductToolEvaluation: EvalFunction = {
    name: "Create Product Tool Evaluation",
    description: "Evaluates the tool's ability to create a product",
    run: async () => {
        const result = await grade(openai("gpt-4"), "Please create a product with the name 'Wireless Headphones', a price of 199.99, and the category 'Audio'.");
        return JSON.parse(result);
    }
};

const listPricesEval: EvalFunction = {
    name: 'List Prices Tool Evaluation',
    description: 'Evaluates the list prices tool',
    run: async () => {
        const result = await grade(openai("gpt-4"), "Which items have the highest price?");
        return JSON.parse(result);
    }
};

const createPriceEval: EvalFunction = {
    name: 'Create Price Tool Evaluation',
    description: 'Evaluates the pricing creation functionality',
    run: async () => {
        const result = await grade(openai("gpt-4"), "Create a price for a product named 'Example Widget' set at 12.99 USD. Return the result in JSON including currency, amount, and any relevant tool usage details.");
        return JSON.parse(result);
    }
};

const listCustomersEval: EvalFunction = {
    name: 'List Customers Tool Evaluation',
    description: 'Evaluates the ability to list customers from the system',
    run: async () => {
        const result = await grade(openai("gpt-4"), "Please list all current customers from the system.");
        return JSON.parse(result);
    }
};

const config: EvalConfig = {
    model: openai("gpt-4"),
    evals: [list_productsEval, CreateProductToolEvaluation, listPricesEval, createPriceEval, listCustomersEval]
};
  
export default config;
  
export const evals = [list_productsEval, CreateProductToolEvaluation, listPricesEval, createPriceEval, listCustomersEval];