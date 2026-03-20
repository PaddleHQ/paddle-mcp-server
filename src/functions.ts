import { Paddle } from "@paddle/paddle-node-sdk";
import { z } from "zod";
import * as Parameters from "./parameters.js";

interface PaginatedCollection {
  hasMore: boolean;
  estimatedTotal: number;
}

const paginationData = (collection: PaginatedCollection) => ({
  hasMore: collection.hasMore,
  estimatedTotal: collection.estimatedTotal,
});

// Transform camelCase operator suffixes to bracket notation for the Paddle SDK.
// Example: createdAtGTE -> createdAt[GTE], billedAtLT -> billedAt[LT]
// The SDK handles camelCase-to-snake_case conversion internally,
// but it expects operators in bracket notation: createdAt[GTE], not createdAtGTE.
const transformParams = (params: Record<string, unknown>) => {
  const operatorPattern = /^(.+At)(LTE|LT|GTE|GT)$/;

  return Object.entries(params).reduce(
    (acc, [key, value]) => {
      const match = key.match(operatorPattern);
      if (match) {
        acc[`${match[1]}[${match[2]}]`] = value;
      } else {
        acc[key] = value;
      }
      return acc;
    },
    {} as Record<string, unknown>,
  );
};

export const listProducts = async (paddle: Paddle, params: z.infer<typeof Parameters.listProductsParameters>) => {
  try {
    const collection = paddle.products.list(params);
    const products = await collection.next();
    const pagination = paginationData(collection);
    return { pagination, products };
  } catch (error) {
    return error;
  }
};

export const createProduct = async (paddle: Paddle, params: z.infer<typeof Parameters.createProductParameters>) => {
  try {
    const product = await paddle.products.create(params);
    return product;
  } catch (error) {
    return error;
  }
};

export const getProduct = async (paddle: Paddle, params: z.infer<typeof Parameters.getProductParameters>) => {
  try {
    const { productId, ...queryParams } = params;
    const hasQueryParams = Object.keys(queryParams).length > 0;
    const product = await paddle.products.get(productId, hasQueryParams ? queryParams : undefined);
    return product;
  } catch (error) {
    return error;
  }
};

export const updateProduct = async (paddle: Paddle, params: z.infer<typeof Parameters.updateProductParameters>) => {
  try {
    const { productId, ...updateData } = params;
    const product = await paddle.products.update(productId, updateData);
    return product;
  } catch (error) {
    return error;
  }
};

export const listPrices = async (paddle: Paddle, params: z.infer<typeof Parameters.listPricesParameters>) => {
  try {
    const collection = paddle.prices.list(params);
    const prices = await collection.next();
    const pagination = paginationData(collection);
    return { pagination, prices };
  } catch (error) {
    return error;
  }
};

export const createPrice = async (paddle: Paddle, params: z.infer<typeof Parameters.createPriceParameters>) => {
  try {
    const price = await paddle.prices.create(params);
    return price;
  } catch (error) {
    return error;
  }
};

export const getPrice = async (paddle: Paddle, params: z.infer<typeof Parameters.getPriceParameters>) => {
  try {
    const { priceId, ...queryParams } = params;
    const hasQueryParams = Object.keys(queryParams).length > 0;
    const price = await paddle.prices.get(priceId, hasQueryParams ? queryParams : undefined);
    return price;
  } catch (error) {
    return error;
  }
};

export const updatePrice = async (paddle: Paddle, params: z.infer<typeof Parameters.updatePriceParameters>) => {
  try {
    const { priceId, ...updateData } = params;
    const price = await paddle.prices.update(priceId, updateData);
    return price;
  } catch (error) {
    return error;
  }
};

export const listTransactions = async (
  paddle: Paddle,
  params: z.infer<typeof Parameters.listTransactionsParameters>,
) => {
  try {
    const transformedParams = transformParams(params);
    const collection = paddle.transactions.list(transformedParams);
    const transactions = await collection.next();
    const pagination = paginationData(collection);
    return { pagination, transactions };
  } catch (error) {
    return error;
  }
};

export const createTransaction = async (
  paddle: Paddle,
  params: z.infer<typeof Parameters.createTransactionParameters>,
) => {
  try {
    const transaction = await paddle.transactions.create(params);
    return transaction;
  } catch (error) {
    return error;
  }
};

