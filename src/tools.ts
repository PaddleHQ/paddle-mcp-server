import { z } from "zod";
import {
  createPriceParameters,
  createProductParameters,
  listPricesParameters,
  listProductsParameters,
  listCustomersParameters,
  listTransactionsParameters,
  listSubscriptionsParameters,
  createReportParameters,
} from "./parameters.js";
import {
  createProductPrompt,
  createPricePrompt,
  listProductsPrompt,
  listPricesPrompt,
  listCustomersPrompt,
  listTransactionsPrompt,
  listSubscriptionsPrompt,
  createReportPrompt,
} from "./prompts.js";

export type Tool = {
  method: string;
  name: string;
  description: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  parameters: z.ZodObject<any, any, any, any>;
  actions: {
    [key: string]: {
      [action: string]: boolean;
    };
  };
};

const tools: Tool[] = [
  {
    method: "list_products",
    name: "List Products",
    description: listProductsPrompt,
    parameters: listProductsParameters,
    actions: {
      products: {
        read: true,
      },
    },
  },
  {
    method: "create_product",
    name: "Create Product",
    description: createProductPrompt,
    parameters: createProductParameters,
    actions: {
      products: {
        write: true,
      },
    },
  },
  {
    method: "list_prices",
    name: "List Prices",
    description: listPricesPrompt,
    parameters: listPricesParameters,
    actions: {
      prices: {
        read: true,
      },
    },
  },
  {
    method: "create_price",
    name: "Create Price",
    description: createPricePrompt,
    parameters: createPriceParameters,
    actions: {
      prices: {
        write: true,
      },
    },
  },
  {
    method: "list_customers",
    name: "List Customers",
    description: listCustomersPrompt,
    parameters: listCustomersParameters,
    actions: {
      customers: {
        read: true,
      },
    },
  },
  {
    method: "list_transactions",
    name: "List Transactions",
    description: listTransactionsPrompt,
    parameters: listTransactionsParameters,
    actions: {
      transactions: {
        read: true,
      },
    },
  },
  {
    method: "list_subscriptions",
    name: "List Subscriptions",
    description: listSubscriptionsPrompt,
    parameters: listSubscriptionsParameters,
    actions: {
      subscriptions: {
        read: true,
      },
    },
  },
  {
    method: "create_report",
    name: "Create Report",
    description: createReportPrompt,
    parameters: createReportParameters,
    actions: {
      reports: {
        write: true,
      },
    },
  },
];

export default tools;
