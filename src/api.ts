import { Environment, LogLevel, Paddle } from "@paddle/paddle-node-sdk";
import * as funcs from "./functions.js";

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
    if (method === "list_products") {
      const output = JSON.stringify(await funcs.listProducts(this.paddle, arg));
      return output;
    } else if (method === "create_product") {
      const output = JSON.stringify(await funcs.createProduct(this.paddle, arg));
      return output;
    } else if (method === "get_product") {
      const output = JSON.stringify(await funcs.getProduct(this.paddle, arg));
      return output;
    } else if (method === "update_product") {
      const output = JSON.stringify(await funcs.updateProduct(this.paddle, arg));
      return output;
    } else if (method === "list_prices") {
      const output = JSON.stringify(await funcs.listPrices(this.paddle, arg));
      return output;
    } else if (method === "create_price") {
      const output = JSON.stringify(await funcs.createPrice(this.paddle, arg));
      return output;
    } else if (method === "get_price") {
      const output = JSON.stringify(await funcs.getPrice(this.paddle, arg));
      return output;
    } else if (method === "update_price") {
      const output = JSON.stringify(await funcs.updatePrice(this.paddle, arg));
      return output;
    } else if (method === "list_transactions") {
      const output = JSON.stringify(await funcs.listTransactions(this.paddle, arg));
      return output;
    } else if (method === "create_transaction") {
      const output = JSON.stringify(await funcs.createTransaction(this.paddle, arg));
      return output;
    } else if (method === "preview_prices") {
      const output = JSON.stringify(await funcs.previewPrices(this.paddle, arg));
      return output;
    } else if (method === "preview_transaction_create") {
      const output = JSON.stringify(await funcs.previewTransactionCreate(this.paddle, arg));
      return output;
    } else if (method === "get_transaction") {
      const output = JSON.stringify(await funcs.getTransaction(this.paddle, arg));
      return output;
    } else if (method === "update_transaction") {
      const output = JSON.stringify(await funcs.updateTransaction(this.paddle, arg));
      return output;
    } else if (method === "revise_transaction") {
      const output = JSON.stringify(await funcs.reviseTransaction(this.paddle, arg));
      return output;
    } else if (method === "list_adjustments") {
      const output = JSON.stringify(await funcs.listAdjustments(this.paddle, arg));
      return output;
    } else if (method === "create_adjustment") {
      const output = JSON.stringify(await funcs.createAdjustment(this.paddle, arg));
      return output;
    } else if (method === "get_adjustment_credit_note") {
      const output = JSON.stringify(await funcs.getAdjustmentCreditNote(this.paddle, arg));
      return output;
    } else if (method === "list_credit_balances") {
      const output = JSON.stringify(await funcs.listCreditBalances(this.paddle, arg));
      return output;
    } else if (method === "list_customers") {
      const output = JSON.stringify(await funcs.listCustomers(this.paddle, arg));
      return output;
    } else if (method === "create_customer") {
      const output = JSON.stringify(await funcs.createCustomer(this.paddle, arg));
      return output;
    } else if (method === "get_customer") {
      const output = JSON.stringify(await funcs.getCustomer(this.paddle, arg));
      return output;
    } else if (method === "update_customer") {
      const output = JSON.stringify(await funcs.updateCustomer(this.paddle, arg));
      return output;
    } else if (method === "list_addresses") {
      const output = JSON.stringify(await funcs.listAddresses(this.paddle, arg));
      return output;
    } else if (method === "create_address") {
      const output = JSON.stringify(await funcs.createAddress(this.paddle, arg));
      return output;
    } else if (method === "get_address") {
      const output = JSON.stringify(await funcs.getAddress(this.paddle, arg));
      return output;
    } else if (method === "update_address") {
      const output = JSON.stringify(await funcs.updateAddress(this.paddle, arg));
      return output;
    } else if (method === "list_businesses") {
      const output = JSON.stringify(await funcs.listBusinesses(this.paddle, arg));
      return output;
    } else if (method === "create_business") {
      const output = JSON.stringify(await funcs.createBusiness(this.paddle, arg));
      return output;
    } else if (method === "get_business") {
      const output = JSON.stringify(await funcs.getBusiness(this.paddle, arg));
      return output;
    } else if (method === "update_business") {
      const output = JSON.stringify(await funcs.updateBusiness(this.paddle, arg));
      return output;
    } else if (method === "list_saved_payment_methods") {
      const output = JSON.stringify(await funcs.listSavedPaymentMethods(this.paddle, arg));
      return output;
    } else if (method === "get_saved_payment_method") {
      const output = JSON.stringify(await funcs.getSavedPaymentMethod(this.paddle, arg));
      return output;
    } else if (method === "delete_saved_payment_method") {
      const output = JSON.stringify(await funcs.deleteSavedPaymentMethod(this.paddle, arg));
      return output;
    } else if (method === "create_customer_portal_session") {
      const output = JSON.stringify(await funcs.createCustomerPortalSession(this.paddle, arg));
      return output;
    } else if (method === "list_notification_settings") {
      const output = JSON.stringify(await funcs.listNotificationSettings(this.paddle, arg));
      return output;
    } else if (method === "create_notification_setting") {
      const output = JSON.stringify(await funcs.createNotificationSetting(this.paddle, arg));
      return output;
    } else if (method === "get_notification_setting") {
      const output = JSON.stringify(await funcs.getNotificationSetting(this.paddle, arg));
      return output;
    } else if (method === "update_notification_setting") {
      const output = JSON.stringify(await funcs.updateNotificationSetting(this.paddle, arg));
      return output;
    } else if (method === "delete_notification_setting") {
      const output = JSON.stringify(await funcs.deleteNotificationSetting(this.paddle, arg));
      return output;
    } else if (method === "list_events") {
      const output = JSON.stringify(await funcs.listEvents(this.paddle, arg));
      return output;
    } else if (method === "list_notifications") {
      const output = JSON.stringify(await funcs.listNotifications(this.paddle, arg));
      return output;
    } else if (method === "get_notification") {
      const output = JSON.stringify(await funcs.getNotification(this.paddle, arg));
      return output;
    } else if (method === "list_notification_logs") {
      const output = JSON.stringify(await funcs.listNotificationLogs(this.paddle, arg));
      return output;
    } else if (method === "replay_notification") {
      const output = JSON.stringify(await funcs.replayNotification(this.paddle, arg));
      return output;
    } else if (method === "list_simulation_types") {
      const output = JSON.stringify(await funcs.listSimulationTypes(this.paddle, arg));
      return output;
    } else if (method === "list_simulations") {
      const output = JSON.stringify(await funcs.listSimulations(this.paddle, arg));
      return output;
    } else if (method === "create_simulation") {
      const output = JSON.stringify(await funcs.createSimulation(this.paddle, arg));
      return output;
    } else if (method === "get_simulation") {
      const output = JSON.stringify(await funcs.getSimulation(this.paddle, arg));
      return output;
    } else if (method === "update_simulation") {
      const output = JSON.stringify(await funcs.updateSimulation(this.paddle, arg));
      return output;
    } else if (method === "list_simulation_runs") {
      const output = JSON.stringify(await funcs.listSimulationRuns(this.paddle, arg));
      return output;
    } else if (method === "create_simulation_run") {
      const output = JSON.stringify(await funcs.createSimulationRun(this.paddle, arg));
      return output;
    } else if (method === "get_simulation_run") {
      const output = JSON.stringify(await funcs.getSimulationRun(this.paddle, arg));
      return output;
    } else if (method === "list_simulation_run_events") {
      const output = JSON.stringify(await funcs.listSimulationRunEvents(this.paddle, arg));
      return output;
    } else if (method === "get_simulation_event") {
      const output = JSON.stringify(await funcs.getSimulationRunEvent(this.paddle, arg));
      return output;
    } else if (method === "replay_simulation_run_event") {
      const output = JSON.stringify(await funcs.replaySimulationRunEvent(this.paddle, arg));
      return output;
    } else if (method === "get_transaction_invoice") {
      const output = JSON.stringify(await funcs.getTransactionInvoice(this.paddle, arg));
      return output;
    } else if (method === "list_discounts") {
      const output = JSON.stringify(await funcs.listDiscounts(this.paddle, arg));
      return output;
    } else if (method === "create_discount") {
      const output = JSON.stringify(await funcs.createDiscount(this.paddle, arg));
      return output;
    } else if (method === "get_discount") {
      const output = JSON.stringify(await funcs.getDiscount(this.paddle, arg));
      return output;
    } else if (method === "update_discount") {
      const output = JSON.stringify(await funcs.updateDiscount(this.paddle, arg));
      return output;
    } else if (method === "list_discount_groups") {
      const output = JSON.stringify(await funcs.listDiscountGroups(this.paddle, arg));
      return output;
    } else if (method === "create_discount_group") {
      const output = JSON.stringify(await funcs.createDiscountGroup(this.paddle, arg));
      return output;
    } else if (method === "get_discount_group") {
      const output = JSON.stringify(await funcs.getDiscountGroup(this.paddle, arg));
      return output;
    } else if (method === "update_discount_group") {
      const output = JSON.stringify(await funcs.updateDiscountGroup(this.paddle, arg));
      return output;
    } else if (method === "archive_discount_group") {
      const output = JSON.stringify(await funcs.archiveDiscountGroup(this.paddle, arg));
      return output;
    } else if (method === "get_subscription") {
      const output = JSON.stringify(await funcs.getSubscription(this.paddle, arg));
      return output;
    } else if (method === "update_subscription") {
      const output = JSON.stringify(await funcs.updateSubscription(this.paddle, arg));
      return output;
    } else if (method === "list_subscriptions") {
      const output = JSON.stringify(await funcs.listSubscriptions(this.paddle, arg));
      return output;
    } else if (method === "cancel_subscription") {
      const output = JSON.stringify(await funcs.cancelSubscription(this.paddle, arg));
      return output;
    } else if (method === "pause_subscription") {
      const output = JSON.stringify(await funcs.pauseSubscription(this.paddle, arg));
      return output;
    } else if (method === "resume_subscription") {
      const output = JSON.stringify(await funcs.resumeSubscription(this.paddle, arg));
      return output;
    } else if (method === "activate_subscription") {
      const output = JSON.stringify(await funcs.activateSubscription(this.paddle, arg));
      return output;
    } else if (method === "update_subscription_payment_method") {
      const output = JSON.stringify(await funcs.getSubscriptionUpdatePaymentMethodTransaction(this.paddle, arg));
      return output;
    } else if (method === "preview_subscription_update") {
      const output = JSON.stringify(await funcs.previewSubscriptionUpdate(this.paddle, arg));
      return output;
    } else if (method === "create_subscription_charge") {
      const output = JSON.stringify(await funcs.createSubscriptionCharge(this.paddle, arg));
      return output;
    } else if (method === "preview_subscription_charge") {
      const output = JSON.stringify(await funcs.previewSubscriptionCharge(this.paddle, arg));
      return output;
    } else if (method === "list_reports") {
      const output = JSON.stringify(await funcs.listReports(this.paddle, arg));
      return output;
    } else if (method === "create_report") {
      const output = JSON.stringify(await funcs.createReport(this.paddle, arg));
      return output;
    } else if (method === "get_report_csv") {
      const output = JSON.stringify(await funcs.getReportCsv(this.paddle, arg));
      return output;
    } else if (method === "get_report") {
      const output = JSON.stringify(await funcs.getReport(this.paddle, arg));
      return output;
    } else if (method === "list_client_side_tokens") {
      const output = JSON.stringify(await funcs.listClientSideTokens(this.paddle, arg));
      return output;
    } else if (method === "create_client_side_token") {
      const output = JSON.stringify(await funcs.createClientSideToken(this.paddle, arg));
      return output;
    } else if (method === "get_client_side_token") {
      const output = JSON.stringify(await funcs.getClientSideToken(this.paddle, arg));
      return output;
    } else if (method === "revoke_client_side_token") {
      const output = JSON.stringify(await funcs.revokeClientSideToken(this.paddle, arg));
      return output;
    } else {
      throw new Error("Invalid method " + method);
    }
  }
}

export default PaddleAPI;
