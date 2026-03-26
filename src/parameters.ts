import { z } from "zod";

const currencyCodeEnum = z.enum([
  "USD", "EUR", "GBP", "JPY", "AUD", "CAD", "CHF", "HKD", "SGD", "SEK",
  "ARS", "BRL", "CLP", "CNY", "COP", "CZK", "DKK", "HUF", "ILS", "INR", "KRW",
  "MXN", "NOK", "NZD", "PEN", "PLN", "RUB", "THB", "TRY", "TWD", "UAH", "VND", "ZAR"
]);

const countryCodeEnum = z.enum([
  "AD", "AE", "AG", "AI", "AL", "AM", "AO", "AR", "AS", "AT", "AU", "AW", "AX", "AZ",
  "BA", "BB", "BD", "BE", "BF", "BG", "BH", "BI", "BJ", "BL", "BM", "BN", "BO", "BQ",
  "BR", "BS", "BT", "BV", "BW", "BZ", "CA", "CC", "CG", "CH", "CI", "CK", "CL", "CM",
  "CN", "CO", "CR", "CV", "CW", "CX", "CY", "CZ", "DE", "DJ", "DK", "DM", "DO", "DZ",
  "EC", "EE", "EG", "EH", "ER", "ES", "ET", "FI", "FJ", "FK", "FM", "FO", "FR", "GA",
  "GB", "GD", "GE", "GF", "GG", "GH", "GI", "GL", "GM", "GN", "GP", "GQ", "GR", "GS",
  "GT", "GU", "GW", "GY", "HK", "HM", "HN", "HR", "HU", "ID", "IE", "IL", "IM", "IN",
  "IO", "IQ", "IS", "IT", "JE", "JM", "JO", "JP", "KE", "KG", "KH", "KI", "KM", "KN",
  "KR", "KW", "KY", "KZ", "LA", "LB", "LC", "LI", "LK", "LR", "LS", "LT", "LU", "LV",
  "MA", "MC", "MD", "ME", "MF", "MG", "MH", "MK", "MN", "MO", "MP", "MQ", "MR", "MS",
  "MT", "MU", "MV", "MW", "MX", "MY", "MZ", "NA", "NC", "NE", "NF", "NG", "NL", "NO",
  "NP", "NR", "NU", "NZ", "OM", "PA", "PE", "PF", "PG", "PH", "PK", "PL", "PM", "PN",
  "PR", "PS", "PT", "PW", "PY", "QA", "RE", "RO", "RS", "RW", "SA", "SB", "SC", "SE",
  "SG", "SH", "SI", "SJ", "SK", "SL", "SM", "SN", "SR", "ST", "SV", "SX", "SZ", "TC",
  "TD", "TF", "TG", "TH", "TJ", "TK", "TL", "TM", "TN", "TO", "TR", "TT", "TV", "TW",
  "TZ", "UA", "UG", "UM", "US", "UY", "UZ", "VA", "VC", "VG", "VI", "VN", "VU", "WF",
  "WS", "XK", "YT", "ZA", "ZM"
]);

const moneySchema = z.object({
  amount: z.string().describe("Amount in the lowest denomination for the currency, e.g. 10 USD = 1000 (cents). Although represented as a string, this value must be a valid integer."),
  currencyCode: currencyCodeEnum.describe("Supported three-letter ISO 4217 currency code."),
});

const timePeriodSchema = z.object({
  interval: z.enum(["day", "week", "month", "year"]).describe("Unit of time."),
  frequency: z.number().describe("Amount of time. Must be a positive integer."),
});

const priceQuantitySchema = z.object({
  minimum: z.number().describe("Minimum quantity of the product related to this price that can be bought. Required if `maximum` set."),
  maximum: z.number().describe("Maximum quantity of the product related to this price that can be bought. Required if `minimum` set. Must be greater than or equal to the `minimum` value."),
});

const unitPriceOverrideSchema = z.object({
  countryCodes: z.array(countryCodeEnum).describe("List of country codes."),
  unitPrice: moneySchema.describe("Unit price for the country codes."),
});

const nonCatalogProductSchema = z.object({
  name: z.string().describe("Name of this product."),
  taxCategory: z.enum([
    "digital-goods", "ebooks", "implementation-services", "professional-services",
    "saas", "software-programming-services", "standard", "training-services", "website-hosting"
  ]).describe("Tax category for this product. Used for charging the correct rate of tax. Selected tax category must be enabled at account level or an error is returned."),
  description: z.string().optional().describe("Short description for this product."),
  imageUrl: z.string().optional().describe("Image for the product. Included in the checkout and on some customer documents."),
  customData: z.record(z.any(), z.any()).optional().describe("Custom data for the product."),
});

const nonCatalogPriceSchema = z.union([
  z.object({
    description: z.string().describe("Internal description for this price, not shown to customers."),
    name: z.string().optional().describe("Name of this price, shown to customers at checkout and on invoices. Typically describes how often the related product bills."),
    unitPrice: moneySchema.describe("Base unit price for the price."),
    productId: z.string().describe("Paddle ID for the product that this price is for, prefixed with `pro_`."),
    billingCycle: timePeriodSchema.optional().nullable().describe("How often this price should be charged. `null` if price is non-recurring (one-time)."),
    trialPeriod: timePeriodSchema.optional().nullable().describe("Trial period for the product related to this price. The billing cycle begins once the trial period is over. `null` for no trial period. Requires `billingCycle`."),
    taxMode: z.enum(["account_setting", "external", "internal"]).optional().describe("How tax is calculated for this price."),
    unitPriceOverrides: z.array(unitPriceOverrideSchema).optional().describe("Unit price overrides by country. Used to charge different prices for different countries."),
    quantity: priceQuantitySchema.optional().describe("Limits on how many times the related product can be purchased at this price. Useful for discount campaigns. If omitted, defaults to 1-100."),
    customData: z.record(z.any(), z.any()).optional().describe("Any structured custom key-value data needed outside of Paddle's standard fields. Occasionally used by third-parties."),
    product: z.never().optional(),
  }),
  z.object({
    description: z.string().describe("Internal description for this price, not shown to customers."),
    name: z.string().optional().describe("Name of this price, shown to customers at checkout and on invoices. Typically describes how often the related product bills."),
    unitPrice: moneySchema.describe("Base unit price for the price."),
    product: nonCatalogProductSchema.describe("Product object for a non-catalog item to charge for.."),
    billingCycle: timePeriodSchema.optional().nullable().describe("How often this price should be charged. `null` if price is non-recurring (one-time)."),
    trialPeriod: timePeriodSchema.optional().nullable().describe("Trial period for the product related to this price. The billing cycle begins once the trial period is over. `null` for no trial period. Requires `billingCycle`."),
    taxMode: z.enum(["account_setting", "external", "internal"]).optional().describe("How tax is calculated for this price."),
    unitPriceOverrides: z.array(unitPriceOverrideSchema).optional().describe("Unit price overrides by country. Used to charge different prices for different countries."),
    quantity: priceQuantitySchema.optional().describe("Limits on how many times the related product can be purchased at this price. Useful for discount campaigns. If omitted, defaults to 1-100."),
    customData: z.record(z.any(), z.any()).optional().describe("Any structured custom key-value data needed outside of Paddle's standard fields. Occasionally used by third-parties."),
    productId: z.never().optional(),
  }),
]);

export const listProductsParameters = z.object({
  after: z
    .string()
    .optional()
    .describe(
      "Return entities after the specified Paddle ID when working with paginated endpoints.",
    ),
  id: z
    .array(z.string())
    .optional()
    .describe("Return only the IDs specified. Use a comma-separated list to get multiple entities."),
  include: z
    .array(z.enum(["prices"]))
    .optional()
    .describe("Include related entities in the response. Use a comma-separated list to specify multiple entities."),
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
    .describe(
      "Order returned entities by the specified field and direction.",
    ),
  perPage: z
    .number()
    .optional()
    .describe(
      "Set how many entities are returned per page. Returns the maximum number of results if a number greater than the maximum is requested.",
    ),
  status: z
    .array(z.enum(["active", "archived"]))
    .optional()
    .describe(
      "Return entities that match the specified status. Use a comma-separated list to specify multiple status values.",
    ),
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
    .describe(
      "Return entities that match the specified tax category. Use a comma-separated list to specify multiple tax categories.",
    ),
  type: z
    .array(z.enum(["custom", "standard"]))
    .optional()
    .describe("Return items that match the specified type."),
});

export const createProductParameters = z.object({
  name: z.string().describe("Name of this product."),
  description: z.string().optional().describe("Short description for this product."),
  type: z
    .enum(["custom", "standard"])
    .optional()
    .describe(
      "Type of item. Standard items are considered part of the listed catalog and are shown in the Paddle dashboard.",
    ),
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
    .describe(
      "Tax category for this product. Used for charging the correct rate of tax. Selected tax category must be enabled at account level or an error is returned.",
    ),
  imageUrl: z
    .string()
    .optional()
    .describe("Image for this product. Included in the checkout and on some customer documents."),
  customData: z.record(z.any(), z.any()).optional().describe("Any structured custom key-value data needed outside of Paddle's standard fields. Occasionally used by third-parties."),
});

export const getProductParameters = z.object({
  productId: z.string().describe("Paddle ID of the product."),
  include: z
    .array(z.enum(["prices"]))
    .optional()
    .describe("Include related entities in the response. Use a comma-separated list to specify multiple entities."),
});

export const updateProductParameters = z.object({
  productId: z.string().describe("Paddle ID of the product."),
  name: z.string().optional().describe("Name of this product."),
  description: z.string().optional().describe("Short description for this product."),
  type: z
    .enum(["custom", "standard"])
    .optional()
    .describe(
      "Type of item. Standard items are considered part of the listed catalog and are shown in the Paddle dashboard.",
    ),
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
    .optional()
    .describe(
      "Tax category for this product. Used for charging the correct rate of tax. Selected tax category must be enabled at account level or an error is returned.",
    ),
  imageUrl: z
    .string()
    .optional()
    .describe("Image for this product. Included in the checkout and on some customer documents."),
  customData: z.record(z.any(), z.any()).optional().describe("Any structured custom key-value data needed outside of Paddle's standard fields. Occasionally used by third-parties."),
  status: z.enum(["active", "archived"]).optional().describe("Whether this product can be used in Paddle."),
});

export const listPricesParameters = z.object({
  after: z
    .string()
    .optional()
    .describe(
      "Return entities after the specified Paddle ID when working with paginated endpoints.",
    ),
  id: z
    .array(z.string())
    .optional()
    .describe("Return only the IDs specified. Use a comma-separated list to get multiple entities."),
  include: z
    .array(z.enum(["product"]))
    .optional()
    .describe("Include related entities in the response."),
  orderBy: z
    .enum(["billingCycle[ASC]", "billingCycle[DESC]"])
    .optional()
    .describe(
      "Order returned entities by the specified field and direction.",
    ),
  perPage: z
    .number()
    .optional()
    .describe(
      "Set how many entities are returned per page. Returns the maximum number of results if a number greater than the maximum is requested.",
    ),
  productId: z
    .array(z.string())
    .optional()
    .describe(
      "Return entities related to the specified product. Use a comma-separated list to specify multiple product IDs.",
    ),
  status: z
    .array(z.enum(["active", "archived"]))
    .optional()
    .describe(
      "Return entities that match the specified status. Use a comma-separated list to specify multiple status values.",
    ),
  recurring: z
    .boolean()
    .optional()
    .describe("Determine whether returned entities are for recurring prices (`true`) or one-time prices (`false`)."),
  type: z
    .array(z.enum(["custom", "standard"]))
    .optional()
    .describe("Return items that match the specified type."),
});

export const createPriceParameters = z.object({
  description: z
    .string()
    .describe("Internal description for this price, not shown to customers."),
  type: z
    .enum(["custom", "standard"])
    .optional()
    .describe(
      "Type of item. Standard items are considered part of the listed catalog and are shown in the Paddle dashboard.",
    ),
  name: z
    .string()
    .optional()
    .describe(
      "Name of this price, shown to customers at checkout and on invoices. Typically describes how often the related product bills.",
    ),
  productId: z.string().describe("Paddle ID for the product that this price is for, prefixed with `pro_`."),
  billingCycle: z
    .object({
      interval: z.enum(["day", "week", "month", "year"]).describe("Unit of time."),
      frequency: z.number().describe("Amount of time."),
    })
    .optional()
    .describe(
      "How often this price should be charged. `null` if price is non-recurring (one-time). If omitted, defaults to `null`.",
    ),
  trialPeriod: z
    .object({
      interval: z.enum(["day", "week", "month", "year"]).describe("Unit of time."),
      frequency: z.number().describe("Amount of time."),
    })
    .optional()
    .describe(
      "Trial period for the product related to this price. The billing cycle begins once the trial period is over. `null` for no trial period. Requires `billingCycle`. If omitted, defaults to `null`.",
    ),
  taxMode: z
    .enum(["account_setting", "external", "internal"])
    .optional()
    .describe("How tax is calculated for this price."),
  unitPrice: z
    .object({
      amount: z
        .string()
        .describe(
          "Amount in the lowest denomination for the currency, e.g. 10 USD = 1000 (cents). Although represented as a string, this value must be a valid integer.",
        ),
      currencyCode: z
        .enum([
          "USD",
          "EUR",
          "GBP",
          "JPY",
          "AUD",
          "CAD",
          "CHF",
          "CLP",
          "HKD",
          "SGD",
          "SEK",
          "ARS",
          "BRL",
          "CNY",
          "COP",
          "CZK",
          "DKK",
          "HUF",
          "ILS",
          "INR",
          "KRW",
          "MXN",
          "NOK",
          "NZD",
          "PEN",
          "PLN",
          "RUB",
          "THB",
          "TRY",
          "TWD",
          "UAH",
          "VND",
          "ZAR",
        ])
        .describe("Supported three-letter ISO 4217 currency code."),
    })
    .describe(
      "Base price. This price applies to all customers, except for customers located in countries where `unitPriceOverrides` are set.",
    ),
  unitPriceOverrides: z
    .array(
      z.object({
        countryCodes: z
          .array(
            z.enum([
              "AD",
              "AE",
              "AG",
              "AI",
              "AL",
              "AM",
              "AO",
              "AR",
              "AS",
              "AT",
              "AU",
              "AW",
              "AX",
              "AZ",
              "BA",
              "BB",
              "BD",
              "BE",
              "BF",
              "BG",
              "BH",
              "BI",
              "BJ",
              "BL",
              "BM",
              "BN",
              "BO",
              "BQ",
              "BR",
              "BS",
              "BT",
              "BV",
              "BW",
              "BZ",
              "CA",
              "CC",
              "CG",
              "CH",
              "CI",
              "CK",
              "CL",
              "CM",
              "CN",
              "CO",
              "CR",
              "CV",
              "CW",
              "CX",
              "CY",
              "CZ",
              "DE",
              "DJ",
              "DK",
              "DM",
              "DO",
              "DZ",
              "EC",
              "EE",
              "EG",
              "EH",
              "ER",
              "ES",
              "ET",
              "FI",
              "FJ",
              "FK",
              "FM",
              "FO",
              "FR",
              "GA",
              "GB",
              "GD",
              "GE",
              "GF",
              "GG",
              "GH",
              "GI",
              "GL",
              "GM",
              "GN",
              "GP",
              "GQ",
              "GR",
              "GS",
              "GT",
              "GU",
              "GW",
              "GY",
              "HK",
              "HM",
              "HN",
              "HR",
              "HU",
              "ID",
              "IE",
              "IL",
              "IM",
              "IN",
              "IO",
              "IQ",
              "IS",
              "IT",
              "JE",
              "JM",
              "JO",
              "JP",
              "KE",
              "KG",
              "KH",
              "KI",
              "KM",
              "KN",
              "KR",
              "KW",
              "KY",
              "KZ",
              "LA",
              "LB",
              "LC",
              "LI",
              "LK",
              "LR",
              "LS",
              "LT",
              "LU",
              "LV",
              "MA",
              "MC",
              "MD",
              "ME",
              "MF",
              "MG",
              "MH",
              "MK",
              "MN",
              "MO",
              "MP",
              "MQ",
              "MR",
              "MS",
              "MT",
              "MU",
              "MV",
              "MW",
              "MX",
              "MY",
              "MZ",
              "NA",
              "NC",
              "NE",
              "NF",
              "NG",
              "NL",
              "NO",
              "NP",
              "NR",
              "NU",
              "NZ",
              "OM",
              "PA",
              "PE",
              "PF",
              "PG",
              "PH",
              "PK",
              "PL",
              "PM",
              "PN",
              "PR",
              "PS",
              "PT",
              "PW",
              "PY",
              "QA",
              "RE",
              "RO",
              "RS",
              "RW",
              "SA",
              "SB",
              "SC",
              "SE",
              "SG",
              "SH",
              "SI",
              "SJ",
              "SK",
              "SL",
              "SM",
              "SN",
              "SR",
              "ST",
              "SV",
              "SX",
              "SZ",
              "TC",
              "TD",
              "TF",
              "TG",
              "TH",
              "TJ",
              "TK",
              "TL",
              "TM",
              "TN",
              "TO",
              "TR",
              "TT",
              "TV",
              "TW",
              "TZ",
              "UA",
              "UG",
              "UM",
              "US",
              "UY",
              "UZ",
              "VA",
              "VC",
              "VG",
              "VI",
              "VN",
              "VU",
              "WF",
              "WS",
              "XK",
              "YT",
              "ZA",
              "ZM",
            ]),
          )
          .describe(
            "Supported two-letter ISO 3166-1 alpha-2 country code. Customers located in the listed countries are charged the override price.",
          ),
        unitPrice: z
          .object({
            amount: z
              .string()
              .describe(
                "Amount in the lowest denomination for the currency, e.g. 10 USD = 1000 (cents). Although represented as a string, this value must be a valid integer.",
              ),
            currencyCode: z
              .enum([
                "USD",
                "EUR",
                "GBP",
                "JPY",
                "AUD",
                "CAD",
                "CHF",
                "HKD",
                "SGD",
                "SEK",
                "ARS",
                "BRL",
                "CLP",
                "CNY",
                "COP",
                "CZK",
                "DKK",
                "HUF",
                "ILS",
                "INR",
                "KRW",
                "MXN",
                "NOK",
                "NZD",
                "PEN",
                "PLN",
                "RUB",
                "THB",
                "TRY",
                "TWD",
                "UAH",
                "VND",
                "ZAR",
              ])
              .describe("Supported three-letter ISO 4217 currency code."),
          })
          .describe(
            "Override price. This price applies to customers located in the countries for this unit price override.",
          ),
      }),
    )
    .optional()
    .describe(
      "List of unit price overrides. Use to override the base price with a custom price and currency for a country or group of countries.",
    ),
  quantity: z
    .object({
      minimum: z
        .number()
        .describe(
          "Minimum quantity of the product related to this price that can be bought. Required if `maximum` set.",
        ),
      maximum: z
        .number()
        .describe(
          "Maximum quantity of the product related to this price that can be bought. Required if `minimum` set. Must be greater than or equal to the `minimum` value.",
        ),
    })
    .optional()
    .describe(
      "Limits on how many times the related product can be purchased at this price. Useful for discount campaigns. If omitted, defaults to 1-100.",
    ),
  customData: z.record(z.any(), z.any()).optional().describe("Any structured custom key-value data needed outside of Paddle's standard fields. Occasionally used by third-parties."),
});