export const previewPrices = async (paddle: Paddle, params: z.infer<typeof Parameters.previewPricesParameters>) => {
  try {
    const pricingPreview = await paddle.pricingPreview.preview(params);
    return pricingPreview;
  } catch (error) {
    return error;
  }
};

export const previewTransactionCreate = async (
  paddle: Paddle,
  params: z.infer<typeof Parameters.previewTransactionCreateParameters>,
) => {
  try {
    const transaction = await paddle.transactions.preview(params);
    return transaction;
  } catch (error) {
    return error;
  }
};

export const getTransaction = async (paddle: Paddle, params: z.infer<typeof Parameters.getTransactionParameters>) => {
  try {
    const { transactionId, ...queryParams } = params;
    const hasQueryParams = Object.keys(queryParams).length > 0;
    const transaction = await paddle.transactions.get(transactionId, hasQueryParams ? queryParams : undefined);
    return transaction;
  } catch (error) {
    return error;
  }
};

export const updateTransaction = async (
  paddle: Paddle,
  params: z.infer<typeof Parameters.updateTransactionParameters>,
) => {
  try {
    const { transactionId, include, ...updateData } = params;
    const queryParams = include ? { include } : undefined;
    const transaction = await paddle.transactions.update(transactionId, updateData, queryParams);
    return transaction;
  } catch (error) {
    return error;
  }
};

export const reviseTransaction = async (
  paddle: Paddle,
  params: z.infer<typeof Parameters.reviseTransactionParameters>,
) => {
  try {
    const { transactionId, ...updateData } = params;
    const transaction = await paddle.transactions.revise(transactionId, updateData);
    return transaction;
  } catch (error) {
    return error;
  }
};

export const listAdjustments = async (paddle: Paddle, params: z.infer<typeof Parameters.listAdjustmentsParameters>) => {
  try {
    const collection = paddle.adjustments.list(params);
    const adjustments = await collection.next();
    const pagination = paginationData(collection);
    return { pagination, adjustments };
  } catch (error) {
    return error;
  }
};

export const createAdjustment = async (
  paddle: Paddle,
  params: z.infer<typeof Parameters.createAdjustmentParameters>,
) => {
  try {
    const adjustment = await paddle.adjustments.create(params);
    return adjustment;
  } catch (error) {
    return error;
  }
};

export const getAdjustmentCreditNote = async (
  paddle: Paddle,
  params: z.infer<typeof Parameters.getAdjustmentCreditNoteParameters>,
) => {
  try {
    const { adjustmentId, ...queryParams } = params;
    const hasQueryParams = Object.keys(queryParams).length > 0;
    const adjustment = await paddle.adjustments.getCreditNotePDF(
      adjustmentId,
      hasQueryParams ? queryParams : undefined,
    );
    return adjustment;
  } catch (error) {
    return error;
  }
};

export const listCreditBalances = async (
  paddle: Paddle,
  params: z.infer<typeof Parameters.listCreditBalancesParameters>,
) => {
  try {
    const { customerId, ...queryParams } = params;
    const result = await paddle.customers.getCreditBalance(customerId, queryParams);
    return result;
  } catch (error) {
    return error;
  }
};

export const listCustomers = async (paddle: Paddle, params: z.infer<typeof Parameters.listCustomersParameters>) => {
  try {
    const collection = paddle.customers.list(params);
    const customers = await collection.next();
    const pagination = paginationData(collection);
    return { pagination, customers };
  } catch (error) {
    return error;
  }
};

export const createCustomer = async (paddle: Paddle, params: z.infer<typeof Parameters.createCustomerParameters>) => {
  try {
    const customer = await paddle.customers.create(params);
    return customer;
  } catch (error) {
    return error;
  }
};

export const getCustomer = async (paddle: Paddle, params: z.infer<typeof Parameters.getCustomerParameters>) => {
  try {
    const { customerId } = params;
    const customer = await paddle.customers.get(customerId);
    return customer;
  } catch (error) {
    return error;
  }
};

