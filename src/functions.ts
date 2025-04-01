import { CreatePriceRequestBody, Paddle } from "@paddle/paddle-node-sdk";
import { z } from "zod";
import {
  createProductParameters,
  listProductsParameters,
  createPriceParameters,
  listPricesParameters,
  listCustomersParameters,
  listTransactionsParameters,
  listSubscriptionsParameters,
  createReportParameters,
} from "./parameters.js";

export const createProduct = async (paddle: Paddle, params: z.infer<typeof createProductParameters>) => {
  try {
    const product = await paddle.products.create(params);

    return product;
  } catch (error) {
    return error;
  }
};

export const listProducts = async (paddle: Paddle, params: z.infer<typeof listProductsParameters>) => {
  try {
    const productsCollection = paddle.products.list(params);
    const products = await productsCollection.next();
    const pagination = paginationData(productsCollection);

    return { pagination, products };
  } catch (error) {
    return error;
  }
};

export const createPrice = async (paddle: Paddle, params: z.infer<typeof createPriceParameters>) => {
  try {
    // params are coerced to CreatePriceRequestBody because unitPriceOverrides.countryCodes is a union
    // https://github.com/PaddleHQ/paddle-node-sdk/blob/main/src/enums/shared/country-code.ts
    const price = await paddle.prices.create(params as CreatePriceRequestBody);

    return price;
  } catch (error) {
    return error;
  }
};

export const listPrices = async (paddle: Paddle, params: z.infer<typeof listPricesParameters>) => {
  try {
    const pricesCollection = paddle.prices.list(params);
    const prices = await pricesCollection.next();
    const pagination = paginationData(pricesCollection);

    return { pagination, prices };
  } catch (error) {
    return error;
  }
};

export const listCustomers = async (paddle: Paddle, params: z.infer<typeof listCustomersParameters>) => {
  try {
    const customerCollection = paddle.customers.list(params);
    const customers = await customerCollection.next();
    const pagination = paginationData(customerCollection);

    return { pagination, customers };
  } catch (error) {
    return error;
  }
};

export const listTransactions = async (paddle: Paddle, params: z.infer<typeof listTransactionsParameters>) => {
  try {
    const transformedParams = transformParams(params);
    const transactionCollection = paddle.transactions.list(transformedParams);
    const transactions = await transactionCollection.next();
    const pagination = paginationData(transactionCollection);

    return { pagination, transactions };
  } catch (error) {
    return error;
  }
};

export const listSubscriptions = async (paddle: Paddle, params: z.infer<typeof listSubscriptionsParameters>) => {
  try {
    const subscriptionCollection = paddle.subscriptions.list(params);
    const subscriptions = await subscriptionCollection.next();
    const pagination = paginationData(subscriptionCollection);

    return { pagination, subscriptions };
  } catch (error) {
    return error;
  }
};

export const createReport = async (
  paddle: Paddle,
  params: z.infer<typeof createReportParameters>,
  environment: string,
) => {
  try {
    const report = await paddle.reports.create(params);
    const prefix = environment === "sandbox" ? "sandbox-vendors" : "vendors";
    const message = `The report is being created, check https://${prefix}.paddle.com/reports-v2 to track the status of the report.`;

    return { message, report };
  } catch (error) {
    return error;
  }
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const paginationData = (collection: any) => {
  return {
    hasMore: collection.hasMore,
    estimatedTotal: collection.estimatedTotal,
    nextLink: collection.nextLink,
  };
};

// This is required for time related queries where the time operation is
// represented in square brackets i.e. createdAt[GTE]
// See https://developer.paddle.com/api-reference/transactions/list-transactions for examples
// For whatever reason using the square brackets in the zod schema completely breaks
// agent mode in Cursor.
const transformParams = (params: Record<string, unknown>) => {
  return Object.entries(params).reduce(
    (acc, [key, value]) => {
      if (key.includes("_")) {
        const [base, operator] = key.split("_");
        acc[`${base}[${operator.toUpperCase()}]`] = value;
      } else {
        acc[key] = value;
      }
      return acc;
    },
    {} as Record<string, unknown>,
  );
};
