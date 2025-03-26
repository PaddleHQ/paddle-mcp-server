import { z } from "zod";

export const createProductParameters = z.object({
  name: z.string().describe("The name of the product. Must be unique within your catalog."),
  taxCategory: z
    .enum([
      "digital-goods",
      "ebooks",
      "implementation-services",
      "professional-services",
      "saas",
      "software-programming-services",
      "standard",
      "training-services",
      "website-hosting",
    ])
    .describe("The tax category that best describes your product. Used to automatically calculate tax rates."),
  description: z.string().optional().describe("A description of the product that will be displayed to customers."),
  imageUrl: z
    .string()
    .optional()
    .describe("A URL to an image that will be displayed to customers. Must be publicly accessible."),
  customData: z
    .record(z.any())
    .optional()
    .describe("A JSON object containing custom data. Limited to 50 keys, with key names up to 40 characters long."),
});

export const listProductsParameters = z.object({
  after: z
    .string()
    .optional()
    .describe("Cursor for use in pagination. Represents the ID of the last entity in the previous page of results."),
  type: z
    .array(z.enum(["standard", "custom"]))
    .optional()
    .describe("Filter products by their type. Accepts multiple values."),
  id: z.array(z.string()).optional().describe("Filter products by their ID. Accepts multiple values."),
  include: z
    .array(z.enum(["prices"]))
    .optional()
    .describe("Related data to include in the response."),
  orderBy: z
    .enum([
      "created_at[ASC]",
      "created_at[DESC]",
      "custom_data[ASC]",
      "custom_data[DESC]",
      "description[ASC]",
      "description[DESC]",
      "id[ASC]",
      "id[DESC]",
      "image_url[ASC]",
      "image_url[DESC]",
      "name[ASC]",
      "name[DESC]",
      "status[ASC]",
      "status[DESC]",
      "tax_category[ASC]",
      "tax_category[DESC]",
      "updated_at[ASC]",
      "updated_at[DESC]",
    ])
    .optional()
    .describe("Sort order for returned items."),
  perPage: z.number().optional().describe("Number of items to be returned per page (default: 25, maximum: 50)."),
  status: z
    .array(z.enum(["active", "archived"]))
    .optional()
    .describe("Filter products by their status. Accepts multiple values."),
  taxCategory: z
    .array(
      z.enum([
        "digital-goods",
        "ebooks",
        "implementation-services",
        "professional-services",
        "saas",
        "software-programming-services",
        "standard",
        "training-services",
        "website-hosting",
      ]),
    )
    .optional()
    .describe("Filter products by their tax category. Accepts multiple values."),
});

export const createPriceParameters = z.object({
  productId: z.string().describe("The ID of the product this price is for"),
  description: z.string().describe("A description of this price that will be displayed to customers"),
  unitPrice: z
    .object({
      amount: z
        .string()
        .describe(
          "The price amount in the smallest currency unit (e.g., cents). Must be a positive integer represented as a string",
        ),
      currencyCode: z.string().describe("The three-letter ISO 4217 currency code (e.g., USD, EUR, GBP)"),
    })
    .describe("The base price details"),
  name: z.string().optional().describe("The name of the price"),
  billingCycle: z
    .object({
      interval: z
        .enum(["day", "week", "month", "year"])
        .describe("The billing period unit (day, week, month, or year)"),
      frequency: z.number().describe("How many intervals make up one billing cycle (e.g., 2 weeks, 3 months)"),
    })
    .optional()
    .describe("For subscription prices, defines the recurring billing period"),
  trialPeriod: z
    .object({
      interval: z.enum(["day", "week", "month", "year"]).describe("The trial period unit (day, week, month, or year)"),
      frequency: z.number().describe("How many intervals make up the trial period (e.g., 14 days, 1 month)"),
    })
    .optional()
    .describe("For subscription prices with a trial, defines the trial period duration"),
  customData: z
    .record(z.any())
    .optional()
    .describe("A JSON object of custom metadata. Limited to 50 keys, with key names up to 40 characters"),
  quantity: z
    .object({
      minimum: z
        .number()
        .optional()
        .describe("The minimum quantity that can be purchased. Must be at least 1 if specified"),
      maximum: z
        .number()
        .optional()
        .describe("The maximum quantity that can be purchased. Must be greater than minimum if specified"),
    })
    .optional()
    .describe("Quantity limits for this price"),
  unitPriceOverrides: z
    .array(
      z.object({
        countryCodes: z
          .array(z.string())
          .describe("List of two-letter ISO 3166-1 alpha-2 country codes where this override applies"),
        unitPrice: z
          .object({
            amount: z
              .string()
              .describe(
                "The override price amount in the smallest currency unit. Must be a positive integer represented as a string",
              ),
            currencyCode: z.string().describe("The three-letter ISO 4217 currency code (e.g., USD, EUR, GBP)"),
          })
          .describe("The override price details"),
      }),
    )
    .optional()
    .describe("Country-specific price overrides. Used for regional pricing"),
});