export const updateCustomer = async (paddle: Paddle, params: z.infer<typeof Parameters.updateCustomerParameters>) => {
  try {
    const { customerId, ...updateData } = params;
    const customer = await paddle.customers.update(customerId, updateData);
    return customer;
  } catch (error) {
    return error;
  }
};

export const listAddresses = async (paddle: Paddle, params: z.infer<typeof Parameters.listAddressesParameters>) => {
  try {
    const { customerId, ...queryParams } = params;
    const collection = paddle.addresses.list(customerId, queryParams);
    const addresses = await collection.next();
    const pagination = paginationData(collection);
    return { pagination, addresses };
  } catch (error) {
    return error;
  }
};

export const createAddress = async (paddle: Paddle, params: z.infer<typeof Parameters.createAddressParameters>) => {
  try {
    const { customerId, ...updateData } = params;
    const address = await paddle.addresses.create(customerId, updateData);
    return address;
  } catch (error) {
    return error;
  }
};

export const getAddress = async (paddle: Paddle, params: z.infer<typeof Parameters.getAddressParameters>) => {
  try {
    const { customerId, addressId } = params;
    const address = await paddle.addresses.get(customerId, addressId);
    return address;
  } catch (error) {
    return error;
  }
};

export const updateAddress = async (paddle: Paddle, params: z.infer<typeof Parameters.updateAddressParameters>) => {
  try {
    const { customerId, addressId, ...updateData } = params;
    const address = await paddle.addresses.update(customerId, addressId, updateData);
    return address;
  } catch (error) {
    return error;
  }
};

export const listBusinesses = async (paddle: Paddle, params: z.infer<typeof Parameters.listBusinessesParameters>) => {
  try {
    const { customerId, ...queryParams } = params;
    const collection = paddle.businesses.list(customerId, queryParams);
    const businesses = await collection.next();
    const pagination = paginationData(collection);
    return { pagination, businesses };
  } catch (error) {
    return error;
  }
};

export const createBusiness = async (paddle: Paddle, params: z.infer<typeof Parameters.createBusinessParameters>) => {
  try {
    const { customerId, ...updateData } = params;
    const business = await paddle.businesses.create(customerId, updateData);
    return business;
  } catch (error) {
    return error;
  }
};

export const getBusiness = async (paddle: Paddle, params: z.infer<typeof Parameters.getBusinessParameters>) => {
  try {
    const { customerId, businessId } = params;
    const business = await paddle.businesses.get(customerId, businessId);
    return business;
  } catch (error) {
    return error;
  }
};

export const updateBusiness = async (paddle: Paddle, params: z.infer<typeof Parameters.updateBusinessParameters>) => {
  try {
    const { customerId, businessId, ...updateData } = params;
    const business = await paddle.businesses.update(customerId, businessId, updateData);
    return business;
  } catch (error) {
    return error;
  }
};

export const listSavedPaymentMethods = async (
  paddle: Paddle,
  params: z.infer<typeof Parameters.listSavedPaymentMethodsParameters>,
) => {
  try {
    const { customerId, ...queryParams } = params;
    const collection = paddle.paymentMethods.list(customerId, queryParams);
    const paymentMethods = await collection.next();
    const pagination = paginationData(collection);
    return { pagination, paymentMethods };
  } catch (error) {
    return error;
  }
};

export const getSavedPaymentMethod = async (
  paddle: Paddle,
  params: z.infer<typeof Parameters.getSavedPaymentMethodParameters>,
) => {
  try {
    const { customerId, paymentMethodId } = params;
    const paymentMethod = await paddle.paymentMethods.get(customerId, paymentMethodId);
    return paymentMethod;
  } catch (error) {
    return error;
  }
};

export const deleteSavedPaymentMethod = async (
  paddle: Paddle,
  params: z.infer<typeof Parameters.deleteSavedPaymentMethodParameters>,
) => {
  try {
    const { customerId, paymentMethodId } = params;
    const paymentMethod = await paddle.paymentMethods.delete(customerId, paymentMethodId);
    return paymentMethod;
  } catch (error) {
    return error;
  }
};

export const createCustomerPortalSession = async (
  paddle: Paddle,
  params: z.infer<typeof Parameters.createCustomerPortalSessionParameters>,
) => {
  try {
    const { customerId, subscriptionIds } = params;
    const customerPortalSession = await paddle.customerPortalSessions.create(customerId, subscriptionIds);
    return customerPortalSession;
  } catch (error) {
    return error;
  }
};

