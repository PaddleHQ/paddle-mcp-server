import { Environment, LogLevel, Paddle } from "@paddle/paddle-node-sdk";
import * as funcs from "./functions.js";
import { TOOL_METHODS } from "./constants.js";
import { ToolMethod } from "./tools.js";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ToolFunction = (paddle: Paddle, arg: any) => Promise<unknown>;

const toolMap: Record<ToolMethod, ToolFunction> = {
  [TOOL_METHODS.LIST_PRODUCTS]: funcs.listProducts,
  [TOOL_METHODS.CREATE_PRODUCT]: funcs.createProduct,
  [TOOL_METHODS.GET_PRODUCT]: funcs.getProduct,
  [TOOL_METHODS.UPDATE_PRODUCT]: funcs.updateProduct,
  [TOOL_METHODS.LIST_PRICES]: funcs.listPrices,
  [TOOL_METHODS.CREATE_PRICE]: funcs.createPrice,
  [TOOL_METHODS.GET_PRICE]: funcs.getPrice,
  [TOOL_METHODS.UPDATE_PRICE]: funcs.updatePrice,
  [TOOL_METHODS.LIST_TRANSACTIONS]: funcs.listTransactions,
  [TOOL_METHODS.CREATE_TRANSACTION]: funcs.createTransaction,
  [TOOL_METHODS.PREVIEW_PRICES]: funcs.previewPrices,
  [TOOL_METHODS.PREVIEW_TRANSACTION_CREATE]: funcs.previewTransactionCreate,
  [TOOL_METHODS.GET_TRANSACTION]: funcs.getTransaction,
  [TOOL_METHODS.UPDATE_TRANSACTION]: funcs.updateTransaction,
  [TOOL_METHODS.REVISE_TRANSACTION]: funcs.reviseTransaction,
  [TOOL_METHODS.LIST_ADJUSTMENTS]: funcs.listAdjustments,
  [TOOL_METHODS.CREATE_ADJUSTMENT]: funcs.createAdjustment,
  [TOOL_METHODS.GET_ADJUSTMENT_CREDIT_NOTE]: funcs.getAdjustmentCreditNote,
  [TOOL_METHODS.LIST_CREDIT_BALANCES]: funcs.listCreditBalances,
  [TOOL_METHODS.LIST_CUSTOMERS]: funcs.listCustomers,
  [TOOL_METHODS.CREATE_CUSTOMER]: funcs.createCustomer,
  [TOOL_METHODS.GET_CUSTOMER]: funcs.getCustomer,
  [TOOL_METHODS.UPDATE_CUSTOMER]: funcs.updateCustomer,
  [TOOL_METHODS.LIST_ADDRESSES]: funcs.listAddresses,
  [TOOL_METHODS.CREATE_ADDRESS]: funcs.createAddress,
  [TOOL_METHODS.GET_ADDRESS]: funcs.getAddress,
  [TOOL_METHODS.UPDATE_ADDRESS]: funcs.updateAddress,
  [TOOL_METHODS.LIST_BUSINESSES]: funcs.listBusinesses,
  [TOOL_METHODS.CREATE_BUSINESS]: funcs.createBusiness,
  [TOOL_METHODS.GET_BUSINESS]: funcs.getBusiness,
  [TOOL_METHODS.UPDATE_BUSINESS]: funcs.updateBusiness,
  [TOOL_METHODS.LIST_SAVED_PAYMENT_METHODS]: funcs.listSavedPaymentMethods,
  [TOOL_METHODS.GET_SAVED_PAYMENT_METHOD]: funcs.getSavedPaymentMethod,
  [TOOL_METHODS.DELETE_SAVED_PAYMENT_METHOD]: funcs.deleteSavedPaymentMethod,
  [TOOL_METHODS.CREATE_CUSTOMER_PORTAL_SESSION]: funcs.createCustomerPortalSession,
  [TOOL_METHODS.LIST_NOTIFICATION_SETTINGS]: funcs.listNotificationSettings,
  [TOOL_METHODS.CREATE_NOTIFICATION_SETTING]: funcs.createNotificationSetting,
  [TOOL_METHODS.GET_NOTIFICATION_SETTING]: funcs.getNotificationSetting,
  [TOOL_METHODS.UPDATE_NOTIFICATION_SETTING]: funcs.updateNotificationSetting,
  [TOOL_METHODS.DELETE_NOTIFICATION_SETTING]: funcs.deleteNotificationSetting,
  [TOOL_METHODS.LIST_EVENTS]: funcs.listEvents,
  [TOOL_METHODS.LIST_NOTIFICATIONS]: funcs.listNotifications,
  [TOOL_METHODS.GET_NOTIFICATION]: funcs.getNotification,
  [TOOL_METHODS.LIST_NOTIFICATION_LOGS]: funcs.listNotificationLogs,
  [TOOL_METHODS.REPLAY_NOTIFICATION]: funcs.replayNotification,
  [TOOL_METHODS.LIST_SIMULATIONS]: funcs.listSimulations,
  [TOOL_METHODS.CREATE_SIMULATION]: funcs.createSimulation,
  [TOOL_METHODS.GET_SIMULATION]: funcs.getSimulation,
  [TOOL_METHODS.UPDATE_SIMULATION]: funcs.updateSimulation,
  [TOOL_METHODS.LIST_SIMULATION_RUNS]: funcs.listSimulationRuns,
  [TOOL_METHODS.CREATE_SIMULATION_RUN]: funcs.createSimulationRun,
  [TOOL_METHODS.GET_SIMULATION_RUN]: funcs.getSimulationRun,
  [TOOL_METHODS.LIST_SIMULATION_RUN_EVENTS]: funcs.listSimulationRunEvents,
  [TOOL_METHODS.GET_SIMULATION_RUN_EVENT]: funcs.getSimulationRunEvent,
  [TOOL_METHODS.REPLAY_SIMULATION_RUN_EVENT]: funcs.replaySimulationRunEvent,
  [TOOL_METHODS.GET_TRANSACTION_INVOICE]: funcs.getTransactionInvoice,
  [TOOL_METHODS.LIST_DISCOUNTS]: funcs.listDiscounts,
  [TOOL_METHODS.CREATE_DISCOUNT]: funcs.createDiscount,
  [TOOL_METHODS.GET_DISCOUNT]: funcs.getDiscount,
  [TOOL_METHODS.UPDATE_DISCOUNT]: funcs.updateDiscount,
  [TOOL_METHODS.LIST_DISCOUNT_GROUPS]: funcs.listDiscountGroups,
  [TOOL_METHODS.CREATE_DISCOUNT_GROUP]: funcs.createDiscountGroup,
  [TOOL_METHODS.GET_DISCOUNT_GROUP]: funcs.getDiscountGroup,
  [TOOL_METHODS.UPDATE_DISCOUNT_GROUP]: funcs.updateDiscountGroup,
  [TOOL_METHODS.ARCHIVE_DISCOUNT_GROUP]: funcs.archiveDiscountGroup,
  [TOOL_METHODS.GET_SUBSCRIPTION]: funcs.getSubscription,
  [TOOL_METHODS.UPDATE_SUBSCRIPTION]: funcs.updateSubscription,
  [TOOL_METHODS.LIST_SUBSCRIPTIONS]: funcs.listSubscriptions,
  [TOOL_METHODS.CANCEL_SUBSCRIPTION]: funcs.cancelSubscription,
  [TOOL_METHODS.PAUSE_SUBSCRIPTION]: funcs.pauseSubscription,
  [TOOL_METHODS.RESUME_SUBSCRIPTION]: funcs.resumeSubscription,
  [TOOL_METHODS.ACTIVATE_SUBSCRIPTION]: funcs.activateSubscription,
  [TOOL_METHODS.PREVIEW_SUBSCRIPTION_UPDATE]: funcs.previewSubscriptionUpdate,
  [TOOL_METHODS.CREATE_SUBSCRIPTION_CHARGE]: funcs.createSubscriptionCharge,
  [TOOL_METHODS.PREVIEW_SUBSCRIPTION_CHARGE]: funcs.previewSubscriptionCharge,
  [TOOL_METHODS.LIST_REPORTS]: funcs.listReports,
  [TOOL_METHODS.CREATE_REPORT]: funcs.createReport,
  [TOOL_METHODS.GET_REPORT]: funcs.getReport,
  [TOOL_METHODS.GET_REPORT_CSV]: funcs.getReportCsv,
  [TOOL_METHODS.LIST_CLIENT_SIDE_TOKENS]: funcs.listClientSideTokens,
  [TOOL_METHODS.CREATE_CLIENT_SIDE_TOKEN]: funcs.createClientSideToken,
  [TOOL_METHODS.GET_CLIENT_SIDE_TOKEN]: funcs.getClientSideToken,
  [TOOL_METHODS.REVOKE_CLIENT_SIDE_TOKEN]: funcs.revokeClientSideToken,
};

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
  async run(method: ToolMethod, arg: any): Promise<string> {
    const toolFunction = toolMap[method];
    
    if (!toolFunction) {
      throw new Error(`Invalid tool method: ${method}`);
    }

    const result = await toolFunction(this.paddle, arg);
    return JSON.stringify(result);
  }
}

export default PaddleAPI;