export const getPriceParameters = z.object({
  priceId: z.string().describe("Paddle ID of the price."),
  include: z
    .array(z.enum(["product"]))
    .optional()
    .describe("Include related entities in the response."),
});

export const updatePriceParameters = z.object({
  priceId: z.string().describe("Paddle ID of the price."),
  description: z
    .string()
    .optional()
    .describe("Internal description for this price, not shown to customers."),
  type: z
    .enum(["custom", "standard"])
    .optional()
    .describe(
      "Type of item. Standard items are considered part of the listed catalog and are shown in the Paddle dashboard.",
    ),
  name: z
    .string()
    .optional()
    .describe(
      "Name of this price, shown to customers at checkout and on invoices. Typically describes how often the related product bills.",
    ),
  billingCycle: z
    .object({
      interval: z.enum(["day", "week", "month", "year"]).describe("Unit of time."),
      frequency: z.number().describe("Amount of time."),
    })
    .optional()
    .describe("How often this price should be charged. `null` if price is non-recurring (one-time)."),
  trialPeriod: z
    .object({
      interval: z.enum(["day", "week", "month", "year"]).describe("Unit of time."),
      frequency: z.number().describe("Amount of time."),
    })
    .optional()
    .describe(
      "Trial period for the product related to this price. The billing cycle begins once the trial period is over. `null` for no trial period. Requires `billingCycle`.",
    ),
  taxMode: z
    .enum(["account_setting", "external", "internal"])
    .optional()
    .describe("How tax is calculated for this price."),
  unitPrice: z
    .object({
      amount: z
        .string()
        .describe(
          "Amount in the lowest denomination for the currency, e.g. 10 USD = 1000 (cents). Although represented as a string, this value must be a valid integer.",
        ),
      currencyCode: z
        .enum([
          "USD",
          "EUR",
          "GBP",
          "JPY",
          "AUD",
          "CAD",
          "CHF",
          "CLP",
          "HKD",
          "SGD",
          "SEK",
          "ARS",
          "BRL",
          "CNY",
          "COP",
          "CZK",
          "DKK",
          "HUF",
          "ILS",
          "INR",
          "KRW",
          "MXN",
          "NOK",
          "NZD",
          "PEN",
          "PLN",
          "RUB",
          "THB",
          "TRY",
          "TWD",
          "UAH",
          "VND",
          "ZAR",
        ])
        .describe("Supported three-letter ISO 4217 currency code."),
    })
    .optional()
    .describe(
      "Base price. This price applies to all customers, except for customers located in countries where `unitPriceOverrides` are set.",
    ),
  unitPriceOverrides: z
    .array(
      z.object({
        countryCodes: z
          .array(
            z.enum([
              "AD",
              "AE",
              "AG",
              "AI",
              "AL",
              "AM",
              "AO",
              "AR",
              "AS",
              "AT",
              "AU",
              "AW",
              "AX",
              "AZ",
              "BA",
              "BB",
              "BD",
              "BE",
              "BF",
              "BG",
              "BH",
              "BI",
              "BJ",
              "BL",
              "BM",
              "BN",
              "BO",
              "BQ",
              "BR",
              "BS",
              "BT",
              "BV",
              "BW",
              "BZ",
              "CA",
              "CC",
              "CG",
              "CH",
              "CI",
              "CK",
              "CL",
              "CM",
              "CN",
              "CO",
              "CR",
              "CV",
              "CW",
              "CX",
              "CY",
              "CZ",
              "DE",
              "DJ",
              "DK",
              "DM",
              "DO",
              "DZ",
              "EC",
              "EE",
              "EG",
              "EH",
              "ER",
              "ES",
              "ET",
              "FI",
              "FJ",
              "FK",
              "FM",
              "FO",
              "FR",
              "GA",
              "GB",
              "GD",
              "GE",
              "GF",
              "GG",
              "GH",
              "GI",
              "GL",
              "GM",
              "GN",
              "GP",
              "GQ",
              "GR",
              "GS",
              "GT",
              "GU",
              "GW",
              "GY",
              "HK",
              "HM",
              "HN",
              "HR",
              "HU",
              "ID",
              "IE",
              "IL",
              "IM",
              "IN",
              "IO",
              "IQ",
              "IS",
              "IT",
              "JE",
              "JM",
              "JO",
              "JP",
              "KE",
              "KG",
              "KH",
              "KI",
              "KM",
              "KN",
              "KR",
              "KW",
              "KY",
              "KZ",
              "LA",
              "LB",
              "LC",
              "LI",
              "LK",
              "LR",
              "LS",
              "LT",
              "LU",
              "LV",
              "MA",
              "MC",
              "MD",
              "ME",
              "MF",
              "MG",
              "MH",
              "MK",
              "MN",
              "MO",
              "MP",
              "MQ",
              "MR",
              "MS",
              "MT",
              "MU",
              "MV",
              "MW",
              "MX",
              "MY",
              "MZ",
              "NA",
              "NC",
              "NE",
              "NF",
              "NG",
              "NL",
              "NO",
              "NP",
              "NR",
              "NU",
              "NZ",
              "OM",
              "PA",
              "PE",
              "PF",
              "PG",
              "PH",
              "PK",
              "PL",
              "PM",
              "PN",
              "PR",
              "PS",
              "PT",
              "PW",
              "PY",
              "QA",
              "RE",
              "RO",
              "RS",
              "RW",
              "SA",
              "SB",
              "SC",
              "SE",
              "SG",
              "SH",
              "SI",
              "SJ",
              "SK",
              "SL",
              "SM",
              "SN",
              "SR",
              "ST",
              "SV",
              "SX",
              "SZ",
              "TC",
              "TD",
              "TF",
              "TG",
              "TH",
              "TJ",
              "TK",
              "TL",
              "TM",
              "TN",
              "TO",
              "TR",
              "TT",
              "TV",
              "TW",
              "TZ",
              "UA",
              "UG",
              "UM",
              "US",
              "UY",
              "UZ",
              "VA",
              "VC",
              "VG",
              "VI",
              "VN",
              "VU",
              "WF",
              "WS",
              "XK",
              "YT",
              "ZA",
              "ZM",
            ]),
          )
          .describe(
            "Supported two-letter ISO 3166-1 alpha-2 country code. Customers located in the listed countries are charged the override price.",
          ),
        unitPrice: z
          .object({
            amount: z
              .string()
              .describe(
                "Amount in the lowest denomination for the currency, e.g. 10 USD = 1000 (cents). Although represented as a string, this value must be a valid integer.",
              ),
            currencyCode: z
              .enum([
                "USD",
                "EUR",
                "GBP",
                "JPY",
                "AUD",
                "CAD",
                "CHF",
                "HKD",
                "SGD",
                "SEK",
                "ARS",
                "BRL",
                "CLP",
                "CNY",
                "COP",
                "CZK",
                "DKK",
                "HUF",
                "ILS",
                "INR",
                "KRW",
                "MXN",
                "NOK",
                "NZD",
                "PEN",
                "PLN",
                "RUB",
                "THB",
                "TRY",
                "TWD",
                "UAH",
                "VND",
                "ZAR",
              ])
              .describe("Supported three-letter ISO 4217 currency code."),
          })
          .describe(
            "Override price. This price applies to customers located in the countries for this unit price override.",
          ),
      }),
    )
    .optional()
    .describe(
      "List of unit price overrides. Use to override the base price with a custom price and currency for a country or group of countries.",
    ),
  quantity: z
    .object({
      minimum: z
        .number()
        .describe(
          "Minimum quantity of the product related to this price that can be bought. Required if `maximum` set.",
        ),
      maximum: z
        .number()
        .describe(
          "Maximum quantity of the product related to this price that can be bought. Required if `minimum` set. Must be greater than or equal to the `minimum` value.",
        ),
    })
    .optional()
    .describe(
      "Limits on how many times the related product can be purchased at this price. Useful for discount campaigns.",
    ),
  status: z.enum(["active", "archived"]).optional().describe("Whether this price can be used in Paddle."),
  customData: z.record(z.any(), z.any()).optional().describe("Any structured custom key-value data needed outside of Paddle's standard fields. Occasionally used by third-parties."),
});

export const listTransactionsParameters = z.object({
  after: z
    .string()
    .optional()
    .describe(
      "Return entities after the specified Paddle ID when working with paginated endpoints.",
    ),
  billedAt: z
    .string()
    .optional()
    .describe("Return entities billed at this exact time. Pass an RFC 3339 datetime string."),
  billedAtLT: z
    .string()
    .optional()
    .describe("Return entities billed before this time. Pass an RFC 3339 datetime string."),
  billedAtLTE: z
    .string()
    .optional()
    .describe("Return entities billed at or before this time. Pass an RFC 3339 datetime string."),
  billedAtGT: z
    .string()
    .optional()
    .describe("Return entities billed after this time. Pass an RFC 3339 datetime string."),
  billedAtGTE: z
    .string()
    .optional()
    .describe("Return entities billed at or after this time. Pass an RFC 3339 datetime string."),
  collectionMode: z
    .enum(["automatic", "manual"])
    .optional()
    .describe("Return entities that match the specified collection mode."),
  createdAt: z
    .string()
    .optional()
    .describe("Return entities created at this exact time. Pass an RFC 3339 datetime string."),
  createdAtLT: z
    .string()
    .optional()
    .describe("Return entities created before this time. Pass an RFC 3339 datetime string."),
  createdAtLTE: z
    .string()
    .optional()
    .describe("Return entities created at or before this time. Pass an RFC 3339 datetime string."),
  createdAtGT: z
    .string()
    .optional()
    .describe("Return entities created after this time. Pass an RFC 3339 datetime string."),
  createdAtGTE: z
    .string()
    .optional()
    .describe("Return entities created at or after this time. Pass an RFC 3339 datetime string."),
  customerId: z
    .array(z.string())
    .optional()
    .describe(
      "Return entities related to the specified customer. Use a comma-separated list to specify multiple customer IDs.",
    ),
  id: z
    .array(z.string())
    .optional()
    .describe("Return only the IDs specified. Use a comma-separated list to get multiple entities."),
  include: z
    .array(
      z.enum([
        "address",
        "adjustments",
        "adjustments_totals",
        "available_payment_methods",
        "business",
        "customer",
        "discount",
      ]),
    )
    .optional()
    .describe("Include related entities in the response. Use a comma-separated list to specify multiple entities."),
  invoiceNumber: z
    .array(z.string())
    .optional()
    .describe(
      "Return entities that match the invoice number. Use a comma-separated list to specify multiple invoice numbers.",
    ),
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
    .describe(
      "Return entities related to the specified origin. Use a comma-separated list to specify multiple origins.",
    ),
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
    .describe(
      "Order returned entities by the specified field and direction.",
    ),
  status: z
    .array(z.enum(["draft", "ready", "billed", "paid", "completed", "canceled", "past_due"]))
    .optional()
    .describe(
      "Return entities that match the specified status. Use a comma-separated list to specify multiple status values.",
    ),
  subscriptionId: z
    .array(z.string())
    .optional()
    .describe(
      "Return entities related to the specified subscription. Use a comma-separated list to specify multiple subscription IDs. Pass `null` to return entities that aren't related to any subscription.",
    ),
  perPage: z.number().optional().describe("Set how many entities are returned per page."),
  updatedAt: z
    .string()
    .optional()
    .describe("Return entities updated at this exact time. Pass an RFC 3339 datetime string."),
  updatedAtLT: z
    .string()
    .optional()
    .describe("Return entities updated before this time. Pass an RFC 3339 datetime string."),
  updatedAtLTE: z
    .string()
    .optional()
    .describe("Return entities updated at or before this time. Pass an RFC 3339 datetime string."),
  updatedAtGT: z
    .string()
    .optional()
    .describe("Return entities updated after this time. Pass an RFC 3339 datetime string."),
  updatedAtGTE: z
    .string()
    .optional()
    .describe("Return entities updated at or after this time. Pass an RFC 3339 datetime string."),
});

