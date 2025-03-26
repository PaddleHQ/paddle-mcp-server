import { Environment, LogLevel, Paddle } from "@paddle/paddle-node-sdk";
import {
  createPrice,
  createProduct,
  createReport,
  listCustomers,
  listPrices,
  listProducts,
  listSubscriptions,
  listTransactions,
} from "./functions.js";

class PaddleAPI {
  paddle: Paddle;
  environment: string;

  constructor(apiKey: string, environment: string) {
    const paddle = new Paddle(apiKey, {
      environment: environment as Environment,
      logLevel: LogLevel.error,
    });
    this.paddle = paddle;
    this.environment = environment;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async run(method: string, arg: any) {
    if (method === "create_product") {
      const output = JSON.stringify(await createProduct(this.paddle, arg));
      return output;
    } else if (method === "list_products") {
      const output = JSON.stringify(await listProducts(this.paddle, arg));
      return output;
    } else if (method === "create_price") {
      const output = JSON.stringify(await createPrice(this.paddle, arg));
      return output;
    } else if (method === "list_prices") {
      const output = JSON.stringify(await listPrices(this.paddle, arg));
      return output;
    } else if (method === "list_customers") {
      const output = JSON.stringify(await listCustomers(this.paddle, arg));
      return output;
    } else if (method === "list_transactions") {
      const output = JSON.stringify(await listTransactions(this.paddle, arg));
      return output;
    } else if (method === "list_subscriptions") {
      const output = JSON.stringify(await listSubscriptions(this.paddle, arg));
      return output;
    } else if (method === "create_report") {
      const output = JSON.stringify(await createReport(this.paddle, arg, this.environment));
      return output;
    } else {
      throw new Error("Invalid method " + method);
    }
  }
}

export default PaddleAPI;
