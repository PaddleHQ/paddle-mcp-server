import { z } from "zod";
import * as params from "./parameters.js";
import * as prompts from "./prompts.js";
import { TOOL_METHODS } from "./constants.js";

export type ToolMethod = (typeof TOOL_METHODS)[keyof typeof TOOL_METHODS];

export type Tool = {
  method: ToolMethod;
  name: string;
  description: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  parameters: z.ZodObject<z.ZodRawShape>;
  actions: {
    [key: string]: {
      [action: string]: boolean;
    };
  };
};

const tools: Tool[] = [
  {
    method: "list_products",
    name: "List products",
    description: prompts.listProductsPrompt,
    parameters: params.listProductsParameters,
    actions: {
      products: {
        read: true,
        list: true,
      },
    },
  },
  {
    method: "create_product",
    name: "Create a product",
    description: prompts.createProductPrompt,
    parameters: params.createProductParameters,
    actions: {
      products: {
        write: true,
        create: true,
      },
    },
  },
  {
    method: "get_product",
    name: "Get a product",
    description: prompts.getProductPrompt,
    parameters: params.getProductParameters,
    actions: {
      products: {
        read: true,
        get: true,
      },
    },
  },
  {
    method: "update_product",
    name: "Update a product",
    description: prompts.updateProductPrompt,
    parameters: params.updateProductParameters,
    actions: {
      products: {
        write: true,
        update: true,
      },
    },
  },
  {
    method: "list_prices",
    name: "List prices",
    description: prompts.listPricesPrompt,
    parameters: params.listPricesParameters,
    actions: {
      prices: {
        read: true,
        list: true,
      },
    },
  },
  {
    method: "create_price",
    name: "Create a price",
    description: prompts.createPricePrompt,
    parameters: params.createPriceParameters,
    actions: {
      prices: {
        write: true,
        create: true,
      },
    },
  },
  {
    method: "get_price",
    name: "Get a price",
    description: prompts.getPricePrompt,
    parameters: params.getPriceParameters,
    actions: {
      prices: {
        read: true,
        get: true,
      },
    },
  },
  {
    method: "update_price",
    name: "Update a price",
    description: prompts.updatePricePrompt,
    parameters: params.updatePriceParameters,
    actions: {
      prices: {
        write: true,
        update: true,
      },
    },
  },
  {
    method: "list_discounts",
    name: "List discounts",
    description: prompts.listDiscountsPrompt,
    parameters: params.listDiscountsParameters,
    actions: {
      discounts: {
        read: true,
        list: true,
      },
    },
  },
  {
    method: "create_discount",
    name: "Create a discount",
    description: prompts.createDiscountPrompt,
    parameters: params.createDiscountParameters,
    actions: {
      discounts: {
        write: true,
        create: true,
      },
    },
  },
  {
    method: "get_discount",
    name: "Get a discount",
    description: prompts.getDiscountPrompt,
    parameters: params.getDiscountParameters,
    actions: {
      discounts: {
        read: true,
        get: true,
      },
    },
  },
  {
    method: "update_discount",
    name: "Update a discount",
    description: prompts.updateDiscountPrompt,
    parameters: params.updateDiscountParameters,
    actions: {
      discounts: {
        write: true,
        update: true,
      },
    },
  },

  {
    method: "list_discount_groups",
    name: "List discount groups",
    description: prompts.listDiscountGroupsPrompt,
    parameters: params.listDiscountGroupsParameters,
    actions: {
      discountGroups: {
        read: true,
        list: true,
      },
    },
  },
  {
    method: "create_discount_group",
    name: "Create a discount group",
    description: prompts.createDiscountGroupPrompt,
    parameters: params.createDiscountGroupParameters,
    actions: {
      discountGroups: {
        write: true,
        create: true,
      },
    },
  },
  {
    method: "get_discount_group",
    name: "Get a discount group",
    description: prompts.getDiscountGroupPrompt,
    parameters: params.getDiscountGroupParameters,
    actions: {
      discountGroups: {
        read: true,
        get: true,
      },
    },
  },
  {
    method: "update_discount_group",
    name: "Update a discount group",
    description: prompts.updateDiscountGroupPrompt,
    parameters: params.updateDiscountGroupParameters,
    actions: {
      discountGroups: {
        write: true,
        update: true,
      },
    },
  },
  {
    method: "archive_discount_group",
    name: "Archive a discount group",
    description: prompts.archiveDiscountGroupPrompt,
    parameters: params.archiveDiscountGroupParameters,
    actions: {
      discountGroups: {
        write: true,
        delete: true,
      },
    },
  },

  {
    method: "list_customers",
    name: "List customers",
    description: prompts.listCustomersPrompt,
    parameters: params.listCustomersParameters,
    actions: {
      customers: {
        read: true,
        list: true,
      },
    },
  },
  {
    method: "create_customer",
    name: "Create a customer",
    description: prompts.createCustomerPrompt,
    parameters: params.createCustomerParameters,
    actions: {
      customers: {
        write: true,
        create: true,
      },
    },
  },
  {
    method: "get_customer",
    name: "Get a customer",
    description: prompts.getCustomerPrompt,
    parameters: params.getCustomerParameters,
    actions: {
      customers: {
        read: true,
        get: true,
      },
    },
  },
  {
    method: "update_customer",
    name: "Update a customer",
    description: prompts.updateCustomerPrompt,
    parameters: params.updateCustomerParameters,
    actions: {
      customers: {
        write: true,
        update: true,
      },
    },
  },
  {
    method: "list_addresses",
    name: "List addresses for a customer",
    description: prompts.listAddressesPrompt,
    parameters: params.listAddressesParameters,
    actions: {
      addresses: {
        read: true,
        list: true,
      },
    },
  },
  {
    method: "create_address",
    name: "Create an address for a customer",
    description: prompts.createAddressPrompt,
    parameters: params.createAddressParameters,
    actions: {
      addresses: {
        write: true,
        create: true,
      },
    },
  },
  {
    method: "get_address",
    name: "Get an address for a customer",
    description: prompts.getAddressPrompt,
    parameters: params.getAddressParameters,
    actions: {
      addresses: {
        read: true,
        get: true,
      },
    },
  },
  {
    method: "update_address",
    name: "Update an address for a customer",
    description: prompts.updateAddressPrompt,
    parameters: params.updateAddressParameters,
    actions: {
      addresses: {
        write: true,
        update: true,
      },
    },
  },
  {
    method: "list_businesses",
    name: "List businesses for a customer",
    description: prompts.listBusinessesPrompt,
    parameters: params.listBusinessesParameters,
    actions: {
      businesses: {
        read: true,
        list: true,
      },
    },
  },
  {
    method: "create_business",
    name: "Create a business for a customer",
    description: prompts.createBusinessPrompt,
    parameters: params.createBusinessParameters,
    actions: {
      businesses: {
        write: true,
        create: true,
      },
    },
  },
  {
    method: "get_business",
    name: "Get a business for a customer",
    description: prompts.getBusinessPrompt,
    parameters: params.getBusinessParameters,
    actions: {
      businesses: {
        read: true,
        get: true,
      },
    },
  },
  {
    method: "update_business",
    name: "Update a business for a customer",
    description: prompts.updateBusinessPrompt,
    parameters: params.updateBusinessParameters,
    actions: {
      businesses: {
        write: true,
        update: true,
      },
    },
  },
  {
    method: "list_transactions",
    name: "List transactions",
    description: prompts.listTransactionsPrompt,
    parameters: params.listTransactionsParameters,
    actions: {
      transactions: {
        read: true,
        list: true,
      },
    },
  },
  {
    method: "create_transaction",
    name: "Create a transaction",
    description: prompts.createTransactionPrompt,
    parameters: params.createTransactionParameters,
    actions: {
      transactions: {
        write: true,
        create: true,
      },
    },
  },
  {
    method: "get_transaction",
    name: "Get a transaction",
    description: prompts.getTransactionPrompt,
    parameters: params.getTransactionParameters,
    actions: {
      transactions: {
        read: true,
        get: true,
      },
    },
  },
  {
    method: "update_transaction",
    name: "Update a transaction",
    description: prompts.updateTransactionPrompt,
    parameters: params.updateTransactionParameters,
    actions: {
      transactions: {
        write: true,
        update: true,
      },
    },
  },
  {
    method: "preview_prices",
    name: "Preview prices",
    description: prompts.previewPricesPrompt,
    parameters: params.previewPricesParameters,
    actions: {
      pricingpreview: {
        write: true,
        preview: true,
      },
    },
  },
  {
    method: "preview_transaction_create",
    name: "Preview a transaction",
    description: prompts.previewTransactionCreatePrompt,
    parameters: params.previewTransactionCreateParameters,
    actions: {
      transactions: {
        write: true,
        preview: true,
      },
    },
  },
  {
    method: "revise_transaction",
    name: "Revise customer information on a billed or completed transaction",
    description: prompts.reviseTransactionPrompt,
    parameters: params.reviseTransactionParameters,
    actions: {
      transactions: {
        write: true,
        update: true,
      },
    },
  },
  {
    method: "get_transaction_invoice",
    name: "Get a PDF invoice for a transaction",
    description: prompts.getTransactionInvoicePrompt,
    parameters: params.getTransactionInvoiceParameters,
    actions: {
      transactions: {
        read: true,
        get: true,
      },
    },
  },
  {
    method: "list_adjustments",
    name: "List adjustments",
    description: prompts.listAdjustmentsPrompt,
    parameters: params.listAdjustmentsParameters,
    actions: {
      adjustments: {
        read: true,
        list: true,
      },
    },
  },
  {
    method: "create_adjustment",
    name: "Create an adjustment",
    description: prompts.createAdjustmentPrompt,
    parameters: params.createAdjustmentParameters,
    actions: {
      adjustments: {
        write: true,
        create: true,
      },
    },
  },
  {
    method: "get_adjustment_credit_note",
    name: "Get a PDF credit note for an adjustment",
    description: prompts.getAdjustmentCreditNotePrompt,
    parameters: params.getAdjustmentCreditNoteParameters,
    actions: {
      adjustments: {
        read: true,
        get: true,
      },
    },
  },
  {
    method: "list_credit_balances",
    name: "List credit balances for a customer",
    description: prompts.listCreditBalancesPrompt,
    parameters: params.listCreditBalancesParameters,
    actions: {
      customers: {
        read: true,
        list: true,
      },
    },
  },

  {
    method: "get_subscription",
    name: "Get a subscription",
    description: prompts.getSubscriptionPrompt,
    parameters: params.getSubscriptionParameters,
    actions: {
      subscriptions: {
        read: true,
        get: true,
      },
    },
  },
  {
    method: "update_subscription",
    name: "Update a subscription",
    description: prompts.updateSubscriptionPrompt,
    parameters: params.updateSubscriptionParameters,
    actions: {
      subscriptions: {
        write: true,
        update: true,
      },
    },
  },
  {
    method: "list_subscriptions",
    name: "List subscriptions",
    description: prompts.listSubscriptionsPrompt,
    parameters: params.listSubscriptionsParameters,
    actions: {
      subscriptions: {
        read: true,
        list: true,
      },
    },
  },
  {
    method: "cancel_subscription",
    name: "Cancel a subscription",
    description: prompts.cancelSubscriptionPrompt,
    parameters: params.cancelSubscriptionParameters,
    actions: {
      subscriptions: {
        write: true,
        update: true,
      },
    },
  },
  {
    method: "pause_subscription",
    name: "Pause a subscription",
    description: prompts.pauseSubscriptionPrompt,
    parameters: params.pauseSubscriptionParameters,
    actions: {
      subscriptions: {
        write: true,
        update: true,
      },
    },
  },
  {
    method: "resume_subscription",
    name: "Resume a paused subscription",
    description: prompts.resumeSubscriptionPrompt,
    parameters: params.resumeSubscriptionParameters,
    actions: {
      subscriptions: {
        write: true,
        update: true,
      },
    },
  },
  {
    method: "activate_subscription",
    name: "Activate a trialing subscription",
    description: prompts.activateSubscriptionPrompt,
    parameters: params.activateSubscriptionParameters,
    actions: {
      subscriptions: {
        write: true,
        update: true,
      },
    },
  },
  {
    method: "preview_subscription_update",
    name: "Preview an update to a subscription",
    description: prompts.previewSubscriptionUpdatePrompt,
    parameters: params.previewSubscriptionUpdateParameters,
    actions: {
      subscriptions: {
        write: true,
        preview: true,
      },
    },
  },
  {
    method: "create_subscription_charge",
    name: "Create a one-time charge for a subscription",
    description: prompts.createSubscriptionChargePrompt,
    parameters: params.createSubscriptionChargeParameters,
    actions: {
      subscriptions: {
        write: true,
        create: true,
      },
    },
  },
  {
    method: "preview_subscription_charge",
    name: "Preview a one-time charge for a subscription",
    description: prompts.previewSubscriptionChargePrompt,
    parameters: params.previewSubscriptionChargeParameters,
    actions: {
      subscriptions: {
        write: true,
        preview: true,
      },
    },
  },
  {
    method: "list_saved_payment_methods",
    name: "List payment methods saved for a customer",
    description: prompts.listSavedPaymentMethodsPrompt,
    parameters: params.listSavedPaymentMethodsParameters,
    actions: {
      savedPaymentMethods: {
        read: true,
        list: true,
      },
    },
  },
  {
    method: "get_saved_payment_method",
    name: "Get a payment method saved for a customer",
    description: prompts.getSavedPaymentMethodPrompt,
    parameters: params.getSavedPaymentMethodParameters,
    actions: {
      savedPaymentMethods: {
        read: true,
        get: true,
      },
    },
  },
  {
    method: "delete_saved_payment_method",
    name: "Delete a payment method saved for a customer",
    description: prompts.deleteSavedPaymentMethodPrompt,
    parameters: params.deleteSavedPaymentMethodParameters,
    actions: {
      savedPaymentMethods: {
        write: true,
        delete: true,
      },
    },
  },
  {
    method: "create_customer_portal_session",
    name: "Create a customer portal session",
    description: prompts.createCustomerPortalSessionPrompt,
    parameters: params.createCustomerPortalSessionParameters,
    actions: {
      customerPortalSessions: {
        write: true,
        create: true,
      },
    },
  },
  {
    method: "list_notification_settings",
    name: "List notification settings",
    description: prompts.listNotificationSettingsPrompt,
    parameters: params.listNotificationSettingsParameters,
    actions: {
      notificationSettings: {
        read: true,
        list: true,
      },
    },
  },
  {
    method: "create_notification_setting",
    name: "Create a notification setting",
    description: prompts.createNotificationSettingPrompt,
    parameters: params.createNotificationSettingParameters,
    actions: {
      notificationSettings: {
        write: true,
        create: true,
      },
    },
  },
  {
    method: "get_notification_setting",
    name: "Get a notification setting",
    description: prompts.getNotificationSettingPrompt,
    parameters: params.getNotificationSettingParameters,
    actions: {
      notificationSettings: {
        read: true,
        get: true,
      },
    },
  },
  {
    method: "update_notification_setting",
    name: "Update a notification setting",
    description: prompts.updateNotificationSettingPrompt,
    parameters: params.updateNotificationSettingParameters,
    actions: {
      notificationSettings: {
        write: true,
        update: true,
      },
    },
  },
  {
    method: "delete_notification_setting",
    name: "Delete a notification setting",
    description: prompts.deleteNotificationSettingPrompt,
    parameters: params.deleteNotificationSettingParameters,
    actions: {
      notificationSettings: {
        write: true,
        delete: true,
      },
    },
  },
  {
    method: "list_events",
    name: "List events",
    description: prompts.listEventsPrompt,
    parameters: params.listEventsParameters,
    actions: {
      events: {
        read: true,
        list: true,
      },
    },
  },
  {
    method: "list_notifications",
    name: "List notifications",
    description: prompts.listNotificationsPrompt,
    parameters: params.listNotificationsParameters,
    actions: {
      notifications: {
        read: true,
        list: true,
      },
    },
  },
  {
    method: "get_notification",
    name: "Get a notification",
    description: prompts.getNotificationPrompt,
    parameters: params.getNotificationParameters,
    actions: {
      notifications: {
        read: true,
        get: true,
      },
    },
  },
  {
    method: "list_notification_logs",
    name: "List logs for a notification",
    description: prompts.listNotificationLogsPrompt,
    parameters: params.listNotificationLogsParameters,
    actions: {
      notificationLogs: {
        read: true,
        list: true,
      },
    },
  },
  {
    method: "replay_notification",
    name: "Replay a notification",
    description: prompts.replayNotificationPrompt,
    parameters: params.replayNotificationParameters,
    actions: {
      notifications: {
        write: true,
        create: true,
      },
    },
  },
  {
    method: "list_simulations",
    name: "List simulations",
    description: prompts.listSimulationsPrompt,
    parameters: params.listSimulationsParameters,
    actions: {
      simulations: {
        read: true,
        list: true,
      },
    },
  },
  {
    method: "create_simulation",
    name: "Create a simulation",
    description: prompts.createSimulationPrompt,
    parameters: params.createSimulationParameters,
    actions: {
      simulations: {
        write: true,
        create: true,
      },
    },
  },
  {
    method: "get_simulation",
    name: "Get a simulation",
    description: prompts.getSimulationPrompt,
    parameters: params.getSimulationParameters,
    actions: {
      simulations: {
        read: true,
        get: true,
      },
    },
  },
  {
    method: "update_simulation",
    name: "Update a simulation",
    description: prompts.updateSimulationPrompt,
    parameters: params.updateSimulationParameters,
    actions: {
      simulations: {
        write: true,
        update: true,
      },
    },
  },
  {
    method: "list_simulation_runs",
    name: "List runs for a simulation",
    description: prompts.listSimulationRunsPrompt,
    parameters: params.listSimulationRunsParameters,
    actions: {
      simulationRuns: {
        read: true,
        list: true,
      },
    },
  },
  {
    method: "create_simulation_run",
    name: "Create a run for a simulation",
    description: prompts.createSimulationRunPrompt,
    parameters: params.createSimulationRunParameters,
    actions: {
      simulationRuns: {
        write: true,
        create: true,
      },
    },
  },
  {
    method: "get_simulation_run",
    name: "Get a run for a simulation",
    description: prompts.getSimulationRunPrompt,
    parameters: params.getSimulationRunParameters,
    actions: {
      simulationRuns: {
        read: true,
        get: true,
      },
    },
  },
  {
    method: "list_simulation_run_events",
    name: "List events for a simulation run",
    description: prompts.listSimulationRunEventsPrompt,
    parameters: params.listSimulationRunEventsParameters,
    actions: {
      simulationRunEvents: {
        read: true,
        list: true,
      },
    },
  },
  {
    method: "get_simulation_run_event",
    name: "Get an event for a simulation run",
    description: prompts.getSimulationRunEventPrompt,
    parameters: params.getSimulationRunEventParameters,
    actions: {
      simulationRunEvents: {
        read: true,
        get: true,
      },
    },
  },
  {
    method: "replay_simulation_run_event",
    name: "Replay an event for a simulation run",
    description: prompts.replaySimulationRunEventPrompt,
    parameters: params.replaySimulationRunEventParameters,
    actions: {
      simulationRunEvents: {
        write: true,
        replay: true,
      },
    },
  },
  {
    method: "list_reports",
    name: "List reports",
    description: prompts.listReportsPrompt,
    parameters: params.listReportsParameters,
    actions: {
      reports: {
        read: true,
        list: true,
      },
    },
  },
  {
    method: "create_report",
    name: "Create a report",
    description: prompts.createReportPrompt,
    parameters: params.createReportParameters,
    actions: {
      reports: {
        write: true,
        create: true,
      },
    },
  },
  {
    method: "get_report",
    name: "Get a report",
    description: prompts.getReportPrompt,
    parameters: params.getReportParameters,
    actions: {
      reports: {
        read: true,
        get: true,
      },
    },
  },
  {
    method: "get_report_csv",
    name: "Get a CSV file for a report",
    description: prompts.getReportCsvPrompt,
    parameters: params.getReportCsvParameters,
    actions: {
      reports: {
        read: true,
        get: true,
      },
    },
  },
  {
    method: "list_client_side_tokens",
    name: "List client-side tokens",
    description: prompts.listClientSideTokensPrompt,
    parameters: params.listClientSideTokensParameters,
    actions: {
      clientSideTokens: {
        read: true,
        list: true,
      },
    },
  },
  {
    method: "create_client_side_token",
    name: "Create a client-side token",
    description: prompts.createClientSideTokenPrompt,
    parameters: params.createClientSideTokenParameters,
    actions: {
      clientSideTokens: {
        write: true,
        create: true,
      },
    },
  },
  {
    method: "get_client_side_token",
    name: "Get a client-side token",
    description: prompts.getClientSideTokenPrompt,
    parameters: params.getClientSideTokenParameters,
    actions: {
      clientSideTokens: {
        read: true,
        get: true,
      },
    },
  },
  {
    method: "revoke_client_side_token",
    name: "Revoke a client-side token",
    description: prompts.revokeClientSideTokenPrompt,
    parameters: params.revokeClientSideTokenParameters,
    actions: {
      clientSideTokens: {
        write: true,
        delete: true,
      },
    },
  },
  {
    method: "get_active_subscribers",
    name: "Get active subscribers",
    description: prompts.getActiveSubscribersPrompt,
    parameters: params.getMetricsParameters,
    actions: {
      metrics: {
        read: true,
        get: true,
      },
    },
  },
  {
    method: "get_monthly_recurring_revenue",
    name: "Get monthly recurring revenue",
    description: prompts.getMonthlyRecurringRevenuePrompt,
    parameters: params.getMetricsParameters,
    actions: {
      metrics: {
        read: true,
        get: true,
      },
    },
  },
  {
    method: "get_revenue",
    name: "Get revenue",
    description: prompts.getRevenuePrompt,
    parameters: params.getMetricsParameters,
    actions: {
      metrics: {
        read: true,
        get: true,
      },
    },
  },
  {
    method: "get_refunds",
    name: "Get refunds",
    description: prompts.getRefundsPrompt,
    parameters: params.getMetricsParameters,
    actions: {
      metrics: {
        read: true,
        get: true,
      },
    },
  },
  {
    method: "get_chargebacks",
    name: "Get chargebacks",
    description: prompts.getChargebacksPrompt,
    parameters: params.getMetricsParameters,
    actions: {
      metrics: {
        read: true,
        get: true,
      },
    },
  },
  {
    method: "get_checkout_conversion",
    name: "Get checkout conversion",
    description: prompts.getCheckoutConversionPrompt,
    parameters: params.getMetricsParameters,
    actions: {
      metrics: {
        read: true,
        get: true,
      },
    },
  },
  {
    method: "get_monthly_recurring_revenue_change",
    name: "Get monthly recurring revenue change",
    description: prompts.getMonthlyRecurringRevenueChangePrompt,
    parameters: params.getMetricsParameters,
    actions: {
      metrics: {
        read: true,
        get: true,
      },
    },
  },
];

export default tools;