export const createTransactionParameters = z.object({
  status: z
    .enum(["billed", "canceled"])
    .optional()
    .describe(
      "Status of this transaction. Either set a transaction to `billed` or `canceled` when creating, or omit to let Paddle set the status. Transactions are created as `ready` if they have an `addressId`, `customerId`, and `items`, otherwise they are created as `draft`. Marking as `billed` when creating is typically used when working with manually-collected transactions as part of an invoicing workflow. Billed transactions cannot be updated, only canceled.",
    ),
  customerId: z
    .string()
    .optional()
    .describe(
      "Paddle ID of the customer that this transaction is for, prefixed with `ctm_`. If omitted, transaction status is `draft`.",
    ),
  addressId: z
    .string()
    .optional()
    .describe(
      "Paddle ID of the address that this transaction is for, prefixed with `add_`. Requires `customerId`. If omitted, transaction status is `draft`.",
    ),
  businessId: z
    .string()
    .optional()
    .describe("Paddle ID of the business that this transaction is for, prefixed with `biz_`. Requires `customerId`. "),
  customData: z.record(z.any(), z.any()).optional().describe("Any structured custom key-value data needed outside of Paddle's standard fields. Occasionally used by third-parties."),
  currencyCode: z
    .enum([
      "USD",
      "EUR",
      "GBP",
      "JPY",
      "AUD",
      "CAD",
      "CHF",
      "HKD",
      "SGD",
      "SEK",
      "ARS",
      "BRL",
      "CLP",
      "CNY",
      "COP",
      "CZK",
      "DKK",
      "HUF",
      "ILS",
      "INR",
      "KRW",
      "MXN",
      "NOK",
      "NZD",
      "PEN",
      "PLN",
      "RUB",
      "THB",
      "TRY",
      "TWD",
      "UAH",
      "VND",
      "ZAR",
    ])
    .optional()
    .describe(
      "Supported three-letter ISO 4217 currency code. Must be `USD`, `EUR`, or `GBP` if `collectionMode` is `manual`.",
    ),
  collectionMode: z
    .enum(["automatic", "manual"])
    .optional()
    .describe(
      "How payment is collected for this transaction. `automatic` for checkout, `manual` for invoices. If omitted, defaults to `automatic`.",
    ),
  discountId: z
    .string()
    .optional()
    .describe("Paddle ID of the discount applied to this transaction, prefixed with `dsc_`."),
  billingDetails: z
    .object({
      enableCheckout: z
        .boolean()
        .optional()
        .describe(
          "Whether the related transaction may be paid using Paddle Checkout. If omitted when creating a transaction, defaults to `false`.",
        ),
      purchaseOrderNumber: z
        .string()
        .optional()
        .describe("Customer purchase order number. Appears on invoice documents."),
      additionalInformation: z
        .string()
        .optional()
        .describe("Notes or other information to include on this invoice. Appears on invoice documents."),
      paymentTerms: z
        .object({
          interval: z.enum(["day", "week", "month", "year"]).describe("Unit of time."),
          frequency: z.number().describe("Amount of time."),
        })
        .describe("How long a customer has to pay this invoice once issued."),
    })
    .optional()
    .describe("Details for invoicing. Required if `collectionMode` is `manual`."),
  billingPeriod: z
    .object({
      startsAt: z.string().describe("RFC 3339 datetime string of when this period starts."),
      endsAt: z.string().describe("RFC 3339 datetime string of when this period ends."),
    })
    .optional()
    .describe(
      "Time period that this transaction is for. Set automatically by Paddle for subscription renewals to describe the period that charges are for.",
    ),
  items: z
    .array(
      z.union([
        z.object({
          priceId: z.string().describe("Paddle ID of an existing catalog price to add to this transaction, prefixed with `pri_`."),
          quantity: z.number().describe("Quantity of the item to charge for."),
          price: z.never().optional(),
        }),
        z.object({
          price: nonCatalogPriceSchema.describe("Non-catalog price object."),
          quantity: z.number().describe("Quantity of the item to charge for."),
          priceId: z.never().optional(),
        }),
      ])
    )
    .describe(
      "List of items to charge for. Charge for items that have been added to the catalog by passing the Paddle ID of an existing price entity, or charge for non-catalog items by passing a price object. Non-catalog items can be for existing products, or pass a product object as part of the price to charge for a non-catalog product.",
    ),
  checkout: z
    .object({
      url: z.string().describe("Checkout URL to use for the payment link for this transaction. Passed URLs must be approved on the account, or omit to the default payment URL on the account."),
    })
    .optional()
    .describe(
      "Paddle Checkout details for this transaction. Used for automatically-collected transactions, or when creating or updating a manually-collected transaction where `billingDetails.enableCheckout` is `true`.",
    ),
  include: z
    .array(
      z.enum([
        "address",
        "adjustments",
        "adjustments_totals",
        "available_payment_methods",
        "business",
        "customer",
        "discount",
      ]),
    )
    .optional()
    .describe("Include related entities in the response. Use a comma-separated list to specify multiple entities."),
});

export const previewPricesParameters = z.object({
  customerId: z
    .string()
    .optional()
    .describe("Paddle ID of the customer that this preview is for, prefixed with `ctm_`."),
  addressId: z
    .string()
    .optional()
    .describe(
      "Paddle ID of the address that this preview is for, prefixed with `add_`. Send one of `addressId`, `customerIpAddress`, or the `address` object when previewing.",
    ),
  businessId: z
    .string()
    .optional()
    .describe("Paddle ID of the business that this preview is for, prefixed with `biz_`."),
  currencyCode: z
    .enum([
      "USD",
      "EUR",
      "GBP",
      "JPY",
      "AUD",
      "CAD",
      "CHF",
      "HKD",
      "SGD",
      "SEK",
      "ARS",
      "BRL",
      "CLP",
      "CNY",
      "COP",
      "CZK",
      "DKK",
      "HUF",
      "ILS",
      "INR",
      "KRW",
      "MXN",
      "NOK",
      "NZD",
      "PEN",
      "PLN",
      "RUB",
      "THB",
      "TRY",
      "TWD",
      "UAH",
      "VND",
      "ZAR",
    ])
    .optional()
    .describe("Supported three-letter ISO 4217 currency code."),
  discountId: z
    .string()
    .optional()
    .describe("Paddle ID of the discount applied to this preview, prefixed with `dsc_`."),
  address: z
    .object({
      postalCode: z
        .string()
        .optional()
        .describe("ZIP or postal code of this address. Include for more accurate tax calculations."),
      countryCode: z
        .enum([
          "AD",
          "AE",
          "AG",
          "AI",
          "AL",
          "AM",
          "AO",
          "AR",
          "AS",
          "AT",
          "AU",
          "AW",
          "AX",
          "AZ",
          "BA",
          "BB",
          "BD",
          "BE",
          "BF",
          "BG",
          "BH",
          "BI",
          "BJ",
          "BL",
          "BM",
          "BN",
          "BO",
          "BQ",
          "BR",
          "BS",
          "BT",
          "BV",
          "BW",
          "BZ",
          "CA",
          "CC",
          "CG",
          "CH",
          "CI",
          "CK",
          "CL",
          "CM",
          "CN",
          "CO",
          "CR",
          "CV",
          "CW",
          "CX",
          "CY",
          "CZ",
          "DE",
          "DJ",
          "DK",
          "DM",
          "DO",
          "DZ",
          "EC",
          "EE",
          "EG",
          "EH",
          "ER",
          "ES",
          "ET",
          "FI",
          "FJ",
          "FK",
          "FM",
          "FO",
          "FR",
          "GA",
          "GB",
          "GD",
          "GE",
          "GF",
          "GG",
          "GH",
          "GI",
          "GL",
          "GM",
          "GN",
          "GP",
          "GQ",
          "GR",
          "GS",
          "GT",
          "GU",
          "GW",
          "GY",
          "HK",
          "HM",
          "HN",
          "HR",
          "HU",
          "ID",
          "IE",
          "IL",
          "IM",
          "IN",
          "IO",
          "IQ",
          "IS",
          "IT",
          "JE",
          "JM",
          "JO",
          "JP",
          "KE",
          "KG",
          "KH",
          "KI",
          "KM",
          "KN",
          "KR",
          "KW",
          "KY",
          "KZ",
          "LA",
          "LB",
          "LC",
          "LI",
          "LK",
          "LR",
          "LS",
          "LT",
          "LU",
          "LV",
          "MA",
          "MC",
          "MD",
          "ME",
          "MF",
          "MG",
          "MH",
          "MK",
          "MN",
          "MO",
          "MP",
          "MQ",
          "MR",
          "MS",
          "MT",
          "MU",
          "MV",
          "MW",
          "MX",
          "MY",
          "MZ",
          "NA",
          "NC",
          "NE",
          "NF",
          "NG",
          "NL",
          "NO",
          "NP",
          "NR",
          "NU",
          "NZ",
          "OM",
          "PA",
          "PE",
          "PF",
          "PG",
          "PH",
          "PK",
          "PL",
          "PM",
          "PN",
          "PR",
          "PS",
          "PT",
          "PW",
          "PY",
          "QA",
          "RE",
          "RO",
          "RS",
          "RW",
          "SA",
          "SB",
          "SC",
          "SE",
          "SG",
          "SH",
          "SI",
          "SJ",
          "SK",
          "SL",
          "SM",
          "SN",
          "SR",
          "ST",
          "SV",
          "SX",
          "SZ",
          "TC",
          "TD",
          "TF",
          "TG",
          "TH",
          "TJ",
          "TK",
          "TL",
          "TM",
          "TN",
          "TO",
          "TR",
          "TT",
          "TV",
          "TW",
          "TZ",
          "UA",
          "UG",
          "UM",
          "US",
          "UY",
          "UZ",
          "VA",
          "VC",
          "VG",
          "VI",
          "VN",
          "VU",
          "WF",
          "WS",
          "XK",
          "YT",
          "ZA",
          "ZM",
        ])
        .describe("Two-letter ISO 3166-1 alpha-2 country code."),
    })
    .optional()
    .describe(
      "Address for this preview. Send one of `addressId`, `customerIpAddress`, or the `address` object when previewing.",
    ),
  customerIpAddress: z
    .string()
    .optional()
    .describe(
      "IP address for this transaction preview. Send one of `addressId`, `customerIpAddress`, or the `address` object when previewing.",
    ),
  items: z
    .array(
      z.object({
        priceId: z.string().describe("Paddle ID for the price to add to this transaction, prefixed with `pri_`."),
        quantity: z.number().describe("Quantity of the item to preview."),
      }),
    )
    .describe("List of items to preview price calculations for."),
});

export const previewTransactionCreateParameters = z.object({
  customerId: z
    .string()
    .optional()
    .describe("Paddle ID of the customer that this transaction preview is for, prefixed with `ctm_`."),
  currencyCode: z
    .enum([
      "USD",
      "EUR",
      "GBP",
      "JPY",
      "AUD",
      "CAD",
      "CHF",
      "HKD",
      "SGD",
      "SEK",
      "ARS",
      "BRL",
      "CLP",
      "CNY",
      "COP",
      "CZK",
      "DKK",
      "HUF",
      "ILS",
      "INR",
      "KRW",
      "MXN",
      "NOK",
      "NZD",
      "PEN",
      "PLN",
      "RUB",
      "THB",
      "TRY",
      "TWD",
      "UAH",
      "VND",
      "ZAR",
    ])
    .optional()
    .describe("Supported three-letter ISO 4217 currency code."),
  discountId: z
    .string()
    .optional()
    .describe("Paddle ID of the discount applied to this transaction preview, prefixed with `dsc_`."),
  ignoreTrials: z
    .boolean()
    .optional()
    .describe(
      "Whether trials should be ignored for transaction preview calculations. By default, recurring items with trials are considered to have a zero charge when previewing. Set to `true` to disable this.",
    ),
  items: z
    .array(
      z.union([
        z.object({
          priceId: z.string().describe("Paddle ID for the price to preview, prefixed with `pri_`."),
          quantity: z.number().describe("Quantity of the item to preview."),
          includeInTotals: z.boolean().optional().describe("Whether to include this item in totals or not. If omitted, defaults to true."),
          price: z.never().optional(),
        }),
        z.object({
          price: nonCatalogPriceSchema.describe("Non-catalog price object."),
          quantity: z.number().describe("Quantity of the item to preview."),
          includeInTotals: z.boolean().optional().describe("Whether to include this item in totals or not. If omitted, defaults to true."),
          priceId: z.never().optional(),
        }),
      ])
    )
    .describe(
      "List of items to preview charging for. Preview charging for items that have been added to the catalog by passing the Paddle ID of an existing price entity, or preview charging for non-catalog items by passing a price object. Non-catalog items can be for existing products, or pass a product object as part of the price to preview charging for a non-catalog product.",
    ),
  address: z
    .object({
      postalCode: z
        .string()
        .optional()
        .describe("ZIP or postal code of this address. Include for more accurate tax calculations."),
      countryCode: z
        .enum([
          "AD",
          "AE",
          "AG",
          "AI",
          "AL",
          "AM",
          "AO",
          "AR",
          "AS",
          "AT",
          "AU",
          "AW",
          "AX",
          "AZ",
          "BA",
          "BB",
          "BD",
          "BE",
          "BF",
          "BG",
          "BH",
          "BI",
          "BJ",
          "BL",
          "BM",
          "BN",
          "BO",
          "BQ",
          "BR",
          "BS",
          "BT",
          "BV",
          "BW",
          "BZ",
          "CA",
          "CC",
          "CG",
          "CH",
          "CI",
          "CK",
          "CL",
          "CM",
          "CN",
          "CO",
          "CR",
          "CV",
          "CW",
          "CX",
          "CY",
          "CZ",
          "DE",
          "DJ",
          "DK",
          "DM",
          "DO",
          "DZ",
          "EC",
          "EE",
          "EG",
          "EH",
          "ER",
          "ES",
          "ET",
          "FI",
          "FJ",
          "FK",
          "FM",
          "FO",
          "FR",
          "GA",
          "GB",
          "GD",
          "GE",
          "GF",
          "GG",
          "GH",
          "GI",
          "GL",
          "GM",
          "GN",
          "GP",
          "GQ",
          "GR",
          "GS",
          "GT",
          "GU",
          "GW",
          "GY",
          "HK",
          "HM",
          "HN",
          "HR",
          "HU",
          "ID",
          "IE",
          "IL",
          "IM",
          "IN",
          "IO",
          "IQ",
          "IS",
          "IT",
          "JE",
          "JM",
          "JO",
          "JP",
          "KE",
          "KG",
          "KH",
          "KI",
          "KM",
          "KN",
          "KR",
          "KW",
          "KY",
          "KZ",
          "LA",
          "LB",
          "LC",
          "LI",
          "LK",
          "LR",
          "LS",
          "LT",
          "LU",
          "LV",
          "MA",
          "MC",
          "MD",
          "ME",
          "MF",
          "MG",
          "MH",
          "MK",
          "MN",
          "MO",
          "MP",
          "MQ",
          "MR",
          "MS",
          "MT",
          "MU",
          "MV",
          "MW",
          "MX",
          "MY",
          "MZ",
          "NA",
          "NC",
          "NE",
          "NF",
          "NG",
          "NL",
          "NO",
          "NP",
          "NR",
          "NU",
          "NZ",
          "OM",
          "PA",
          "PE",
          "PF",
          "PG",
          "PH",
          "PK",
          "PL",
          "PM",
          "PN",
          "PR",
          "PS",
          "PT",
          "PW",
          "PY",
          "QA",
          "RE",
          "RO",
          "RS",
          "RW",
          "SA",
          "SB",
          "SC",
          "SE",
          "SG",
          "SH",
          "SI",
          "SJ",
          "SK",
          "SL",
          "SM",
          "SN",
          "SR",
          "ST",
          "SV",
          "SX",
          "SZ",
          "TC",
          "TD",
          "TF",
          "TG",
          "TH",
          "TJ",
          "TK",
          "TL",
          "TM",
          "TN",
          "TO",
          "TR",
          "TT",
          "TV",
          "TW",
          "TZ",
          "UA",
          "UG",
          "UM",
          "US",
          "UY",
          "UZ",
          "VA",
          "VC",
          "VG",
          "VI",
          "VN",
          "VU",
          "WF",
          "WS",
          "XK",
          "YT",
          "ZA",
          "ZM",
        ])
        .describe("Two-letter ISO 3166-1 alpha-2 country code."),
    })
    .describe("Represents an address entity when previewing addresses."),
  customerIpAddress: z.string().describe("IP address for this transaction preview."),
  addressId: z.string().describe("Paddle ID of the address that this transaction preview is for, prefixed with `add_`."),
  businessId: z
    .string()
    .optional()
    .describe("Paddle ID of the business that this transaction preview is for, prefixed with `biz_`."),
});

export const getTransactionParameters = z.object({
  transactionId: z.string().describe("Paddle ID of the transaction."),
  include: z
    .array(z.enum(["address", "adjustment", "adjustments_totals", "business", "customer", "discount"]))
    .optional()
    .describe("Include related entities in the response. Use a comma-separated list to specify multiple entities."),
});