export const listNotificationSettings = async (
  paddle: Paddle,
  params: z.infer<typeof Parameters.listNotificationSettingsParameters>,
) => {
  try {
    const result = await paddle.notificationSettings.list(params);
    return result;
  } catch (error) {
    return error;
  }
};

export const createNotificationSetting = async (
  paddle: Paddle,
  params: z.infer<typeof Parameters.createNotificationSettingParameters>,
) => {
  try {
    const notificationSetting = await paddle.notificationSettings.create(params);
    return notificationSetting;
  } catch (error) {
    return error;
  }
};

export const getNotificationSetting = async (
  paddle: Paddle,
  params: z.infer<typeof Parameters.getNotificationSettingParameters>,
) => {
  try {
    const { notificationSettingId } = params;
    const notificationSetting = await paddle.notificationSettings.get(notificationSettingId);
    return notificationSetting;
  } catch (error) {
    return error;
  }
};

export const updateNotificationSetting = async (
  paddle: Paddle,
  params: z.infer<typeof Parameters.updateNotificationSettingParameters>,
) => {
  try {
    const { notificationSettingId, ...updateData } = params;
    const notificationSetting = await paddle.notificationSettings.update(notificationSettingId, updateData);
    return notificationSetting;
  } catch (error) {
    return error;
  }
};

export const deleteNotificationSetting = async (
  paddle: Paddle,
  params: z.infer<typeof Parameters.deleteNotificationSettingParameters>,
) => {
  try {
    const { notificationSettingId } = params;
    const notificationSetting = await paddle.notificationSettings.delete(notificationSettingId);
    return notificationSetting;
  } catch (error) {
    return error;
  }
};

export const listEvents = async (paddle: Paddle, params: z.infer<typeof Parameters.listEventsParameters>) => {
  try {
    const collection = paddle.events.list(params);
    const events = await collection.next();
    const pagination = paginationData(collection);
    return { pagination, events };
  } catch (error) {
    return error;
  }
};

export const listNotifications = async (
  paddle: Paddle,
  params: z.infer<typeof Parameters.listNotificationsParameters>,
) => {
  try {
    const collection = paddle.notifications.list(params);
    const notifications = await collection.next();
    const pagination = paginationData(collection);
    return { pagination, notifications };
  } catch (error) {
    return error;
  }
};

export const getNotification = async (paddle: Paddle, params: z.infer<typeof Parameters.getNotificationParameters>) => {
  try {
    const { notificationId } = params;
    const notification = await paddle.notifications.get(notificationId);
    return notification;
  } catch (error) {
    return error;
  }
};

export const listNotificationLogs = async (
  paddle: Paddle,
  params: z.infer<typeof Parameters.listNotificationLogsParameters>,
) => {
  try {
    const { notificationId, ...queryParams } = params;
    const collection = paddle.notifications.getLogs(notificationId, queryParams);
    const notifications = await collection.next();
    const pagination = paginationData(collection);
    return { pagination, notifications };
  } catch (error) {
    return error;
  }
};

export const replayNotification = async (
  paddle: Paddle,
  params: z.infer<typeof Parameters.replayNotificationParameters>,
) => {
  try {
    const { notificationId } = params;
    const notification = await paddle.notifications.replay(notificationId);
    return notification;
  } catch (error) {
    return error;
  }
};

export const listSimulations = async (paddle: Paddle, params: z.infer<typeof Parameters.listSimulationsParameters>) => {
  try {
    const collection = paddle.simulations.list(params);
    const simulations = await collection.next();
    const pagination = paginationData(collection);
    return { pagination, simulations };
  } catch (error) {
    return error;
  }
};

export const createSimulation = async (
  paddle: Paddle,
  params: z.infer<typeof Parameters.createSimulationParameters>,
) => {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const simulation = await paddle.simulations.create(params as any);
    return simulation;
  } catch (error) {
    return error;
  }
};

export const getSimulation = async (paddle: Paddle, params: z.infer<typeof Parameters.getSimulationParameters>) => {
  try {
    const { simulationId } = params;
    const simulation = await paddle.simulations.get(simulationId);
    return simulation;
  } catch (error) {
    return error;
  }
};