export const listPricesParameters = z.object({
  after: z.string().optional().describe("Cursor for pagination. Returns results after the cursor position."),
  id: z
    .array(z.string())
    .optional()
    .describe("Filter by a list of price IDs. Use this to retrieve multiple prices by ID."),
  include: z
    .array(z.enum(["product"]))
    .optional()
    .describe("Related entities to include in the response."),
  orderBy: z
    .enum([
      "billing_cycle.frequency[ASC]",
      "billing_cycle.frequency[DESC]",
      "billing_cycle.interval[ASC]",
      "billing_cycle.interval[DESC]",
      "id[ASC]",
      "id[DESC]",
      "product_id[ASC]",
      "product_id[DESC]",
      "quantity.maximum[ASC]",
      "quantity.maximum[DESC]",
      "quantity.minimum[ASC]",
      "quantity.minimum[DESC]",
      "status[ASC]",
      "status[DESC]",
      "tax_mode[ASC]",
      "tax_mode[DESC]",
      "unit_price.amount[ASC]",
      "unit_price.amount[DESC]",
      "unit_price.currency_code[ASC]",
      "unit_price.currency_code[DESC]",
    ])
    .optional()
    .describe("Sort field and order."),
  perPage: z.number().optional().describe("Number of records to return per page. Default is 25, maximum is 50."),
  productId: z
    .array(z.string())
    .optional()
    .describe("Filter by a list of product IDs. Returns prices for the specified products."),
  status: z
    .array(z.enum(["active", "archived"]))
    .optional()
    .describe("Filter by price status. Returns prices with the specified statuses."),
});

export const listCustomersParameters = z.object({
  after: z
    .string()
    .optional()
    .describe("Return entities after the specified Paddle ID when working with paginated endpoints."),
  email: z.array(z.string()).optional().describe("Return entities that exactly match the specified email address."),
  id: z.array(z.string()).optional().describe("Return only the IDs specified."),
  orderBy: z
    .enum(["id[ASC]", "id[DESC]"])
    .optional()
    .describe("Order returned entities by the specified field and direction."),
  perPage: z.number().optional().describe("Set how many entities are returned per page. Default: 50; Maximum: 200."),
  search: z
    .string()
    .optional()
    .describe("Return entities that match a search query. Searches id, name, and email fields."),
  status: z
    .array(z.enum(["active", "archived"]))
    .optional()
    .describe("Return entities that match the specified status."),
});