export const updateTransactionParameters = z.object({
  transactionId: z.string().describe("Paddle ID of the transaction."),
  status: z
    .enum(["billed", "canceled"])
    .optional()
    .describe(
      "Status of this transaction. Set a transaction to `billed` or `canceled`, other statuses are set automatically by Paddle. Automatically-collected transactions may return `completed` if payment is captured successfully, or `past_due` if payment failed.",
    ),
  customerId: z
    .string()
    .optional()
    .describe("Paddle ID of the customer that this transaction is for, prefixed with `ctm_`."),
  addressId: z
    .string()
    .optional()
    .describe("Paddle ID of the address that this transaction is for, prefixed with `add_`."),
  businessId: z
    .string()
    .optional()
    .describe("Paddle ID of the business that this transaction is for, prefixed with `biz_`."),
  customData: z.record(z.any(), z.any()).optional().describe("Any structured custom key-value data needed outside of Paddle's standard fields. Occasionally used by third-parties."),
  currencyCode: z
    .enum([
      "USD",
      "EUR",
      "GBP",
      "JPY",
      "AUD",
      "CAD",
      "CHF",
      "HKD",
      "SGD",
      "SEK",
      "ARS",
      "BRL",
      "CLP",
      "CNY",
      "COP",
      "CZK",
      "DKK",
      "HUF",
      "ILS",
      "INR",
      "KRW",
      "MXN",
      "NOK",
      "NZD",
      "PEN",
      "PLN",
      "RUB",
      "THB",
      "TRY",
      "TWD",
      "UAH",
      "VND",
      "ZAR",
    ])
    .optional()
    .describe(
      "Supported three-letter ISO 4217 currency code. Must be `USD`, `EUR`, or `GBP` if `collectionMode` is `manual`.",
    ),
  collectionMode: z
    .enum(["automatic", "manual"])
    .optional()
    .describe("How payment is collected for this transaction. `automatic` for checkout, `manual` for invoices."),
  discountId: z
    .string()
    .optional()
    .describe("Paddle ID of the discount applied to this transaction, prefixed with `dsc_`."),
  billingDetails: z
    .object({
      enableCheckout: z.boolean().describe("Whether the related transaction may be paid using Paddle Checkout."),
      purchaseOrderNumber: z.string().describe("Customer purchase order number. Appears on invoice documents."),
      additionalInformation: z
        .string()
        .describe("Notes or other information to include on this invoice. Appears on invoice documents."),
      paymentTerms: z
        .object({
          interval: z.enum(["day", "week", "month", "year"]).describe("Unit of time."),
          frequency: z.number().describe("Amount of time."),
        })
        .describe("How long a customer has to pay this invoice once issued."),
    })
    .optional()
    .describe("Details for invoicing. Required if `collectionMode` is `manual`."),
  billingPeriod: z
    .object({
      startsAt: z.string().describe("RFC 3339 datetime string of when this period starts."),
      endsAt: z.string().describe("RFC 3339 datetime string of when this period ends."),
    })
    .optional()
    .describe(
      "Time period that this transaction is for. Set automatically by Paddle for subscription renewals to describe the period that charges are for.",
    ),
  items: z
    .array(
      z.union([
        z.object({
          priceId: z.string().describe("Paddle ID for the price, prefixed with `pri_`."),
          quantity: z.number().describe("Quantity of the item."),
          price: z.never().optional(),
        }),
        z.object({
          price: nonCatalogPriceSchema.describe("Non-catalog price object."),
          quantity: z.number().describe("Quantity of the item."),
          priceId: z.never().optional(),
        }),
      ])
    )
    .optional()
    .describe(
      "List of items on this transaction. When making a request, each object must contain either a `priceId` or a `price` object, and a `quantity`. Include a `priceId` to charge for an existing catalog item, or a `price` object to charge for a non-catalog item.",
    ),
  checkout: z
    .object({
      url: z.string().describe("Checkout URL to use for the payment link for this transaction. Passed URLs must be approved on the account, or omit to use the default payment URL on the account."),
    })
    .optional()
    .describe(
      "Paddle Checkout details for this transaction. Used for automatically-collected transactions, or when creating or updating a manually-collected transaction where `billingDetails.enableCheckout` is `true`.",
    ),
  include: z
    .array(
      z.enum([
        "address",
        "adjustment",
        "adjustments_totals",
        "available_payment_methods",
        "business",
        "customer",
        "discount",
      ]),
    )
    .optional()
    .describe("Include related entities in the response. Use a comma-separated list to specify multiple entities."),
});

export const reviseTransactionParameters = z.object({
  transactionId: z.string().describe("Paddle ID of the transaction."),
  customer: z
    .object({
      name: z.string().optional().describe("Full name."),
    })
    .optional()
    .describe("Revised customer information for this transaction."),
  business: z
    .object({
      name: z.string().optional().describe("Full name."),
      taxIdentifier: z
        .string()
        .optional()
        .describe(
          "Revised tax or VAT number for this transaction. A valid tax or VAT number can't be removed, only replaced with another valid one.",
        ),
    })
    .optional()
    .describe("Revised business information for this transaction."),
  address: z
    .object({
      firstLine: z.string().optional().describe("Revised first line of the address for this transaction."),
      secondLine: z.string().optional().describe("Revised second line of the address for this transaction."),
      city: z.string().optional().describe("Revised city of the address for this transaction."),
      region: z.string().optional().describe("Revised state, county, or region of the address for this transaction."),
    })
    .optional()
    .describe("Revised address information for this transaction."),
});

export const listAdjustmentsParameters = z.object({
  action: z
    .enum([
      "chargeback",
      "chargeback_reverse",
      "chargeback_warning",
      "chargeback_warning_reverse",
      "credit",
      "credit_reverse",
      "refund",
    ])
    .optional()
    .describe("Return entities for the specified action."),
  after: z
    .string()
    .optional()
    .describe(
      "Return entities after the specified Paddle ID when working with paginated endpoints.",
    ),
  customerId: z
    .array(z.string())
    .optional()
    .describe(
      "Return entities related to the specified customer. Use a comma-separated list to specify multiple customer IDs.",
    ),
  orderBy: z
    .enum(["id[ASC]", "id[DESC]"])
    .optional()
    .describe(
      "Order returned entities by the specified field and direction.",
    ),
  perPage: z
    .number()
    .optional()
    .describe(
      "Set how many entities are returned per page. Returns the maximum number of results if a number greater than the maximum is requested.",
    ),
  status: z
    .array(z.enum(["approved", "pending_approval", "rejected", "reversed"]))
    .optional()
    .describe(
      "Return entities that match the specified status. Use a comma-separated list to specify multiple status values.",
    ),
  subscriptionId: z
    .array(z.string())
    .optional()
    .describe(
      "Return entities related to the specified subscription. Use a comma-separated list to specify multiple subscription IDs.",
    ),
  transactionId: z
    .array(z.string())
    .optional()
    .describe(
      "Return entities related to the specified transaction. Use a comma-separated list to specify multiple transaction IDs.",
    ),
  id: z
    .array(z.string())
    .optional()
    .describe("Return only the IDs specified. Use a comma-separated list to get multiple entities."),
});

export const createAdjustmentParameters = z.object({
  action: z
    .enum(["credit", "refund"])
    .describe("How this adjustment impacts the related transaction."),
  type: z
    .enum(["full", "partial"])
    .optional()
    .describe(
      "Type of adjustment. Use `full` to adjust the grand total for the related transaction. Include an `items` array when creating a `partial` adjustment. If omitted, defaults to `partial`.",
    ),
  taxMode: z
    .enum(["external", "internal"])
    .optional()
    .describe(
      "Whether the amounts to be adjusted are inclusive or exclusive of tax. If `internal`, adjusted amounts are considered to be inclusive of tax. If `external`, Paddle calculates the tax and adds it to the amounts provided. Only valid for adjustments where the `type` is `partial`. If omitted, defaults to `internal`.",
    ),
  transactionId: z
    .string()
    .describe(
      "Paddle ID of the transaction that this adjustment is for, prefixed with `txn_`. Automatically-collected transactions must be `completed`, and manually-collected transactions must be `billed` or `past_due`.",
    ),
  reason: z
    .string()
    .describe("Why this adjustment was created. Appears in the Paddle dashboard. Retained for record-keeping purposes."),
  items: z
    .array(
      z.object({
        itemId: z.string().describe("Paddle ID of the transaction line item to adjust, prefixed with `txnitm_`."),
        type: z.enum(["full", "partial", "tax", "proration"]).describe("How the adjustment item impacts the related transaction item."),
        amount: z.string().nullable().describe("Amount adjusted for this transaction item. Required when type is `partial`. null for other types."),
      })
    )
    .describe("List of transaction items to adjust. Required if `type` is not populated or set to `partial`."),
});

export const getAdjustmentCreditNoteParameters = z.object({
  adjustmentId: z.string().describe("Paddle ID of the adjustment."),
  disposition: z
    .enum(["attachment", "inline"])
    .optional()
    .describe(
      "Determine whether the generated URL should download the PDF as an attachment saved locally, or open it inline in the browser.",
    ),
});

export const listCreditBalancesParameters = z.object({
  customerId: z.string().describe("Paddle ID of the customer."),
  currencyCode: z
    .array(
      z.enum([
        "USD",
        "EUR",
        "GBP",
        "JPY",
        "AUD",
        "CAD",
        "CHF",
        "HKD",
        "SGD",
        "SEK",
        "ARS",
        "BRL",
        "CLP",
        "CNY",
        "COP",
        "CZK",
        "DKK",
        "HUF",
        "ILS",
        "INR",
        "KRW",
        "MXN",
        "NOK",
        "NZD",
        "PEN",
        "PLN",
        "RUB",
        "THB",
        "TRY",
        "TWD",
        "UAH",
        "VND",
        "ZAR",
      ]),
    )
    .optional()
    .describe(
      "Return entities that match the currency code. Use a comma-separated list to specify multiple currency codes.",
    ),
});

export const listCustomersParameters = z.object({
  after: z
    .string()
    .optional()
    .describe(
      "Return entities after the specified Paddle ID when working with paginated endpoints.",
    ),
  email: z
    .array(z.string())
    .optional()
    .describe(
      "Return entities that exactly match the specified email address. Use a comma-separated list to specify multiple email addresses. Recommended for precise matching of email addresses.",
    ),
  id: z
    .array(z.string())
    .optional()
    .describe("Return only the IDs specified. Use a comma-separated list to get multiple entities."),
  orderBy: z
    .enum(["id[ASC]", "id[DESC]"])
    .optional()
    .describe(
      "Order returned entities by the specified field and direction.",
    ),
  perPage: z
    .number()
    .optional()
    .describe(
      "Set how many entities are returned per page. Returns the maximum number of results if a number greater than the maximum is requested.",
    ),
  search: z
    .string()
    .optional()
    .describe(
      "Return entities that match a search query. Pass an exact match for the customer's name. Use the `email` query parameter for precise matching of email addresses.",
    ),
  status: z
    .array(z.enum(["active", "archived"]))
    .optional()
    .describe(
      "Return entities that match the specified status. Use a comma-separated list to specify multiple status values.",
    ),
});

export const createCustomerParameters = z.object({
  name: z
    .string()
    .optional()
    .describe(
      "Full name of this customer. Required when creating transactions where `collectionMode` is `manual` (invoices).",
    ),
  email: z.string().describe("Email address for this customer."),
  customData: z.record(z.any(), z.any()).optional().describe("Any structured custom key-value data needed outside of Paddle's standard fields. Occasionally used by third-parties."),
  locale: z.string().optional().describe("Valid IETF BCP 47 short form locale tag. If omitted, defaults to `en`."),
});

export const getCustomerParameters = z.object({
  customerId: z.string().describe("Paddle ID of the customer."),
});

export const updateCustomerParameters = z.object({
  customerId: z.string().describe("Paddle ID of the customer."),
  name: z
    .string()
    .optional()
    .describe(
      "Full name of this customer. Required when creating transactions where `collectionMode` is `manual` (invoices).",
    ),
  email: z.string().optional().describe("Email address for this customer."),
  status: z.enum(["active", "archived"]).optional().describe("Whether this customer can be used in Paddle."),
  customData: z.record(z.any(), z.any()).optional().describe("Any structured custom key-value data needed outside of Paddle's standard fields. Occasionally used by third-parties."),
  locale: z.string().optional().describe("Valid IETF BCP 47 short form locale tag."),
});

export const listAddressesParameters = z.object({
  customerId: z.string().describe("Paddle ID of the customer."),
  after: z
    .string()
    .optional()
    .describe(
      "Return entities after the specified Paddle ID when working with paginated endpoints.",
    ),
  id: z
    .array(z.string())
    .optional()
    .describe("Return only the IDs specified. Use a comma-separated list to get multiple entities."),
  orderBy: z
    .enum(["id[ASC]", "id[DESC]"])
    .optional()
    .describe(
      "Order returned entities by the specified field and direction.",
    ),
  perPage: z
    .number()
    .optional()
    .describe(
      "Set how many entities are returned per page. Returns the maximum number of results if a number greater than the maximum is requested.",
    ),
  search: z
    .string()
    .optional()
    .describe(
      "Return entities that match a search query. Pass an exact match for the street, city, state, postal code, or country.",
    ),
  status: z
    .array(z.enum(["active", "archived"]))
    .optional()
    .describe(
      "Return entities that match the specified status. Use a comma-separated list to specify multiple status values.",
    ),
});

export const createAddressParameters = z.object({
  customerId: z.string().describe("Paddle ID of the customer."),
  description: z.string().optional().describe("Memorable description for this address."),
  firstLine: z.string().optional().describe("First line of this address."),
  secondLine: z.string().optional().describe("Second line of this address."),
  city: z.string().optional().describe("City of this address."),
  postalCode: z.string().optional().describe("ZIP or postal code of this address. Required for some countries."),
  region: z.string().optional().describe("State, county, or region of this address."),
  countryCode: z
    .enum([
      "AD",
      "AE",
      "AG",
      "AI",
      "AL",
      "AM",
      "AO",
      "AR",
      "AS",
      "AT",
      "AU",
      "AW",
      "AX",
      "AZ",
      "BA",
      "BB",
      "BD",
      "BE",
      "BF",
      "BG",
      "BH",
      "BI",
      "BJ",
      "BL",
      "BM",
      "BN",
      "BO",
      "BQ",
      "BR",
      "BS",
      "BT",
      "BV",
      "BW",
      "BZ",
      "CA",
      "CC",
      "CG",
      "CH",
      "CI",
      "CK",
      "CL",
      "CM",
      "CN",
      "CO",
      "CR",
      "CV",
      "CW",
      "CX",
      "CY",
      "CZ",
      "DE",
      "DJ",
      "DK",
      "DM",
      "DO",
      "DZ",
      "EC",
      "EE",
      "EG",
      "EH",
      "ER",
      "ES",
      "ET",
      "FI",
      "FJ",
      "FK",
      "FM",
      "FO",
      "FR",
      "GA",
      "GB",
      "GD",
      "GE",
      "GF",
      "GG",
      "GH",
      "GI",
      "GL",
      "GM",
      "GN",
      "GP",
      "GQ",
      "GR",
      "GS",
      "GT",
      "GU",
      "GW",
      "GY",
      "HK",
      "HM",
      "HN",
      "HR",
      "HU",
      "ID",
      "IE",
      "IL",
      "IM",
      "IN",
      "IO",
      "IQ",
      "IS",
      "IT",
      "JE",
      "JM",
      "JO",
      "JP",
      "KE",
      "KG",
      "KH",
      "KI",
      "KM",
      "KN",
      "KR",
      "KW",
      "KY",
      "KZ",
      "LA",
      "LB",
      "LC",
      "LI",
      "LK",
      "LR",
      "LS",
      "LT",
      "LU",
      "LV",
      "MA",
      "MC",
      "MD",
      "ME",
      "MF",
      "MG",
      "MH",
      "MK",
      "MN",
      "MO",
      "MP",
      "MQ",
      "MR",
      "MS",
      "MT",
      "MU",
      "MV",
      "MW",
      "MX",
      "MY",
      "MZ",
      "NA",
      "NC",
      "NE",
      "NF",
      "NG",
      "NL",
      "NO",
      "NP",
      "NR",
      "NU",
      "NZ",
      "OM",
      "PA",
      "PE",
      "PF",
      "PG",
      "PH",
      "PK",
      "PL",
      "PM",
      "PN",
      "PR",
      "PS",
      "PT",
      "PW",
      "PY",
      "QA",
      "RE",
      "RO",
      "RS",
      "RW",
      "SA",
      "SB",
      "SC",
      "SE",
      "SG",
      "SH",
      "SI",
      "SJ",
      "SK",
      "SL",
      "SM",
      "SN",
      "SR",
      "ST",
      "SV",
      "SX",
      "SZ",
      "TC",
      "TD",
      "TF",
      "TG",
      "TH",
      "TJ",
      "TK",
      "TL",
      "TM",
      "TN",
      "TO",
      "TR",
      "TT",
      "TV",
      "TW",
      "TZ",
      "UA",
      "UG",
      "UM",
      "US",
      "UY",
      "UZ",
      "VA",
      "VC",
      "VG",
      "VI",
      "VN",
      "VU",
      "WF",
      "WS",
      "XK",
      "YT",
      "ZA",
      "ZM",
    ])
    .describe("Two-letter ISO 3166-1 alpha-2 country code."),
  customData: z.record(z.any(), z.any()).optional().describe("Any structured custom key-value data needed outside of Paddle's standard fields. Occasionally used by third-parties."),
});