export const updateSimulation = async (
  paddle: Paddle,
  params: z.infer<typeof Parameters.updateSimulationParameters>,
) => {
  try {
    const { simulationId, ...updateData } = params;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const simulation = await paddle.simulations.update(simulationId, updateData as any);
    return simulation;
  } catch (error) {
    return error;
  }
};

export const listSimulationRuns = async (
  paddle: Paddle,
  params: z.infer<typeof Parameters.listSimulationRunsParameters>,
) => {
  try {
    const { simulationId, ...queryParams } = params;
    const collection = paddle.simulationRuns.list(simulationId, queryParams);
    const simulationRuns = await collection.next();
    const pagination = paginationData(collection);
    return { pagination, simulationRuns };
  } catch (error) {
    return error;
  }
};

export const createSimulationRun = async (
  paddle: Paddle,
  params: z.infer<typeof Parameters.createSimulationRunParameters>,
) => {
  try {
    const { simulationId } = params;
    const simulationRun = await paddle.simulationRuns.create(simulationId);
    return simulationRun;
  } catch (error) {
    return error;
  }
};

export const getSimulationRun = async (
  paddle: Paddle,
  params: z.infer<typeof Parameters.getSimulationRunParameters>,
) => {
  try {
    const { simulationId, simulationRunId, ...queryParams } = params;
    const hasQueryParams = Object.keys(queryParams).length > 0;
    const simulationRun = await paddle.simulationRuns.get(
      simulationId,
      simulationRunId,
      hasQueryParams ? queryParams : undefined,
    );
    return simulationRun;
  } catch (error) {
    return error;
  }
};

export const listSimulationRunEvents = async (
  paddle: Paddle,
  params: z.infer<typeof Parameters.listSimulationRunEventsParameters>,
) => {
  try {
    const { simulationId, simulationRunId, ...queryParams } = params;
    const collection = paddle.simulationRunEvents.list(simulationId, simulationRunId, queryParams);
    const simulationRunEvents = await collection.next();
    const pagination = paginationData(collection);
    return { pagination, simulationRunEvents };
  } catch (error) {
    return error;
  }
};

export const getSimulationRunEvent = async (
  paddle: Paddle,
  params: z.infer<typeof Parameters.getSimulationRunEventParameters>,
) => {
  try {
    const { simulationId, simulationRunId, simulationEventId } = params;
    const simulationRunEvent = await paddle.simulationRunEvents.get(simulationId, simulationRunId, simulationEventId);
    return simulationRunEvent;
  } catch (error) {
    return error;
  }
};

export const replaySimulationRunEvent = async (
  paddle: Paddle,
  params: z.infer<typeof Parameters.replaySimulationRunEventParameters>,
) => {
  try {
    const { simulationId, simulationRunId, simulationEventId } = params;
    const simulationRunEvent = await paddle.simulationRunEvents.replay(
      simulationId,
      simulationRunId,
      simulationEventId,
    );
    return simulationRunEvent;
  } catch (error) {
    return error;
  }
};

export const getTransactionInvoice = async (
  paddle: Paddle,
  params: z.infer<typeof Parameters.getTransactionInvoiceParameters>,
) => {
  try {
    const { transactionId, ...queryParams } = params;
    const hasQueryParams = Object.keys(queryParams).length > 0;
    const transaction = await paddle.transactions.getInvoicePDF(
      transactionId,
      hasQueryParams ? queryParams : undefined,
    );
    return transaction;
  } catch (error) {
    return error;
  }
};

export const listDiscounts = async (paddle: Paddle, params: z.infer<typeof Parameters.listDiscountsParameters>) => {
  try {
    const collection = paddle.discounts.list(params);
    const discounts = await collection.next();
    const pagination = paginationData(collection);
    return { pagination, discounts };
  } catch (error) {
    return error;
  }
};

export const createDiscount = async (paddle: Paddle, params: z.infer<typeof Parameters.createDiscountParameters>) => {
  try {
    const discount = await paddle.discounts.create(params);
    return discount;
  } catch (error) {
    return error;
  }
};