export const listTransactionsParameters = z.object({
  after: z
    .string()
    .optional()
    .describe("Return entities after the specified Paddle ID when working with paginated endpoints."),
  billedAt: z
    .string()
    .optional()
    .describe("Return entities billed at a specific time. Pass an RFC 3339 datetime string."),
  "billedAt[LT]": z
    .string()
    .optional()
    .describe("Return entities billed before a specific time. Pass an RFC 3339 datetime string."),
  "billedAt[LTE]": z
    .string()
    .optional()
    .describe("Return entities billed at or before a specific time. Pass an RFC 3339 datetime string."),
  "billedAt[GT]": z
    .string()
    .optional()
    .describe("Return entities billed after a specific time. Pass an RFC 3339 datetime string."),
  "billedAt[GTE]": z
    .string()
    .optional()
    .describe("Return entities billed at or after a specific time. Pass an RFC 3339 datetime string."),
  collectionMode: z
    .enum(["automatic", "manual"])
    .optional()
    .describe("Return entities that match the specified collection mode."),
  createdAt: z
    .string()
    .optional()
    .describe("Return entities created at a specific time. Pass an RFC 3339 datetime string."),
  "createdAt[LT]": z
    .string()
    .optional()
    .describe("Return entities created before a specific time. Pass an RFC 3339 datetime string."),
  "createdAt[LTE]": z
    .string()
    .optional()
    .describe("Return entities created at or before a specific time. Pass an RFC 3339 datetime string."),
  "createdAt[GT]": z
    .string()
    .optional()
    .describe("Return entities created after a specific time. Pass an RFC 3339 datetime string."),
  "createdAt[GTE]": z
    .string()
    .optional()
    .describe("Return entities created at or after a specific time. Pass an RFC 3339 datetime string."),
  customerId: z.array(z.string()).optional().describe("Return entities related to the specified customer."),
  id: z.array(z.string()).optional().describe("Return only the IDs specified."),
  include: z
    .array(z.enum(["address", "adjustment", "adjustments_totals", "business", "customer", "discount"]))
    .optional()
    .describe("Include related entities in the response."),
  invoiceNumber: z.array(z.string()).optional().describe("Return entities that match the invoice number."),
  origin: z
    .array(
      z.enum([
        "api",
        "subscription_charge",
        "subscription_payment_method_change",
        "subscription_recurring",
        "subscription_update",
        "web",
      ]),
    )
    .optional()
    .describe("Return entities related to the specified origin."),
  orderBy: z
    .enum([
      "billed_at[ASC]",
      "billed_at[DESC]",
      "created_at[ASC]",
      "created_at[DESC]",
      "id[ASC]",
      "id[DESC]",
      "updated_at[ASC]",
      "updated_at[DESC]",
    ])
    .optional()
    .describe("Order returned entities by field and direction."),
  status: z
    .array(z.enum(["draft", "ready", "billed", "paid", "completed", "canceled", "past_due"]))
    .optional()
    .describe("Return entities that match the specified status."),
  subscriptionId: z
    .array(z.string())
    .optional()
    .describe(
      "Return entities related to the specified subscription. Pass null to return entities not related to any subscription.",
    ),
  perPage: z.number().optional().describe("Set how many entities are returned per page."),
  updatedAt: z
    .string()
    .optional()
    .describe("Return entities updated at a specific time. Pass an RFC 3339 datetime string."),
  "updatedAt[LT]": z
    .string()
    .optional()
    .describe("Return entities updated before a specific time. Pass an RFC 3339 datetime string."),
  "updatedAt[LTE]": z
    .string()
    .optional()
    .describe("Return entities updated at or before a specific time. Pass an RFC 3339 datetime string."),
  "updatedAt[GT]": z
    .string()
    .optional()
    .describe("Return entities updated after a specific time. Pass an RFC 3339 datetime string."),
  "updatedAt[GTE]": z
    .string()
    .optional()
    .describe("Return entities updated at or after a specific time. Pass an RFC 3339 datetime string."),
});

export const listSubscriptionsParameters = z.object({
  addressId: z.array(z.string()).optional().describe("Return entities related to the specified address."),
  after: z
    .string()
    .optional()
    .describe("Return entities after the specified Paddle ID when working with paginated endpoints."),
  collectionMode: z
    .enum(["automatic", "manual"])
    .optional()
    .describe("Return entities that match the specified collection mode."),
  customerId: z.array(z.string()).optional().describe("Return entities related to the specified customer."),
  id: z.array(z.string()).optional().describe("Return only the IDs specified."),
  orderBy: z.enum(["id[ASC]", "id[DESC]"]).optional().describe("Order returned entities by field and direction."),
  perPage: z.number().optional().describe("Set how many entities are returned per page. Default: 50; Maximum: 200."),
  priceId: z.array(z.string()).optional().describe("Return entities related to the specified price."),
  scheduledChangeAction: z
    .array(z.enum(["cancel", "pause", "resume"]))
    .optional()
    .describe("Return subscriptions that have a scheduled change."),
  status: z
    .array(z.enum(["active", "canceled", "past_due", "paused", "trialing"]))
    .optional()
    .describe("Return entities that match the specified status."),
});

export const createReportParameters = z.object({
  type: z
    .enum([
      "adjustments",
      "adjustment_line_items",
      "transactions",
      "transaction_line_items",
      "products_prices",
      "discounts",
    ])
    .describe("Type of report to create."),
  filters: z
    .array(
      z.object({
        name: z
          .enum(["collection_mode", "currency_code", "origin", "status", "updated_at"])
          .describe("Field name to filter by."),
        operator: z
          .enum(["lt", "gte"])
          .describe("Operator to use when filtering. Valid when filtering by updated_at, null otherwise."),
        value: z
          .union([z.string(), z.array(z.string())])
          .describe(
            "Value to filter by. Check the allowed values descriptions for the name field to see valid values for a field.",
          ),
      }),
    )
    .optional()
    .describe("Filter criteria for this report."),
});