export const getAddressParameters = z.object({
  customerId: z.string().describe("Paddle ID of the customer."),
  addressId: z.string().describe("Paddle ID of the address."),
});

export const updateAddressParameters = z.object({
  customerId: z.string().describe("Paddle ID of the customer."),
  addressId: z.string().describe("Paddle ID of the address."),
  description: z.string().optional().describe("Memorable description for this address."),
  firstLine: z.string().optional().describe("First line of this address."),
  secondLine: z.string().optional().describe("Second line of this address."),
  city: z.string().optional().describe("City of this address."),
  postalCode: z.string().optional().describe("ZIP or postal code of this address. Required for some countries."),
  region: z.string().optional().describe("State, county, or region of this address."),
  countryCode: z
    .enum([
      "AD",
      "AE",
      "AG",
      "AI",
      "AL",
      "AM",
      "AO",
      "AR",
      "AS",
      "AT",
      "AU",
      "AW",
      "AX",
      "AZ",
      "BA",
      "BB",
      "BD",
      "BE",
      "BF",
      "BG",
      "BH",
      "BI",
      "BJ",
      "BL",
      "BM",
      "BN",
      "BO",
      "BQ",
      "BR",
      "BS",
      "BT",
      "BV",
      "BW",
      "BZ",
      "CA",
      "CC",
      "CG",
      "CH",
      "CI",
      "CK",
      "CL",
      "CM",
      "CN",
      "CO",
      "CR",
      "CV",
      "CW",
      "CX",
      "CY",
      "CZ",
      "DE",
      "DJ",
      "DK",
      "DM",
      "DO",
      "DZ",
      "EC",
      "EE",
      "EG",
      "EH",
      "ER",
      "ES",
      "ET",
      "FI",
      "FJ",
      "FK",
      "FM",
      "FO",
      "FR",
      "GA",
      "GB",
      "GD",
      "GE",
      "GF",
      "GG",
      "GH",
      "GI",
      "GL",
      "GM",
      "GN",
      "GP",
      "GQ",
      "GR",
      "GS",
      "GT",
      "GU",
      "GW",
      "GY",
      "HK",
      "HM",
      "HN",
      "HR",
      "HU",
      "ID",
      "IE",
      "IL",
      "IM",
      "IN",
      "IO",
      "IQ",
      "IS",
      "IT",
      "JE",
      "JM",
      "JO",
      "JP",
      "KE",
      "KG",
      "KH",
      "KI",
      "KM",
      "KN",
      "KR",
      "KW",
      "KY",
      "KZ",
      "LA",
      "LB",
      "LC",
      "LI",
      "LK",
      "LR",
      "LS",
      "LT",
      "LU",
      "LV",
      "MA",
      "MC",
      "MD",
      "ME",
      "MF",
      "MG",
      "MH",
      "MK",
      "MN",
      "MO",
      "MP",
      "MQ",
      "MR",
      "MS",
      "MT",
      "MU",
      "MV",
      "MW",
      "MX",
      "MY",
      "MZ",
      "NA",
      "NC",
      "NE",
      "NF",
      "NG",
      "NL",
      "NO",
      "NP",
      "NR",
      "NU",
      "NZ",
      "OM",
      "PA",
      "PE",
      "PF",
      "PG",
      "PH",
      "PK",
      "PL",
      "PM",
      "PN",
      "PR",
      "PS",
      "PT",
      "PW",
      "PY",
      "QA",
      "RE",
      "RO",
      "RS",
      "RW",
      "SA",
      "SB",
      "SC",
      "SE",
      "SG",
      "SH",
      "SI",
      "SJ",
      "SK",
      "SL",
      "SM",
      "SN",
      "SR",
      "ST",
      "SV",
      "SX",
      "SZ",
      "TC",
      "TD",
      "TF",
      "TG",
      "TH",
      "TJ",
      "TK",
      "TL",
      "TM",
      "TN",
      "TO",
      "TR",
      "TT",
      "TV",
      "TW",
      "TZ",
      "UA",
      "UG",
      "UM",
      "US",
      "UY",
      "UZ",
      "VA",
      "VC",
      "VG",
      "VI",
      "VN",
      "VU",
      "WF",
      "WS",
      "XK",
      "YT",
      "ZA",
      "ZM",
    ])
    .optional()
    .describe("Two-letter ISO 3166-1 alpha-2 country code."),
  customData: z.record(z.any(), z.any()).optional().describe("Any structured custom key-value data needed outside of Paddle's standard fields. Occasionally used by third-parties."),
  status: z.enum(["active", "archived"]).optional().describe("Whether this address can be used in Paddle."),
});

export const listBusinessesParameters = z.object({
  customerId: z.string().describe("Paddle ID of the customer."),
  after: z
    .string()
    .optional()
    .describe(
      "Return entities after the specified Paddle ID when working with paginated endpoints.",
    ),
  id: z
    .array(z.string())
    .optional()
    .describe("Return only the IDs specified. Use a comma-separated list to get multiple entities."),
  orderBy: z
    .enum(["id[ASC]", "id[DESC]"])
    .optional()
    .describe(
      "Order returned entities by the specified field and direction.",
    ),
  perPage: z
    .number()
    .optional()
    .describe(
      "Set how many entities are returned per page. Returns the maximum number of results if a number greater than the maximum is requested.",
    ),
  search: z
    .string()
    .optional()
    .describe(
      "Return entities that match a search query. Pass an exact match for the business's name or tax or VAT number.",
    ),
  status: z
    .array(z.enum(["active", "archived"]))
    .optional()
    .describe(
      "Return entities that match the specified status. Use a comma-separated list to specify multiple status values.",
    ),
});

export const createBusinessParameters = z.object({
  customerId: z.string().describe("Paddle ID of the customer."),
  name: z.string().describe("Full name."),
  companyNumber: z.string().optional().describe("Company number for this business."),
  taxIdentifier: z.string().optional().describe("Tax or VAT Number for this business."),
  contacts: z
    .array(z.object({
      name: z.string().describe("Full name of the contact."),
      email: z.string().describe("Email address of the contact."),
    }))
    .optional()
    .describe("List of contacts related to this business, typically used for sending invoices."),
  customData: z.record(z.any(), z.any()).optional().describe("Any structured custom key-value data needed outside of Paddle's standard fields. Occasionally used by third-parties."),
});

export const getBusinessParameters = z.object({
  customerId: z.string().describe("Paddle ID of the customer."),
  businessId: z.string().describe("Paddle ID of the business."),
});

export const updateBusinessParameters = z.object({
  customerId: z.string().describe("Paddle ID of the customer."),
  businessId: z.string().describe("Paddle ID of the business."),
  name: z.string().optional().describe("Full name."),
  companyNumber: z.string().optional().describe("Company number for this business."),
  taxIdentifier: z.string().optional().describe("Tax or VAT Number for this business."),
  status: z.enum(["active", "archived"]).optional().describe("Whether this business can be used in Paddle."),
  contacts: z
    .array(z.object({
      name: z.string().describe("Full name of the contact."),
      email: z.string().describe("Email address of the contact."),
    }))
    .optional()
    .describe("List of contacts related to this business, typically used for sending invoices."),
  customData: z.record(z.any(), z.any()).optional().describe("Any structured custom key-value data needed outside of Paddle's standard fields. Occasionally used by third-parties."),
});

export const listSavedPaymentMethodsParameters = z.object({
  customerId: z.string().describe("Paddle ID of the customer."),
  addressId: z
    .array(z.string())
    .optional()
    .describe(
      "Return entities related to the specified address. Use a comma-separated list to specify multiple address IDs.",
    ),
  after: z
    .string()
    .optional()
    .describe(
      "Return entities after the specified Paddle ID when working with paginated endpoints.",
    ),
  orderBy: z
    .enum(["id[ASC]", "id[DESC]"])
    .optional()
    .describe(
      "Order returned entities by the specified field and direction.",
    ),
  perPage: z
    .number()
    .optional()
    .describe(
      "Set how many entities are returned per page. Returns the maximum number of results if a number greater than the maximum is requested.",
    ),
  supportsCheckout: z
    .boolean()
    .optional()
    .describe("Return entities that support being presented at checkout (`true`) or not (`false`)."),
});

export const getSavedPaymentMethodParameters = z.object({
  customerId: z.string().describe("Paddle ID of the customer."),
  paymentMethodId: z.string().describe("Paddle ID of the payment method."),
});

export const deleteSavedPaymentMethodParameters = z.object({
  customerId: z.string().describe("Paddle ID of the customer."),
  paymentMethodId: z.string().describe("Paddle ID of the payment method."),
});

export const createCustomerPortalSessionParameters = z.object({
  customerId: z.string().describe("Paddle ID of the customer."),
  subscriptionIds: z
    .array(z.string())
    .describe("List of subscriptions to create authenticated customer portal deep links for."),
});

export const listNotificationSettingsParameters = z.object({
  after: z
    .string()
    .optional()
    .describe(
      "Return entities after the specified Paddle ID when working with paginated endpoints.",
    ),
  perPage: z
    .number()
    .optional()
    .describe(
      "Set how many entities are returned per page. Returns the maximum number of results if a number greater than the maximum is requested.",
    ),
  orderBy: z
    .enum(["id[ASC]", "id[DESC]"])
    .optional()
    .describe(
      "Order returned entities by the specified field and direction.",
    ),
  active: z.boolean().optional().describe("Determine whether returned entities are active (`true`) or not (`false`)."),
  trafficSource: z
    .enum(["platform", "simulation", "all"])
    .optional()
    .describe("Return entities that match the specified traffic source."),
});

export const createNotificationSettingParameters = z.object({
  description: z
    .string()
    .describe("Short description for this notification destination. Shown in the Paddle Dashboard."),
  type: z.enum(["email", "url"]).describe("Where notifications should be sent for this destination."),
  destination: z.string().describe("Webhook endpoint URL or email address."),
  apiVersion: z
    .number()
    .optional()
    .describe(
      "Must be `1` as the only current valid Paddle API version. If omitted, defaults to `1`.",
    ),
  includeSensitiveFields: z
    .boolean()
    .optional()
    .describe(
      "Whether potentially sensitive fields should be sent to this notification destination. If omitted, defaults to `false`.",
    ),
  subscribedEvents: z
    .array(
      z.enum([
        "address.created",
        "address.imported",
        "address.updated",
        "adjustment.created",
        "adjustment.updated",
        "api_key.created",
        "api_key.expired",
        "api_key.expiring",
        "api_key.revoked",
        "api_key.updated",
        "business.created",
        "business.imported",
        "business.updated",
        "client_token.created",
        "client_token.revoked",
        "client_token.updated",
        "customer.created",
        "customer.imported",
        "customer.updated",
        "discount.created",
        "discount.imported",
        "discount.updated",
        "discount_group.created",
        "discount_group.updated",
        "payment_method.saved",
        "payment_method.deleted",
        "payout.created",
        "payout.paid",
        "price.created",
        "price.imported",
        "price.updated",
        "product.created",
        "product.imported",
        "product.updated",
        "report.created",
        "report.updated",
        "subscription.activated",
        "subscription.canceled",
        "subscription.created",
        "subscription.imported",
        "subscription.past_due",
        "subscription.paused",
        "subscription.resumed",
        "subscription.trialing",
        "subscription.updated",
        "transaction.billed",
        "transaction.canceled",
        "transaction.completed",
        "transaction.created",
        "transaction.paid",
        "transaction.past_due",
        "transaction.payment_failed",
        "transaction.ready",
        "transaction.revised",
        "transaction.updated",
      ]),
    )
    .describe(
      "Subscribed events for this notification destination. When creating or updating a notification destination, pass an array of event type names only.",
    ),
  trafficSource: z
    .enum(["platform", "simulation", "all"])
    .optional()
    .describe(
      "Whether Paddle should deliver real platform events, simulation events or both to this notification destination. If omitted, defaults to `platform`.",
    ),
});

export const getNotificationSettingParameters = z.object({
  notificationSettingId: z.string().describe("Paddle ID of the notification setting (destination)."),
});

export const updateNotificationSettingParameters = z.object({
  notificationSettingId: z.string().describe("Paddle ID of the notification setting (destination)."),
  description: z
    .string()
    .optional()
    .describe("Short description for this notification destination. Shown in the Paddle Dashboard."),
  destination: z.string().optional().describe("Webhook endpoint URL or email address."),
  active: z
    .boolean()
    .optional()
    .describe("Whether Paddle should try to deliver events to this notification destination."),
  apiVersion: z
    .number()
    .optional()
    .describe(
      "Must be `1` as the only current valid Paddle API version. If omitted, defaults to `1`.",
    ),
  includeSensitiveFields: z
    .boolean()
    .optional()
    .describe("Whether potentially sensitive fields should be sent to this notification destination."),
  subscribedEvents: z
    .array(
      z.enum([
        "address.created",
        "address.imported",
        "address.updated",
        "adjustment.created",
        "adjustment.updated",
        "api_key.created",
        "api_key.expired",
        "api_key.expiring",
        "api_key.revoked",
        "api_key.updated",
        "business.created",
        "business.imported",
        "business.updated",
        "client_token.created",
        "client_token.revoked",
        "client_token.updated",
        "customer.created",
        "customer.imported",
        "customer.updated",
        "discount.created",
        "discount.imported",
        "discount.updated",
        "discount_group.created",
        "discount_group.updated",
        "payment_method.saved",
        "payment_method.deleted",
        "payout.created",
        "payout.paid",
        "price.created",
        "price.imported",
        "price.updated",
        "product.created",
        "product.imported",
        "product.updated",
        "report.created",
        "report.updated",
        "subscription.activated",
        "subscription.canceled",
        "subscription.created",
        "subscription.imported",
        "subscription.past_due",
        "subscription.paused",
        "subscription.resumed",
        "subscription.trialing",
        "subscription.updated",
        "transaction.billed",
        "transaction.canceled",
        "transaction.completed",
        "transaction.created",
        "transaction.paid",
        "transaction.past_due",
        "transaction.payment_failed",
        "transaction.ready",
        "transaction.revised",
        "transaction.updated",
      ]),
    )
    .optional()
    .describe(
      "Subscribed events for this notification destination. When creating or updating a notification destination, pass an array of event type names only.",
    ),
  trafficSource: z
    .enum(["platform", "simulation", "all"])
    .optional()
    .describe(
      "Whether Paddle should deliver real platform events, simulation events or both to this notification destination.",
    ),
});

export const deleteNotificationSettingParameters = z.object({
  notificationSettingId: z.string().describe("Paddle ID of the notification setting (destination)."),
});

export const listEventsParameters = z.object({
  after: z
    .string()
    .optional()
    .describe(
      "Return entities after the specified Paddle ID when working with paginated endpoints.",
    ),
  orderBy: z
    .enum(["id[ASC]", "id[DESC]"])
    .optional()
    .describe(
      "Order returned entities by the specified field and direction.",
    ),
  perPage: z
    .number()
    .optional()
    .describe(
      "Set how many entities are returned per page. Returns the maximum number of results if a number greater than the maximum is requested.",
    ),
});

export const listNotificationsParameters = z.object({
  after: z
    .string()
    .optional()
    .describe(
      "Return entities after the specified Paddle ID when working with paginated endpoints.",
    ),
  notificationSettingId: z
    .array(z.string())
    .optional()
    .describe(
      "Return entities related to the specified notification destination. Use a comma-separated list to specify multiple notification destination IDs.",
    ),
  orderBy: z
    .enum(["id[ASC]", "id[DESC]"])
    .optional()
    .describe(
      "Order returned entities by the specified field and direction.",
    ),
  perPage: z
    .number()
    .optional()
    .describe(
      "Set how many entities are returned per page. Returns the maximum number of results if a number greater than the maximum is requested.",
    ),
  search: z.string().optional().describe("Return entities that match a search query. Pass an exact match for the Paddle ID or event type."),
  status: z
    .array(z.enum(["delivered", "failed", "needs_retry", "not_attempted"]))
    .optional()
    .describe(
      "Return entities that match the specified status. Use a comma-separated list to specify multiple status values.",
    ),
  filter: z
    .string()
    .optional()
    .describe(
      "Return entities that contain the Paddle ID specified. Pass a transaction, customer, or subscription ID.",
    ),
  to: z.string().optional().describe("Return entities up to a specific time. Pass an RFC 3339 datetime string."),
  from: z.string().optional().describe("Return entities from a specific time. Pass an RFC 3339 datetime string."),
});