export const getDiscount = async (paddle: Paddle, params: z.infer<typeof Parameters.getDiscountParameters>) => {
  try {
    const { discountId, ...queryParams } = params;
    const hasQueryParams = Object.keys(queryParams).length > 0;
    const discount = await paddle.discounts.get(discountId, hasQueryParams ? queryParams : undefined);
    return discount;
  } catch (error) {
    return error;
  }
};

export const updateDiscount = async (paddle: Paddle, params: z.infer<typeof Parameters.updateDiscountParameters>) => {
  try {
    const { discountId, ...updateData } = params;
    const discount = await paddle.discounts.update(discountId, updateData);
    return discount;
  } catch (error) {
    return error;
  }
};

export const getDiscountGroup = async (paddle: Paddle, params: z.infer<typeof Parameters.getDiscountGroupParameters>) => {
  try {
    const { discountGroupId } = params;
    const discountGroup = await paddle.discountGroups.get(discountGroupId);
    return discountGroup;
  } catch (error) {
    return error;
  }
};

export const updateDiscountGroup = async (paddle: Paddle, params: z.infer<typeof Parameters.updateDiscountGroupParameters>) => {
  try {
    const { discountGroupId, ...updateData } = params;
    const discountGroup = await paddle.discountGroups.update(discountGroupId, updateData);
    return discountGroup;
  } catch (error) {
    return error;
  }
};

export const listDiscountGroups = async (paddle: Paddle, params: z.infer<typeof Parameters.listDiscountGroupsParameters>) => {

  try {
    const collection = paddle.discountGroups.list(params);
    const discountGroups = await collection.next();
    const pagination = paginationData(collection);
    return { pagination, discountGroups };
  } catch (error) {
    return error;
  }
};

export const createDiscountGroup = async (paddle: Paddle, params: z.infer<typeof Parameters.createDiscountGroupParameters>) => {
  try {
    const discountGroup = await paddle.discountGroups.create(params);
    return discountGroup;
  } catch (error) {
    return error;
  }
};

export const archiveDiscountGroup = async (paddle: Paddle, params: z.infer<typeof Parameters.archiveDiscountGroupParameters>) => {
  try {
    const { discountGroupId } = params;
    const discountGroup = await paddle.discountGroups.archive(discountGroupId);
    return discountGroup;
  } catch (error) {
    return error;
  }
};

export const getSubscription = async (paddle: Paddle, params: z.infer<typeof Parameters.getSubscriptionParameters>) => {
  try {
    const { subscriptionId, ...queryParams } = params;
    const hasQueryParams = Object.keys(queryParams).length > 0;
    const subscription = await paddle.subscriptions.get(subscriptionId, hasQueryParams ? queryParams : undefined);
    return subscription;
  } catch (error) {
    return error;
  }
};

export const updateSubscription = async (
  paddle: Paddle,
  params: z.infer<typeof Parameters.updateSubscriptionParameters>,
) => {
  try {
    const { subscriptionId, ...updateData } = params;
    const subscription = await paddle.subscriptions.update(subscriptionId, updateData);
    return subscription;
  } catch (error) {
    return error;
  }
};

export const listSubscriptions = async (
  paddle: Paddle,
  params: z.infer<typeof Parameters.listSubscriptionsParameters>,
) => {
  try {
    const collection = paddle.subscriptions.list(params);
    const subscriptions = await collection.next();
    const pagination = paginationData(collection);
    return { pagination, subscriptions };
  } catch (error) {
    return error;
  }
};

export const cancelSubscription = async (
  paddle: Paddle,
  params: z.infer<typeof Parameters.cancelSubscriptionParameters>,
) => {
  try {
    const { subscriptionId, ...updateData } = params;
    const subscription = await paddle.subscriptions.cancel(subscriptionId, updateData);
    return subscription;
  } catch (error) {
    return error;
  }
};

export const pauseSubscription = async (
  paddle: Paddle,
  params: z.infer<typeof Parameters.pauseSubscriptionParameters>,
) => {
  try {
    const { subscriptionId, ...updateData } = params;
    const subscription = await paddle.subscriptions.pause(subscriptionId, updateData);
    return subscription;
  } catch (error) {
    return error;
  }
};