export const getNotificationParameters = z.object({
  notificationId: z.string().describe("Paddle ID of the notification."),
});

export const listNotificationLogsParameters = z.object({
  notificationId: z.string().describe("Paddle ID of the notification."),
  after: z
    .string()
    .describe(
      "Return entities after the specified Paddle ID when working with paginated endpoints.",
    ),
  perPage: z
    .number()
    .describe(
      "Set how many entities are returned per page. Returns the maximum number of results if a number greater than the maximum is requested.",
    ),
});

export const replayNotificationParameters = z.object({
  notificationId: z.string().describe("Paddle ID of the notification."),
});

export const listSimulationsParameters = z.object({
  after: z
    .string()
    .optional()
    .describe(
      "Return entities after the specified Paddle ID when working with paginated endpoints.",
    ),
  notificationSettingId: z
    .array(z.string())
    .optional()
    .describe(
      "Return entities related to the specified notification destination. Use a comma-separated list to specify multiple notification destination IDs.",
    ),
  orderBy: z
    .enum(["id[ASC]", "id[DESC]"])
    .optional()
    .describe(
      "Order returned entities by the specified field and direction.",
    ),
  perPage: z
    .number()
    .optional()
    .describe(
      "Set how many entities are returned per page. Returns the maximum number of results if a number greater than the maximum is requested.",
    ),
  id: z
    .array(z.string())
    .optional()
    .describe("Return only the IDs specified. Use a comma-separated list to get multiple entities."),
  status: z
    .array(z.enum(["active", "archived"]))
    .optional()
    .describe(
      "Return entities that match the specified status. Use a comma-separated list to specify multiple status values.",
    ),
});

export const createSimulationParameters = z.object({
  notificationSettingId: z
    .string()
    .describe("Paddle ID of the notification setting (destination) where this simulation is sent, prefixed with `ntfset_`."),
  name: z.string().describe("Name of this simulation to identify internally."),
  type: z
    .enum([
      "address.created",
      "address.updated",
      "address.imported",
      "adjustment.created",
      "adjustment.updated",
      "business.created",
      "business.updated",
      "business.imported",
      "customer.created",
      "customer.updated",
      "customer.imported",
      "discount.created",
      "discount.updated",
      "discount.imported",
      "payout.created",
      "payout.paid",
      "price.created",
      "price.updated",
      "price.imported",
      "product.created",
      "product.updated",
      "product.imported",
      "subscription.created",
      "subscription.past_due",
      "subscription.activated",
      "subscription.canceled",
      "subscription.imported",
      "subscription.paused",
      "subscription.resumed",
      "subscription.trialing",
      "subscription.updated",
      "transaction.billed",
      "transaction.canceled",
      "transaction.completed",
      "transaction.created",
      "transaction.paid",
      "transaction.past_due",
      "transaction.payment_failed",
      "transaction.ready",
      "transaction.updated",
      "transaction.revised",
      "report.created",
      "report.updated",
      "subscription_creation",
      "subscription_renewal",
      "subscription_pause",
      "subscription_resume",
      "subscription_cancellation",
    ])
    .describe("Type of event sent by Paddle, in the format `entity.event_type`. Either single events (e.g. 'subscription.created') or scenarios for multiple events (e.g. 'subscription_creation')."),
  payload: z
    .record(z.string(), z.any())
    .optional()
    .describe(
      "Simulation payload. Pass a JSON object that matches the schema for an event type to simulate a custom payload. If omitted, Paddle populates with a demo example. Only for single event simulations, not scenarios.",
    ),
  config: z
    .object({
      subscriptionCancellation: z
        .object({
          entities: z
            .object({
              subscriptionId: z
                .string()
                .optional()
                .describe(
                  "Paddle ID of a subscription to simulate as canceled. Adds details of that subscription to webhook payloads.",
                ),
            })
            .optional()
            .describe("Adds details of existing Paddle entities to webhook payloads sent in the simulation."),
          options: z
            .object({
              effectiveFrom: z
                .enum(["next_billing_period", "immediately"])
                .optional()
                .describe(
                  "Determines which webhooks are sent based on when the subscription is paused or canceled. If omitted, defaults to `immediately`.",
                ),
              hasPastDueTransaction: z
                .boolean()
                .optional()
                .describe(
                  "Whether a simulated subscription has a past due transaction (`true`) or not (`false`), which determines whether events occur for canceling past due transactions. If omitted, defaults to `false`.",
                ),
            })
            .optional()
            .describe("Options that determine which webhooks are sent as part of a simulation."),
        })
        .optional()
        .describe("Configuration for subscription canceled simulations."),
      subscriptionPause: z
        .object({
          entities: z
            .object({
              subscriptionId: z
                .string()
                .optional()
                .describe(
                  "Paddle ID of a subscription to simulate as paused. Adds details of that subscription to webhook payloads.",
                ),
            })
            .optional()
            .describe("Adds details of existing Paddle entities to webhook payloads sent in the simulation."),
          options: z
            .object({
              effectiveFrom: z
                .enum(["next_billing_period", "immediately"])
                .optional()
                .describe(
                  "Determines which webhooks are sent based on when the subscription is paused or canceled. If omitted, defaults to `immediately`.",
                ),
              hasPastDueTransaction: z
                .boolean()
                .optional()
                .describe(
                  "Whether a simulated subscription has a past due transaction (`true`) or not (`false`), which determines whether events occur for canceling past due transactions. If omitted, defaults to `false`.",
                ),
            })
            .optional()
            .describe("Options that determine which webhooks are sent as part of a simulation."),
        })
        .optional()
        .describe("Configuration for subscription paused simulations."),
      subscriptionResume: z
        .object({
          entities: z
            .object({
              subscriptionId: z
                .string()
                .optional()
                .describe(
                  "Paddle ID of a subscription to simulate as resumed. Adds details of that subscription to webhook payloads.",
                ),
            })
            .optional()
            .describe("Adds details of existing Paddle entities to webhook payloads sent in the simulation."),
          options: z
            .object({
              paymentOutcome: z
                .enum(["success", "recovered_existing_payment_method", "recovered_updated_payment_method", "failed"])
                .optional()
                .describe(
                  "Determines which webhooks are sent based on the outcome of the payment. If omitted, defaults to `success`.",
                ),
              dunningExhaustedAction: z
                .enum(["subscription_paused", "subscription_canceled"])
                .optional()
                .describe(
                  "Determines which webhooks are sent based on what happens to the subscription when payment recovery attempts are exhausted. Only applies when `payment_outcome` is `failed`. If omitted, defaults to `null`.",
                ),
            })
            .optional()
            .describe("Options that determine which webhooks are sent as part of a simulation."),
        })
        .optional()
        .describe("Configuration for subscription resumed simulations."),
      subscriptionRenewal: z
        .object({
          entities: z
            .object({
              subscriptionId: z
                .string()
                .optional()
                .describe(
                  "Paddle ID of a subscription to simulate as renewed. Adds details of that subscription to webhook payloads.",
                ),
            })
            .optional()
            .describe("Adds details of existing Paddle entities to webhook payloads sent in the simulation."),
          options: z
            .object({
              paymentOutcome: z
                .enum(["success", "recovered_existing_payment_method", "recovered_updated_payment_method", "failed"])
                .optional()
                .describe(
                  "Determines which webhooks are sent based on the outcome of the payment. If omitted, defaults to `success`.",
                ),
              dunningExhaustedAction: z
                .enum(["subscription_paused", "subscription_canceled"])
                .optional()
                .describe(
                  "Determines which webhooks are sent based on what happens to the subscription when payment recovery attempts are exhausted. Only applies when `payment_outcome` is `failed`. If omitted, defaults to `null`.",
                ),
            })
            .optional()
            .describe("Options that determine which webhooks are sent as part of a simulation."),
        })
        .optional()
        .describe("Configuration for subscription renewed simulations."),
      subscriptionCreation: z
        .object({
          entities: z
            .object({
              customerId: z
                .string()
                .optional()
                .describe("Paddle ID of a customer. Adds customer details to webhook payloads."),
              addressId: z
                .string()
                .optional()
                .describe("Paddle ID of an address. Adds address details to webhook payloads. Requires `customerId`."),
              businessId: z
                .string()
                .optional()
                .describe("Paddle ID of a business. Adds business details to webhook payloads. Requires `customerId`."),
              paymentMethodId: z
                .string()
                .optional()
                .describe(
                  "Paddle ID of a payment method. Adds payment method details to webhook payloads. Requires `customerId`.",
                ),
              discountId: z
                .string()
                .optional()
                .describe(
                  "Paddle ID of a discount. Adds discount details (including price calculations) to webhook payloads. Requires `items` or `transactionId` for the discount to be applied.",
                ),
              transactionId: z
                .string()
                .optional()
                .describe("Paddle ID of a transaction. Bases the subscription on the transaction."),
              items: z
                .array(
                  z.object({
                    priceId: z.string().describe("Paddle ID of an existing catalog price to bill for."),
                    quantity: z.number().describe("Quantity to bill for."),
                  }),
                )
                .optional()
                .describe(
                  "Items to include on the simulated subscription. Only existing products and prices can be simulated. Non-catalog items aren't supported. At least one recurring price must be provided.",
                ),
            })
            .optional()
            .describe("Adds details of existing Paddle entities to webhook payloads sent in the simulation."),
          options: z
            .object({
              customerSimulatedAs: z
                .enum(["new", "existing_email_matched", "existing_details_prefilled"])
                .optional()
                .describe(
                  "Determines which webhooks are sent based on whether a new or existing customer subscribes, and how their details are entered if they're an existing customer. If omitted, defaults to `new`.",
                ),
              businessSimulatedAs: z
                .enum(["not_provided", "new", "existing_details_prefilled"])
                .optional()
                .describe(
                  "Determines which webhooks are sent based on whether a new, existing, or no business was provided. If omitted, defaults to `not_provided`.",
                ),
              discountSimulatedAs: z
                .enum(["not_provided", "prefilled", "entered_by_customer"])
                .optional()
                .describe(
                  "Determines which webhooks are sent based on whether a discount is used and how it's entered. If omitted, defaults to `not_provided`.",
                ),
            })
            .optional()
            .describe("Options that determine which webhooks are sent as part of a simulation."),
        })
        .optional()
        .describe("Configuration for subscription creation simulations."),
    })
    .optional()
    .describe(
      "Configuration for this scenario simulation. Determines which granular flow is simulated and what entities are used to populate webhook payloads with.",
    ),
});

export const getSimulationParameters = z.object({
  simulationId: z.string().describe("Paddle ID of the simulation entity."),
});

export const updateSimulationParameters = z.object({
  simulationId: z.string().describe("Paddle ID of the simulation entity."),
  notificationSettingId: z
    .string()
    .optional()
    .describe("Paddle ID of the notification setting (destination) where this simulation is sent, prefixed with `ntfset_`."),
  name: z.string().optional().describe("Name of this simulation."),
  status: z.enum(["active", "archived"]).optional().describe("Whether this simulation can be used in Paddle."),
  type: z
    .enum([
      "address.created",
      "address.updated",
      "address.imported",
      "adjustment.created",
      "adjustment.updated",
      "business.created",
      "business.updated",
      "business.imported",
      "customer.created",
      "customer.updated",
      "customer.imported",
      "discount.created",
      "discount.updated",
      "discount.imported",
      "payout.created",
      "payout.paid",
      "price.created",
      "price.updated",
      "price.imported",
      "product.created",
      "product.updated",
      "product.imported",
      "subscription.created",
      "subscription.past_due",
      "subscription.activated",
      "subscription.canceled",
      "subscription.imported",
      "subscription.paused",
      "subscription.resumed",
      "subscription.trialing",
      "subscription.updated",
      "transaction.billed",
      "transaction.canceled",
      "transaction.completed",
      "transaction.created",
      "transaction.paid",
      "transaction.past_due",
      "transaction.payment_failed",
      "transaction.ready",
      "transaction.updated",
      "transaction.revised",
      "report.created",
      "report.updated",
      "subscription_creation",
      "subscription_renewal",
      "subscription_pause",
      "subscription_resume",
      "subscription_cancellation",
    ])
    .optional()
    .describe("Type of event sent by Paddle, in the format `entity.event_type`. Either single events (e.g. 'subscription.created') or scenarios for multiple events (e.g. 'subscription_creation')."),
  payload: z
    .record(z.string(), z.any())
    .nullable()
    .optional()
    .describe(
      "Simulation payload. Pass a JSON object that matches the schema for an event type to simulate a custom payload. Set to `null` to clear and populate with a demo example. Only for single event simulations, not scenarios.",
    ),
  config: z
    .object({
      subscriptionCancellation: z
        .object({
          entities: z
            .object({
              subscriptionId: z
                .string()
                .optional()
                .describe(
                  "Paddle ID of a subscription to simulate as canceled. Adds details of that subscription to webhook payloads.",
                ),
            })
            .optional()
            .describe("Adds details of existing Paddle entities to webhook payloads sent in the simulation."),
          options: z
            .object({
              effectiveFrom: z
                .enum(["next_billing_period", "immediately"])
                .optional()
                .describe(
                  "Determines which webhooks are sent based on when the subscription is paused or canceled. If omitted, defaults to `immediately`.",
                ),
              hasPastDueTransaction: z
                .boolean()
                .optional()
                .describe(
                  "Whether a simulated subscription has a past due transaction (`true`) or not (`false`), which determines whether events occur for canceling past due transactions. If omitted, defaults to `false`.",
                ),
            })
            .optional()
            .describe("Options that determine which webhooks are sent as part of a simulation."),
        })
        .optional()
        .describe("Configuration for subscription canceled simulations."),
      subscriptionPause: z
        .object({
          entities: z
            .object({
              subscriptionId: z
                .string()
                .optional()
                .describe(
                  "Paddle ID of a subscription to simulate as paused. Adds details of that subscription to webhook payloads.",
                ),
            })
            .optional()
            .describe("Adds details of existing Paddle entities to webhook payloads sent in the simulation."),
          options: z
            .object({
              effectiveFrom: z
                .enum(["next_billing_period", "immediately"])
                .optional()
                .describe(
                  "Determines which webhooks are sent based on when the subscription is paused or canceled. If omitted, defaults to `immediately`.",
                ),
              hasPastDueTransaction: z
                .boolean()
                .optional()
                .describe(
                  "Whether a simulated subscription has a past due transaction (`true`) or not (`false`), which determines whether events occur for canceling past due transactions. If omitted, defaults to `false`.",
                ),
            })
            .optional()
            .describe("Options that determine which webhooks are sent as part of a simulation."),
        })
        .optional()
        .describe("Configuration for subscription paused simulations."),
      subscriptionResume: z
        .object({
          entities: z
            .object({
              subscriptionId: z
                .string()
                .optional()
                .describe(
                  "Paddle ID of a subscription to simulate as resumed. Adds details of that subscription to webhook payloads.",
                ),
            })
            .optional()
            .describe("Adds details of existing Paddle entities to webhook payloads sent in the simulation."),
          options: z
            .object({
              paymentOutcome: z
                .enum(["success", "recovered_existing_payment_method", "recovered_updated_payment_method", "failed"])
                .optional()
                .describe(
                  "Determines which webhooks are sent based on the outcome of the payment. If omitted, defaults to `success`.",
                ),
              dunningExhaustedAction: z
                .enum(["subscription_paused", "subscription_canceled"])
                .optional()
                .describe(
                  "Determines which webhooks are sent based on what happens to the subscription when payment recovery attempts are exhausted. Only applies when `payment_outcome` is `failed`. If omitted, defaults to `null`.",
                ),
            })
            .optional()
            .describe("Options that determine which webhooks are sent as part of a simulation."),
        })
        .optional()
        .describe("Configuration for subscription resumed simulations."),
      subscriptionRenewal: z
        .object({
          entities: z
            .object({
              subscriptionId: z
                .string()
                .optional()
                .describe(
                  "Paddle ID of a subscription to simulate as renewed. Adds details of that subscription to webhook payloads.",
                ),
            })
            .optional()
            .describe("Adds details of existing Paddle entities to webhook payloads sent in the simulation."),
          options: z
            .object({
              paymentOutcome: z
                .enum(["success", "recovered_existing_payment_method", "recovered_updated_payment_method", "failed"])
                .optional()
                .describe(
                  "Determines which webhooks are sent based on the outcome of the payment. If omitted, defaults to `success`.",
                ),
              dunningExhaustedAction: z
                .enum(["subscription_paused", "subscription_canceled"])
                .optional()
                .describe(
                  "Determines which webhooks are sent based on what happens to the subscription when payment recovery attempts are exhausted. Only applies when `payment_outcome` is `failed`. If omitted, defaults to `null`.",
                ),
            })
            .optional()
            .describe("Options that determine which webhooks are sent as part of a simulation."),
        })
        .optional()
        .describe("Configuration for subscription renewed simulations."),
      subscriptionCreation: z
        .object({
          entities: z
            .object({
              customerId: z
                .string()
                .optional()
                .describe("Paddle ID of a customer. Adds customer details to webhook payloads."),
              addressId: z
                .string()
                .optional()
                .describe("Paddle ID of an address. Adds address details to webhook payloads. Requires `customerId`."),
              businessId: z
                .string()
                .optional()
                .describe("Paddle ID of a business. Adds business details to webhook payloads. Requires `customerId`."),
              paymentMethodId: z
                .string()
                .optional()
                .describe(
                  "Paddle ID of a payment method. Adds payment method details to webhook payloads. Requires `customerId`.",
                ),
              discountId: z
                .string()
                .optional()
                .describe(
                  "Paddle ID of a discount. Adds discount details (including price calculations) to webhook payloads. Requires `items` or `transaction_id` for the discount to be applied.",
                ),
              transactionId: z
                .string()
                .optional()
                .describe("Paddle ID of a transaction. Bases the subscription on the transaction."),
              items: z
                .array(
                  z.object({
                    priceId: z.string().describe("Paddle ID of an existing catalog price to bill for."),
                    quantity: z.number().describe("Quantity to bill for."),
                  }),
                )
                .optional()
                .describe(
                  "Items to include on the simulated subscription. Only existing products and prices can be simulated. Non-catalog items aren't supported. At least one recurring price must be provided.",
                ),
            })
            .optional()
            .describe("Adds details of existing Paddle entities to webhook payloads sent in the simulation."),
          options: z
            .object({
              customerSimulatedAs: z
                .enum(["new", "existing_email_matched", "existing_details_prefilled"])
                .optional()
                .describe(
                  "Determines which webhooks are sent based on whether a new or existing customer subscribes, and how their details are entered if they're an existing customer. If omitted, defaults to `new`.",
                ),
              businessSimulatedAs: z
                .enum(["not_provided", "new", "existing_details_prefilled"])
                .optional()
                .describe(
                  "Determines which webhooks are sent based on whether a new, existing, or no business was provided. If omitted, defaults to `not_provided`.",
                ),
              discountSimulatedAs: z
                .enum(["not_provided", "prefilled", "entered_by_customer"])
                .optional()
                .describe(
                  "Determines which webhooks are sent based on whether a discount is used and how it's entered. If omitted, defaults to `not_provided`.",
                ),
            })
            .optional()
            .describe("Options that determine which webhooks are sent as part of a simulation."),
        })
        .optional()
        .describe("Configuration for subscription creation simulations."),
    })
    .optional()
    .describe(
      "Configuration for this scenario simulation. Determines which granular flow is simulated and what entities are used to populate webhook payloads with.",
    ),
});

export const listSimulationRunsParameters = z.object({
  simulationId: z.string().describe("Paddle ID of the simulation to list runs for."),
  after: z
    .string()
    .optional()
    .describe(
      "Return entities after the specified Paddle ID when working with paginated endpoints.",
    ),
  include: z
    .array(z.enum(["events"]))
    .optional()
    .describe("Include related entities in the response."),
  orderBy: z
    .enum(["id[ASC]", "id[DESC]"])
    .optional()
    .describe(
      "Order returned entities by the specified field and direction.",
    ),
  perPage: z
    .number()
    .optional()
    .describe(
      "Set how many entities are returned per page. Returns the maximum number of results if a number greater than the maximum is requested.",
    ),
  id: z
    .array(z.string())
    .optional()
    .describe("Return only the IDs specified. Use a comma-separated list to get multiple entities."),
});

export const createSimulationRunParameters = z.object({
  simulationId: z.string().describe("Paddle ID of the simulation to create a run for."),
});

export const getSimulationRunParameters = z.object({
  simulationId: z.string().describe("Paddle ID of the simulation entity associated with the run."),
  simulationRunId: z.string().describe("Paddle ID of the simulation run entity."),
  include: z.array(z.enum(["events"])).describe("Include related entities in the response."),
});

export const listSimulationRunEventsParameters = z.object({
  simulationId: z.string().describe("Paddle ID of the simulation entity associated with the run."),
  simulationRunId: z.string().describe("Paddle ID of the simulation run entity."),
  after: z
    .string()
    .optional()
    .describe(
      "Return entities after the specified Paddle ID when working with paginated endpoints.",
    ),
  orderBy: z
    .enum(["id[ASC]", "id[DESC]"])
    .optional()
    .describe(
      "Order returned entities by the specified field and direction.",
    ),
  perPage: z
    .number()
    .optional()
    .describe(
      "Set how many entities are returned per page. Returns the maximum number of results if a number greater than the maximum is requested.",
    ),
  id: z
    .array(z.string())
    .optional()
    .describe("Return only the IDs specified. Use a comma-separated list to get multiple entities."),
});

export const getSimulationRunEventParameters = z.object({
  simulationId: z.string().describe("Paddle ID of the simulation entity associated with the run the event was sent as part of."),
  simulationRunId: z.string().describe("Paddle ID of the simulation run entity the event was sent as part of."),
  simulationEventId: z.string().describe("Paddle ID of the simulation event entity to get."),
});

export const replaySimulationRunEventParameters = z.object({
  simulationId: z.string().describe("Paddle ID of the simulation entity associated with the run the event was sent as part of."),
  simulationRunId: z.string().describe("Paddle ID of the simulation run entity the event was sent as part of."),
  simulationEventId: z.string().describe("Paddle ID of the simulation event entity to replay."),
});

export const getTransactionInvoiceParameters = z.object({
  transactionId: z.string().describe("Paddle ID of the transaction."),
  disposition: z
    .enum(["attachment", "inline"])
    .optional()
    .describe(
      "Determine whether the generated URL should download the PDF as an attachment saved locally, or open it inline in the browser. If omitted, defaults to `attachment`.",
    ),
});

export const listDiscountsParameters = z.object({
  after: z
    .string()
    .optional()
    .describe(
      "Return entities after the specified Paddle ID when working with paginated endpoints.",
    ),
  code: z
    .array(z.string())
    .optional()
    .describe(
      "Return entities that match the discount code. Use a comma-separated list to specify multiple discount codes.",
    ),
  id: z
    .array(z.string())
    .optional()
    .describe("Return only the IDs specified. Use a comma-separated list to get multiple entities."),
  orderBy: z
    .enum(["id[ASC]", "id[DESC]"])
    .optional()
    .describe(
      "Order returned entities by the specified field and direction.",
    ),
  perPage: z
    .number()
    .optional()
    .describe(
      "Set how many entities are returned per page. Returns the maximum number of results if a number greater than the maximum is requested.",
    ),
  status: z
    .array(z.enum(["active", "archived"]))
    .optional()
    .describe(
      "Return entities that match the specified status. Use a comma-separated list to specify multiple status values.",
    ),
  mode: z.enum(["custom", "standard"]).optional().describe("Return entities that match the specified mode."),
});

export const createDiscountParameters = z.object({
  description: z.string().describe("Short description for this discount. Not shown to customers."),
  enabledForCheckout: z
    .boolean()
    .optional()
    .describe("Whether this discount can be redeemed by customers at checkout (`true`) or not (`false`)."),
  code: z
    .string()
    .optional()
    .describe(
      "Unique code that customers can use to redeem this discount at checkout. Use letters and numbers only, up to 32 characters. Not case-sensitive. If omitted and `enabledForCheckout` is `true`, Paddle generates a random 10-character code.",
    ),
  type: z
    .enum(["flat", "flat_per_seat", "percentage"])
    .describe("Type of discount. Determines how this discount impacts the checkout or transaction total."),
  mode: z
    .enum(["standard", "custom"])
    .optional()
    .describe(
      "Discount mode. Standard discounts are considered part of the listed catalog and are shown in the Paddle dashboard.",
    ),
  amount: z
    .string()
    .describe(
      "Amount to discount by. For `percentage` discounts, must be an amount between `0.01` and `100`. For `flat` and `flat_per_seat` discounts, amount in the lowest denomination for a currency.",
    ),
  currencyCode: z
    .enum([
      "USD",
      "EUR",
      "GBP",
      "JPY",
      "AUD",
      "CAD",
      "CHF",
      "HKD",
      "SGD",
      "SEK",
      "ARS",
      "BRL",
      "CLP",
      "CNY",
      "COP",
      "CZK",
      "DKK",
      "HUF",
      "ILS",
      "INR",
      "KRW",
      "MXN",
      "NOK",
      "NZD",
      "PEN",
      "PLN",
      "RUB",
      "THB",
      "TRY",
      "TWD",
      "UAH",
      "VND",
      "ZAR",
    ])
    .optional()
    .describe(
      "Supported three-letter ISO 4217 currency code. Required where discount type is `flat` or `flat_per_seat`.",
    ),
  recur: z
    .boolean()
    .optional()
    .describe(
      "Whether this discount applies for multiple subscription billing periods (`true`) or not (`false`). If omitted, defaults to `false`.",
    ),
  maximumRecurringIntervals: z
    .number()
    .optional()
    .describe(
      "Number of subscription billing periods that this discount recurs for. Requires `recur`. `null` if this discount recurs forever. Subscription renewals, mid-cycle changes, and one-time charges billed to a subscription aren't considered a redemption. `timesUsed` is not incremented in these cases.",
    ),
  usageLimit: z
    .number()
    .optional()
    .describe(
      "Maximum number of times this discount can be redeemed. This is an overall limit for this discount, rather than a per-customer limit. `null` if this discount can be redeemed an unlimited amount of times. Paddle counts a usage as a redemption on a checkout, transaction, or the initial application against a subscription. Transactions created for subscription renewals, mid-cycle changes, and one-time charges aren't considered a redemption.",
    ),
  restrictTo: z
    .array(z.string())
    .optional()
    .describe(
      "Product or price IDs that this discount is for. When including a product ID, all prices for that product can be discounted. `null` if this discount applies to all products and prices.",
    ),
  expiresAt: z
    .string()
    .optional()
    .describe(
      "RFC 3339 datetime string of when this discount expires. Discount can no longer be redeemed after this date has elapsed. `null` if this discount can be redeemed forever. Expired discounts can't be redeemed against transactions or checkouts, but can be applied when updating subscriptions.",
    ),
  customData: z.record(z.any(), z.any()).optional().describe("Any structured custom key-value data needed outside of Paddle's standard fields. Occasionally used by third-parties."),
});

export const getDiscountParameters = z.object({
  discountId: z.string().describe("Paddle ID of the discount."),
});

export const updateDiscountParameters = z.object({
  discountId: z.string().describe("Paddle ID of the discount."),
  status: z.enum(["active", "archived"]).optional().describe("Whether this discount can be used in Paddle."),
  description: z
    .string()
    .optional()
    .describe("Short description for this discount. Not shown to customers."),
  enabledForCheckout: z
    .boolean()
    .optional()
    .describe("Whether this discount can be redeemed by customers at checkout (`true`) or not (`false`)."),
  code: z
    .string()
    .optional()
    .describe("Unique code that customers can use to redeem this discount at checkout. Not case-sensitive."),
  type: z
    .enum(["flat", "flat_per_seat", "percentage"])
    .optional()
    .describe("Type of discount. Determines how this discount impacts the checkout or transaction total."),
  mode: z
    .enum(["standard", "custom"])
    .optional()
    .describe(
      "Discount mode. Standard discounts are considered part of the listed catalog and are shown in the Paddle dashboard.",
    ),
  amount: z
    .string()
    .optional()
    .describe(
      "Amount to discount by. For `percentage` discounts, must be an amount between `0.01` and `100`. For `flat` and `flat_per_seat` discounts, amount in the lowest denomination for a currency.",
    ),
  currencyCode: z
    .enum([
      "USD",
      "EUR",
      "GBP",
      "JPY",
      "AUD",
      "CAD",
      "CHF",
      "HKD",
      "SGD",
      "SEK",
      "ARS",
      "BRL",
      "CLP",
      "CNY",
      "COP",
      "CZK",
      "DKK",
      "HUF",
      "ILS",
      "INR",
      "KRW",
      "MXN",
      "NOK",
      "NZD",
      "PEN",
      "PLN",
      "RUB",
      "THB",
      "TRY",
      "TWD",
      "UAH",
      "VND",
      "ZAR",
    ])
    .optional()
    .describe(
      "Supported three-letter ISO 4217 currency code. Required where discount type is `flat` or `flat_per_seat`.",
    ),
  recur: z
    .boolean()
    .optional()
    .describe("Whether this discount applies for multiple subscription billing periods (`true`) or not (`false`)."),
  maximumRecurringIntervals: z
    .number()
    .optional()
    .describe(
      "Number of subscription billing periods that this discount recurs for. Requires `recur`. `null` if this discount recurs forever. Subscription renewals, mid-cycle changes, and one-time charges billed to a subscription aren't considered a redemption. `timesUsed` is not incremented in these cases.",
    ),
  usageLimit: z
    .number()
    .optional()
    .describe(
      "Maximum number of times this discount can be redeemed. This is an overall limit for this discount, rather than a per-customer limit. `null` if this discount can be redeemed an unlimited amount of times. Paddle counts a usage as a redemption on a checkout, transaction, or the initial application against a subscription. Transactions created for subscription renewals, mid-cycle changes, and one-time charges aren't considered a redemption.",
    ),
  restrictTo: z
    .array(z.string())
    .optional()
    .describe(
      "Product or price IDs that this discount is for. When including a product ID, all prices for that product can be discounted. `null` if this discount applies to all products and prices.",
    ),
  expiresAt: z
    .string()
    .optional()
    .describe(
      "RFC 3339 datetime string of when this discount expires. Discount can no longer be redeemed after this date has elapsed. `null` if this discount can be redeemed forever. Expired discounts can't be redeemed against transactions or checkouts, but can be applied when updating subscriptions.",
    ),
  customData: z.record(z.any(), z.any()).optional().describe("Any structured custom key-value data needed outside of Paddle's standard fields. Occasionally used by third-parties."),
});

export const listDiscountGroupsParameters = z.object({
  after: z
    .string()
    .optional()
    .describe("Return entities after the specified Paddle ID when working with paginated endpoints."),
  id: z
    .array(z.string())
    .optional()
    .describe("Return only the IDs specified. Use a comma-separated list to get multiple entities."),
  orderBy: z
    .enum(["id[ASC]", "id[DESC]"])
    .optional()
    .describe("Order returned entities by the specified field and direction."),
  perPage: z
    .number()
    .optional()
    .describe("Set how many entities are returned per page. Returns the maximum number of results if a number greater than the maximum is requested."),
});

export const createDiscountGroupParameters = z.object({
  name: z.string().describe("Name of this discount group."),
});

export const getDiscountGroupParameters = z.object({
  discountGroupId: z.string().describe("Paddle ID of the discount group."),
});

export const updateDiscountGroupParameters = z.object({
  discountGroupId: z.string().describe("Paddle ID of the discount group."),
  status: z
    .enum(["active", "archived"])
    .optional()
    .describe("Whether this discount group can be used in Paddle."),
  name: z
    .string()
    .optional()
    .describe("Name of this discount group."),
});

export const archiveDiscountGroupParameters = z.object({
  discountGroupId: z.string().describe("Paddle ID of the discount group."),
});

export const getSubscriptionParameters = z.object({
  subscriptionId: z.string().describe("Paddle ID of the subscription."),
  include: z
    .array(z.enum(["next_transaction", "recurring_transaction_details"]))
    .optional()
    .describe("Include related entities in the response. Use a comma-separated list to specify multiple entities."),
});