export const resumeSubscription = async (
  paddle: Paddle,
  params: z.infer<typeof Parameters.resumeSubscriptionParameters>,
) => {
  try {
    const { subscriptionId, ...updateData } = params;
    const subscription = await paddle.subscriptions.resume(subscriptionId, updateData);
    return subscription;
  } catch (error) {
    return error;
  }
};

export const activateSubscription = async (
  paddle: Paddle,
  params: z.infer<typeof Parameters.activateSubscriptionParameters>,
) => {
  try {
    const { subscriptionId } = params;
    const subscription = await paddle.subscriptions.activate(subscriptionId);
    return subscription;
  } catch (error) {
    return error;
  }
};

export const previewSubscriptionUpdate = async (
  paddle: Paddle,
  params: z.infer<typeof Parameters.previewSubscriptionUpdateParameters>,
) => {
  try {
    const { subscriptionId, ...updateData } = params;
    const subscription = await paddle.subscriptions.previewUpdate(subscriptionId, updateData);
    return subscription;
  } catch (error) {
    return error;
  }
};

export const createSubscriptionCharge = async (
  paddle: Paddle,
  params: z.infer<typeof Parameters.createSubscriptionChargeParameters>,
) => {
  try {
    const { subscriptionId, ...updateData } = params;
    const subscription = await paddle.subscriptions.createOneTimeCharge(subscriptionId, updateData);
    return subscription;
  } catch (error) {
    return error;
  }
};

export const previewSubscriptionCharge = async (
  paddle: Paddle,
  params: z.infer<typeof Parameters.previewSubscriptionChargeParameters>,
) => {
  try {
    const { subscriptionId, ...updateData } = params;
    const subscription = await paddle.subscriptions.previewOneTimeCharge(subscriptionId, updateData);
    return subscription;
  } catch (error) {
    return error;
  }
};

export const listReports = async (paddle: Paddle, params: z.infer<typeof Parameters.listReportsParameters>) => {
  try {
    const collection = paddle.reports.list(params);
    const reports = await collection.next();
    
    const pagination = paginationData(collection);
    return { pagination, reports };
  } catch (error) {
    return error;
  }
};

export const createReport = async (paddle: Paddle, params: z.infer<typeof Parameters.createReportParameters>) => {
  try {
    const report = await paddle.reports.create(params);
    return report;
  } catch (error) {
    return error;
  }
};

export const getReportCsv = async (paddle: Paddle, params: z.infer<typeof Parameters.getReportCsvParameters>) => {
  try {
    const { reportId } = params;
    const report = await paddle.reports.getReportCsv(reportId);
    return report;
  } catch (error) {
    return error;
  }
};

export const getReport = async (paddle: Paddle, params: z.infer<typeof Parameters.getReportParameters>) => {
  try {
    const { reportId } = params;
    const report = await paddle.reports.get(reportId);
    return report;
  } catch (error) {
    return error;
  }
};

export const createClientSideToken = async (paddle: Paddle, params: z.infer<typeof Parameters.createClientSideTokenParameters>) => {
  try {
    const clientSideToken = await paddle.clientTokens.create(params);
    return clientSideToken;
  } catch (error) {
    return error;
  }
};

export const getClientSideToken = async (paddle: Paddle, params: z.infer<typeof Parameters.getClientSideTokenParameters>) => {
  try {
    const { clientTokenId } = params;
    const clientSideToken = await paddle.clientTokens.get(clientTokenId);
    return clientSideToken;
  } catch (error) {
    return error;
  }
};

export const revokeClientSideToken = async (paddle: Paddle, params: z.infer<typeof Parameters.revokeClientSideTokenParameters>) => {
  try {
    const { clientTokenId } = params;
    const clientSideToken = await paddle.clientTokens.revoke(clientTokenId);
    return clientSideToken;
  } catch (error) {
    return error;
  }
};

export const listClientSideTokens = async (paddle: Paddle, params: z.infer<typeof Parameters.listClientSideTokensParameters>) => {
  try {
    const collection = paddle.clientTokens.list(params);
    const clientSideTokens = await collection.next();
    const pagination = paginationData(collection);
    return { pagination, clientSideTokens };
  } catch (error) {
    return error;
  }
};