export const updateSubscriptionParameters = z.object({
  subscriptionId: z.string().describe("Paddle ID of the subscription."),
  customerId: z.string().optional().describe("Unique Paddle ID for this customer entity, prefixed with `ctm_`."),
  addressId: z.string().optional().describe("Unique Paddle ID for this address entity, prefixed with `add_`."),
  businessId: z
    .string()
    .optional()
    .describe(
      "Paddle ID of the business that this subscription is for, prefixed with `biz_`. Include to change the business for a subscription.",
    ),
  currencyCode: z
    .enum([
      "USD",
      "EUR",
      "GBP",
      "JPY",
      "AUD",
      "CAD",
      "CHF",
      "HKD",
      "SGD",
      "SEK",
      "ARS",
      "BRL",
      "CLP",
      "CNY",
      "COP",
      "CZK",
      "DKK",
      "HUF",
      "ILS",
      "INR",
      "KRW",
      "MXN",
      "NOK",
      "NZD",
      "PEN",
      "PLN",
      "RUB",
      "THB",
      "TRY",
      "TWD",
      "UAH",
      "VND",
      "ZAR",
    ])
    .optional()
    .describe("Supported three-letter ISO 4217 currency code."),
  nextBilledAt: z.string().optional().describe("RFC 3339 datetime string."),
  discount: z
    .object({
      id: z.string().describe("Paddle ID of the discount, prefixed with `dsc_`."),
      effectiveFrom: z.enum(["next_billing_period", "immediately"]).describe("When this discount should be applied from. Defaults to `next_billing_period` for active subscriptions, which creates a `scheduled_change` to apply the discount at the end of the billing period."),
    })
    .optional()
    .describe(
      "Details of the discount applied to this subscription. Include to add a discount to a subscription. `null` to remove a discount.",
    ),
  collectionMode: z
    .enum(["automatic", "manual"])
    .optional()
    .describe(
      "How payment is collected for transactions created for this subscription. `automatic` for checkout, `manual` for invoices.",
    ),
  billingDetails: z
    .object({
      enableCheckout: z.boolean().describe("Whether the related transaction may be paid using Paddle Checkout."),
      purchaseOrderNumber: z.string().describe("Customer purchase order number. Appears on invoice documents."),
      additionalInformation: z
        .string()
        .describe("Notes or other information to include on this invoice. Appears on invoice documents."),
      paymentTerms: z
        .object({
          interval: z.enum(["day", "week", "month", "year"]).describe("Unit of time."),
          frequency: z.number().describe("Amount of time."),
        })
        .describe("How long a customer has to pay this invoice once issued."),
    })
    .optional()
    .describe(
      "Details for invoicing. Required if `collectionMode` is `manual`. `null` if changing `collectionMode` to `automatic`.",
    ),
  scheduledChange: z
    .null()
    .optional()
    .describe(
      "Set to `null` to remove a scheduled change applied to a subscription. Pause the subscription, cancel the subscription, and resume the subscription to create scheduled changes instead.",
    ),
  items: z
    .array(
      z.object({
        priceId: z.string().describe("Unique Paddle ID for this price, prefixed with `pri_`."),
        quantity: z
          .number()
          .describe(
            "Quantity of this item to add to the subscription. If updating an existing item and not changing the quantity, omit `quantity`.",
          ),
      }),
    )
    .optional()
    .describe(
      "List of items on this subscription. Only recurring items may be added. Send the complete list of items that should be on this subscription, including existing items to retain.",
    ),
  customData: z.record(z.any(), z.any()).optional().describe("Any structured custom key-value data needed outside of Paddle's standard fields. Occasionally used by third-parties."),
  prorationBillingMode: z
    .enum([
      "prorated_immediately",
      "prorated_next_billing_period",
      "full_immediately",
      "full_next_billing_period",
      "do_not_bill",
    ])
    .optional()
    .describe(
      "How Paddle should handle proration calculation for changes made to a subscription or its items. Required when making changes that impact billing. For automatically-collected subscriptions, responses may take longer than usual if a proration billing mode that collects for payment immediately is used.",
    ),
  onPaymentFailure: z
    .enum(["prevent_change", "apply_change"])
    .optional()
    .describe(
      "How Paddle should handle changes made to a subscription or its items if the payment fails during update. If omitted, defaults to `prevent_change`.",
    ),
});

export const listSubscriptionsParameters = z.object({
  addressId: z
    .array(z.string())
    .optional()
    .describe(
      "Return entities related to the specified address. Use a comma-separated list to specify multiple address IDs.",
    ),
  after: z
    .string()
    .optional()
    .describe(
      "Return entities after the specified Paddle ID when working with paginated endpoints.",
    ),
  collectionMode: z
    .enum(["automatic", "manual"])
    .optional()
    .describe("Return entities that match the specified collection mode."),
  customerId: z
    .array(z.string())
    .optional()
    .describe(
      "Return entities related to the specified customer. Use a comma-separated list to specify multiple customer IDs.",
    ),
  id: z
    .array(z.string())
    .optional()
    .describe("Return only the IDs specified. Use a comma-separated list to get multiple entities."),
  orderBy: z
    .enum(["id[ASC]", "id[DESC]"])
    .optional()
    .describe(
      "Order returned entities by the specified field and direction.",
    ),
  perPage: z
    .number()
    .optional()
    .describe(
      "Set how many entities are returned per page. Returns the maximum number of results if a number greater than the maximum is requested.",
    ),
  priceId: z
    .array(z.string())
    .optional()
    .describe(
      "Return entities related to the specified price. Use a comma-separated list to specify multiple price IDs.",
    ),
  scheduledChangeAction: z
    .array(z.enum(["cancel", "pause", "resume"]))
    .optional()
    .describe(
      "Return subscriptions that have a scheduled change. Use a comma-separated list to specify multiple scheduled change actions.",
    ),
  status: z
    .array(z.enum(["active", "canceled", "past_due", "paused", "trialing"]))
    .optional()
    .describe(
      "Return entities that match the specified status. Use a comma-separated list to specify multiple status values.",
    ),
});

export const cancelSubscriptionParameters = z.object({
  subscriptionId: z.string().describe("Paddle ID of the subscription."),
  effectiveFrom: z
    .enum(["next_billing_period", "immediately"])
    .optional()
    .describe(
      "When this subscription change should take effect from. Defaults to `next_billing_period` for active subscriptions, which creates a `scheduled_change` to apply the subscription change at the end of the billing period.",
    ),
});

export const pauseSubscriptionParameters = z.object({
  subscriptionId: z.string().describe("Paddle ID of the subscription."),
  effectiveFrom: z
    .enum(["next_billing_period", "immediately"])
    .optional()
    .describe(
      "When this subscription change should take effect from. Defaults to `next_billing_period` for active subscriptions, which creates a `scheduled_change` to apply the subscription change at the end of the billing period.",
    ),
  resumeAt: z
    .string()
    .optional()
    .describe(
      "RFC 3339 datetime string of when the paused subscription should resume. Omit to pause indefinitely until resumed.",
    ),
  onResume: z
    .enum(["continue_existing_billing_period", "start_new_billing_period"])
    .optional()
    .describe(
      "How Paddle should set the billing period for the subscription when resuming. If omitted, defaults to `start_new_billing_period`.",
    ),
});

export const resumeSubscriptionParameters = z.object({
  subscriptionId: z.string().describe("Paddle ID of the subscription."),
  effectiveFrom: z.string().describe("RFC 3339 datetime string."),
  onResume: z
    .enum(["continue_existing_billing_period", "start_new_billing_period"])
    .optional()
    .describe(
      "How Paddle should set the billing period for the subscription when resuming. If omitted, defaults to `start_new_billing_period`.",
    ),
});

export const activateSubscriptionParameters = z.object({
  subscriptionId: z.string().describe("Paddle ID of the subscription."),
});

export const previewSubscriptionUpdateParameters = z.object({
  subscriptionId: z.string().describe("Paddle ID of the subscription."),
  customerId: z.string().optional().describe("Unique Paddle ID for this customer entity, prefixed with `ctm_`."),
  addressId: z.string().optional().describe("Unique Paddle ID for this address entity, prefixed with `add_`."),
  businessId: z
    .string()
    .optional()
    .describe(
      "Paddle ID of the business that this subscription is for, prefixed with `biz_`. Include to change the business for a subscription.",
    ),
  currencyCode: z
    .enum([
      "USD",
      "EUR",
      "GBP",
      "JPY",
      "AUD",
      "CAD",
      "CHF",
      "HKD",
      "SGD",
      "SEK",
      "ARS",
      "BRL",
      "CLP",
      "CNY",
      "COP",
      "CZK",
      "DKK",
      "HUF",
      "ILS",
      "INR",
      "KRW",
      "MXN",
      "NOK",
      "NZD",
      "PEN",
      "PLN",
      "RUB",
      "THB",
      "TRY",
      "TWD",
      "UAH",
      "VND",
      "ZAR",
    ])
    .optional()
    .describe("Supported three-letter ISO 4217 currency code."),
  nextBilledAt: z.string().optional().describe("RFC 3339 datetime string."),
  discount: z
    .object({
      id: z.string().describe("Paddle ID of the discount, prefixed with `dsc_`."),
      effectiveFrom: z.enum(["next_billing_period", "immediately"]).describe("When this discount should be applied from. Defaults to `next_billing_period` for active subscriptions, which creates a `scheduled_change` to apply the discount at the end of the billing period."),
    })
    .optional()
    .describe(
      "Details of the discount applied to this subscription. Include to add a discount to a subscription. `null` to remove a discount.",
    ),
  collectionMode: z
    .enum(["automatic", "manual"])
    .optional()
    .describe(
      "How payment is collected for transactions created for this subscription. `automatic` for checkout, `manual` for invoices.",
    ),
  billingDetails: z
    .object({
      enableCheckout: z.boolean().describe("Whether the related transaction may be paid using Paddle Checkout."),
      purchaseOrderNumber: z.string().describe("Customer purchase order number. Appears on invoice documents."),
      additionalInformation: z
        .string()
        .describe("Notes or other information to include on this invoice. Appears on invoice documents."),
      paymentTerms: z
        .object({
          interval: z.enum(["day", "week", "month", "year"]).describe("Unit of time."),
          frequency: z.number().describe("Amount of time."),
        })
        .describe("How long a customer has to pay this invoice once issued."),
    })
    .optional()
    .describe(
      "Details for invoicing. Required if `collectionMode` is `manual`. `null` if changing `collectionMode` to `automatic`.",
    ),
  scheduledChange: z
    .null()
    .optional()
    .describe(
      "Set to `null` to remove a scheduled change applied to a subscription. Pause the subscription, cancel the subscription, and resume the subscription to create scheduled changes instead.",
    ),
  items: z
    .array(
      z.object({
        priceId: z.string().describe("Unique Paddle ID for this price, prefixed with `pri_`."),
        quantity: z
          .number()
          .describe(
            "Quantity of this item to add to the subscription. If updating an existing item and not changing the quantity, omit `quantity`.",
          ),
      }),
    )
    .optional()
    .describe(
      "List of items on this subscription. Only recurring items may be added. Send the complete list of items that should be on this subscription, including existing items to retain.",
    ),
  customData: z.record(z.any(), z.any()).optional().describe("Any structured custom key-value data needed outside of Paddle's standard fields. Occasionally used by third-parties."),
  prorationBillingMode: z
    .enum([
      "prorated_immediately",
      "prorated_next_billing_period",
      "full_immediately",
      "full_next_billing_period",
      "do_not_bill",
    ])
    .optional()
    .describe(
      "How Paddle should handle proration calculation for changes made to a subscription or its items. Required when making changes that impact billing. For automatically-collected subscriptions, responses may take longer than usual if a proration billing mode that collects for payment immediately is used.",
    ),
  onPaymentFailure: z
    .enum(["prevent_change", "apply_change"])
    .optional()
    .describe(
      "How Paddle should handle changes made to a subscription or its items if the payment fails during update. If omitted, defaults to `prevent_change`.",
    ),
});

export const createSubscriptionChargeParameters = z.object({
  subscriptionId: z.string().describe("Paddle ID of the subscription."),
  effectiveFrom: z.enum(["next_billing_period", "immediately"]).describe("When one-time charges should be billed."),
  items: z
    .array(
      z.object({
        quantity: z.number().describe("Quantity to bill for."),
        priceId: z.string().describe("Unique Paddle ID for this price, prefixed with `pri_`."),
      }),
    )
    .describe(
      "List of one-time charges to bill for. Only prices where the `billingCycle` is `null` may be added. Charge for items that have been added to the catalog by passing the Paddle ID of an existing price entity, or charge for non-catalog items by passing a price object. Non-catalog items can be for existing products, or pass a product object as part of the price to charge for a non-catalog product.",
    ),
  onPaymentFailure: z
    .enum(["prevent_change", "apply_change"])
    .optional()
    .describe(
      "How Paddle should handle changes made to a subscription or its items if the payment fails during update. If omitted, defaults to `prevent_change`.",
    ),
});

export const previewSubscriptionChargeParameters = z.object({
  subscriptionId: z.string().describe("Paddle ID of the subscription."),
  effectiveFrom: z.enum(["next_billing_period", "immediately"]).describe("When one-time charges should be billed."),
  items: z
    .array(
      z.object({
        quantity: z.number().describe("Quantity to bill for."),
        priceId: z.string().describe("Unique Paddle ID for this price, prefixed with `pri_`."),
      }),
    )
    .describe(
      "List of one-time charges to bill for. Only prices where the `billingCycle` is `null` may be added. Charge for items that have been added to the catalog by passing the Paddle ID of an existing price entity, or charge for non-catalog items by passing a price object. Non-catalog items can be for existing products, or pass a product object as part of the price to charge for a non-catalog product.",
    ),
  onPaymentFailure: z
    .enum(["prevent_change", "apply_change"])
    .optional()
    .describe(
      "How Paddle should handle changes made to a subscription or its items if the payment fails during update. If omitted, defaults to `prevent_change`.",
    ),
});

export const listReportsParameters = z.object({
  after: z
    .string()
    .optional()
    .describe(
      "Return entities after the specified Paddle ID when working with paginated endpoints.",
    ),
  orderBy: z
    .enum(["id[ASC]", "id[DESC]"])
    .optional()
    .describe(
      "Order returned entities by the specified field and direction.",
    ),
  perPage: z
    .number()
    .optional()
    .describe(
      "Set how many entities are returned per page. Returns the maximum number of results if a number greater than the maximum is requested.",
    ),
  status: z
    .array(z.enum(["pending", "ready", "failed", "expired"]))
    .optional()
    .describe(
      "Return entities that match the specified status. Use a comma-separated list to specify multiple status values.",
    ),
});

export const createReportParameters = z.object({
  type: z.enum([
    "adjustments", "adjustment_line_items", "transactions", "transaction_line_items", "products_prices", "discounts"]).describe("Type of report to create."),
  filters: z
    .array(
      z.object({
        name: z.enum([
          "action",
          "collection_mode",
          "currency_code",
          "origin",
          "status",
          "updated_at",
          "type",
          "product_status",
          "price_status",
          "product_type",
          "price_type",
          "product_updated_at",
          "price_updated_at"
        ]).describe("Field name to filter by."),
        operator: z
          .enum(["lt", "gte"])
          .optional()
          .describe("Operator to use when filtering. Valid when filtering by `updated_at`, `null` otherwise."),
        value: z
          .union([z.string(), z.array(z.string())])
          .describe(
            "Value to filter by.",
          ),
      }),
    )
    .optional()
    .describe(
      "Filter criteria for this report. If omitted, reports are filtered to include data updated in the last 30 days. This means `updated_at` is greater than or equal to (`gte`) the date 30 days ago from the time the report was generated.",
    ),
});

export const getReportCsvParameters = z.object({
  reportId: z.string().describe("Paddle ID of the report."),
});

export const getReportParameters = z.object({
  reportId: z.string().describe("Paddle ID of the report."),
});

export const listClientSideTokensParameters = z.object({
  after: z
    .string()
    .optional()
    .describe("Return entities after the specified Paddle ID when working with paginated endpoints."),
  orderBy: z
    .enum(["id[ASC]", "id[DESC]"])
    .optional()
    .describe("Order returned entities by the specified field and direction."),
  perPage: z
    .number()
    .optional()
    .describe("Set how many entities are returned per page. Returns the maximum number of results if a number greater than the maximum is requested."),
  status: z
    .array(z.enum(["active", "revoked"]))
    .optional()
    .describe("Return entities that match the specified status. Use a comma-separated list to specify multiple status values."),
});

export const createClientSideTokenParameters = z.object({
  name: z.string().describe("Name of this client-side token."),
  description: z
    .string()
    .optional()
    .describe("Short description for this client-side token."),
});

export const getClientSideTokenParameters = z.object({
  clientTokenId: z.string().describe("Paddle ID of the client-side token."),
});

export const revokeClientSideTokenParameters = z.object({
  clientTokenId: z.string().describe("Paddle ID of the client-side token."),
});
