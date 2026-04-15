const checkBeforeWarning = `
Don't use this tool without checking with the user first. Avoid using before gaining explicit approval.
`;

const additionalDetailsWarning = `
Ensure you have all the information needed before making the call. Don't fabricate, imagine, or infer details and parameter values unless explicitly asked to. If anything is ambiguous, unknown, or unclear, ask the user for clarification or details before you proceed.
`;

const metricsDateRangeGuidance = `
Pass both from and to as RFC 3339 full date strings. Dates are interpreted at 00:00 UTC.
Choose a date range that matches the reporting window the user is asking for.
`;

const metricsEnvironmentGuidance = `
IMPORTANT: This tool only works with production (live) accounts. It will not return data for sandbox environments.
`;

const metricsReportsGuidance = `
Metrics and reports:
- Reports export entity-level historical data as CSV. Use them for audits, reconciliation, spreadsheets, and lists of individual transactions, refunds, discounts, or products.
- Metrics return aggregated timeseries data directly in the API response. Use metrics tools instead for trend questions, dashboard summaries, and aggregate performance over time.
Rule of thumb: if the user wants a list of rows, use a report. If they want a trend or headline figure, use a metrics tool.
`;

export const listProductsPrompt = `
This tool will list products in the account's catalog.

Use the maximum perPage by default (200) to ensure comprehensive results.
Filter products by id, status, taxCategory, and type as needed.
Results are paginated - use the 'after' parameter with the last ID from previous results to get the next page.
Sort and order results using the orderBy parameter.
Amounts are in the smallest currency unit (e.g., cents).

Use the include parameter to include related entities in the response:

- prices: An array of price entities tied to the product.
`;

export const createProductPrompt = `
This tool will create a new product in Paddle.

Product entities describe the items that customers can purchase. Products work with prices, which describe how much a product costs and how often it's billed.

For imageUrl, images must be hosted on an HTTPS server that's publicly accessible. Paddle doesn't upload product images to a CDN. It's recommended to use square images (1:1 ratio).

When selecting a taxCategory, choose the one that best describes the product:

- digital-goods: Non-customizable digital files or media (not software) acquired with an up front payment that can be accessed without any physical product being delivered.
- ebooks: Digital books and educational material which is sold with permanent rights for use by the customer.
- implementation-services: Remote configuration, set-up, and integrating software on behalf of a customer.
- professional-services: Services that involve the application of expertise and specialized knowledge of a software product.
- saas: Products that allow users to connect to and use online or cloud-based applications over the Internet.
- software-programming-services: Services that can be used to customize and white label software products.
- standard: Software products that are pre-written and can be downloaded and installed onto a local device.
- training-services: Training and education services related to software products.
- website-hosting: Cloud storage service for personal or corporate information, assets, or intellectual property.

The tax category affects how taxes are calculated in different jurisdictions. Choose carefully as it impacts customers' tax rates.
When using the standard tax category, remind the user to review the tax category in the Paddle dashboard.

${additionalDetailsWarning}

If successful, the response includes a copy of the new product entity. Once a product has been created, relate it to a price.
`;

export const getProductPrompt = `
This tool will retrieve a product from Paddle by its ID.

Use the include parameter to include related entities in the response:

- prices: An array of price entities available for the product.
`;

export const updateProductPrompt = `
This tool will update a product in Paddle by its ID.

Paddle doesn't upload product images to a CDN. For imageUrl, images must be hosted on an HTTPS server that's publicly accessible. Square images (1:1 ratio) are recommended.

When selecting type, choose the one that best describes the use case:

- custom: Non-catalog item. Typically created for a specific transaction or subscription. Not returned when listing or shown in the Paddle dashboard.
- standard: Standard item. Can be considered part of the catalog and reused across transactions and subscriptions easily.

When selecting taxCategory, choose the one that best describes the product:

- digital-goods: Non-customizable digital files or media (not software) acquired with an up front payment that can be accessed without any physical product being delivered.
- ebooks: Digital books and educational material which is sold with permanent rights for use by the customer.
- implementation-services: Remote configuration, set-up, and integrating software on behalf of a customer.
- professional-services: Services that involve the application of expertise and specialized knowledge of a software product.
- saas: Products that allow users to connect to and use online or cloud-based applications over the Internet.
- software-programming-services: Services that can be used to customize and white label software products.
- standard: Software products that are pre-written and can be downloaded and installed onto a local device.
- training-services: Training and education services related to software products.
- website-hosting: Cloud storage service for personal or corporate information, assets, or intellectual property.

The tax category affects how taxes are calculated in different jurisdictions. Choose carefully as it impacts customers' tax rates.
When using the standard tax category, remind the user to review the tax category in the Paddle dashboard.

${additionalDetailsWarning}

If successful, the response includes a copy of the updated product entity.
`;

export const listPricesPrompt = `
This tool will list prices in the account's catalog.

Use the maximum perPage by default (200) to ensure comprehensive results.
Filter prices by id, productId, status, recurring, and type as needed.
Results are paginated - use the 'after' parameter with the last ID from previous results to get the next page.
Sort and order results using the orderBy parameter.
Amounts are in the smallest currency unit (e.g., cents).

Use the include parameter to include related entities in the response:

- product: An object for the product entity that's tied to the price.
`;

export const createPricePrompt = `
This tool will create a new price in Paddle.

Prices describe how to charge for products. Always include a productId in the request to relate the price to a product.

If the quantity object is omitted, Paddle automatically sets a minimum of 1 and a maximum of 100. This means the most units that a customer can buy is 100. Set a quantity to offer a different amount.

When selecting type, choose the one that best describes the use case:

- custom: Non-catalog item. Typically created for a specific transaction or subscription. Not returned when listing or shown in the Paddle dashboard.
- standard: Standard item. Can be considered part of the catalog and reused across transactions and subscriptions easily.

When selecting taxMode, choose the one that best describes how the tax should be calculated for the price:

- account_setting: Price uses the setting from the account. Default.
- external: Price is exclusive of tax. Common in European countries.
- internal: Price is inclusive of tax. Common in countries like the United States and Canada.

When using unitPriceOverrides:
- Group countries based on purchasing power parity (PPP), not just currency zones
- Create separate overrides for countries with different economic conditions even if they share the same currency (e.g., Greece and Ireland should have different price points)
- Adjust prices relative to local economic conditions - higher in wealthy markets, lower in developing economies
- For optimal conversion rates, set prices using local market research and willingness-to-pay data
- Use local currencies where preferred by the customer

Example unitPriceOverrides structure:
[
  {
    "countryCodes": ["GB"],
    "unitPrice": {
      "amount": "8500",
      "currencyCode": "GBP"
    }
  },
  {
    "countryCodes": ["IE"],
    "unitPrice": {
      "amount": "9500",
      "currencyCode": "EUR"
    }
  },
  {
    "countryCodes": ["GR"],
    "unitPrice": {
      "amount": "6500",
      "currencyCode": "EUR"
    }
  },
  {
    "countryCodes": ["IN"],
    "unitPrice": {
      "amount": "30000",
      "currencyCode": "INR"
    }
  },
  {
    "countryCodes": ["CN"],
    "unitPrice": {
      "amount": "20000",
      "currencyCode": "CNY"
    }
  }
]

${additionalDetailsWarning}

If successful, the response includes a copy of the new price entity.
`;

export const getPricePrompt = `
This tool will retrieve a price from Paddle by its ID.

Use the include parameter to include related entities in the response:

- product: An object for the product entity tied to the price.
`;

export const updatePricePrompt = `
This tool will update a price in Paddle by its ID.

When selecting type, choose the one that best describes the use case:

- custom: Non-catalog item. Typically created for a specific transaction or subscription. Not returned when listing or shown in the Paddle dashboard.
- standard: Standard item. Can be considered part of the catalog and reused across transactions and subscriptions easily.

When selecting taxMode, choose the one that best describes how the tax should be calculated for the price:

- account_setting: Price uses the setting from the account. Default.
- external: Price is exclusive of tax. Common in European countries.
- internal: Price is inclusive of tax. Common in countries like the United States and Canada.

When using unitPriceOverrides:
- Group countries based on purchasing power parity (PPP), not just currency zones
- Create separate overrides for countries with different economic conditions even if they share the same currency (e.g., Greece and Ireland should have different price points)
- Adjust prices relative to local economic conditions - higher in wealthy markets, lower in developing economies
- For optimal conversion rates, set prices using local market research and willingness-to-pay data
- Use local currencies where preferred by the customer

Example unitPriceOverrides structure:
[
  {
    "countryCodes": ["GB"],
    "unitPrice": {
      "amount": "8500",
      "currencyCode": "GBP"
    }
  },
  {
    "countryCodes": ["IE"],
    "unitPrice": {
      "amount": "9500",
      "currencyCode": "EUR"
    }
  },
  {
    "countryCodes": ["GR"],
    "unitPrice": {
      "amount": "6500",
      "currencyCode": "EUR"
    }
  },
  {
    "countryCodes": ["IN"],
    "unitPrice": {
      "amount": "30000",
      "currencyCode": "INR"
    }
  },
  {
    "countryCodes": ["CN"],
    "unitPrice": {
      "amount": "20000",
      "currencyCode": "CNY"
    }
  }
]

${additionalDetailsWarning}

If successful, the response includes a copy of the updated price entity.
`;

export const listTransactionsPrompt = `
This tool will list transactions in Paddle.

Use the maximum perPage by default (30) to ensure comprehensive results.
Filter transactions by billedAt, collectionMode, createdAt, customerId, id, invoiceNumber, origin, status, subscriptionId, and updatedAt as needed.
Results are paginated - use the 'after' parameter with the last ID from previous results to get the next page.
Sort and order results using the orderBy parameter.
Amounts are in the smallest currency unit (e.g., cents).

Use the include parameter to include related entities in the response:

- address: An object for the address entity related to this transaction. Only returned if an address is set against the transaction.
- adjustments: An array of adjustment entities related to this transaction. Only returned if adjustments have been created against the transaction.
- adjustments_totals: An object containing totals for all adjustments on a transaction. Only returned if adjustments have been created against the transaction.
- available_payment_methods: An array of payment methods that are available to use for this transaction. 
- business: An object for the business entity related to this transaction. Only returned if a business is set against the transaction.
- customer: An object for the customer entity related to this transaction. Only returned if a customer is set against the transaction.
- discount: An object for the discount entity related to this transaction. Only returned if a discount is set against the transaction.

Transactions have a collectionMode that determines how Paddle tries to collect for payment:

- automatic: Payment is collected automatically using a checkout initially, then using a payment method on file.
- manual: Payment is collected manually. Customers are sent an invoice with payment terms and can make a payment offline or using a checkout. Requires billingDetails.

Transactions have a status that determines the current state of the transaction:

- draft: Transaction is missing required fields. Typically the first stage of a checkout before customer details are captured.
- ready: Transaction has all of the required fields to be marked as billed or completed.
- billed: Transaction has been updated to billed. Billed transactions get an invoice number and are considered a legal record. They can't be changed. Typically used as part of an invoice workflow.
- paid: Transaction is fully paid, but has not yet been processed internally.
- completed: Transaction is fully paid and processed.
- canceled: Transaction has been updated to canceled. If an invoice, it's no longer due.
- past_due: Transaction is past due. Occurs for automatically-collected transactions when the related subscription is in dunning, and for manually-collected transactions when payment terms have elapsed.
`;

export const createTransactionPrompt = `
This tool will create a new transaction in Paddle.

${checkBeforeWarning}

The collectionMode against a transaction determines how Paddle tries to collect for payment:

- Manually-collected transactions are for sales-assisted billing. Paddle sends an invoice to the customer when a transaction is billed. Payment is often by wire transfer. Requires billingDetails, and an address which has country, postalCode, region, city, and firstLine.
- Automatically-collected transactions are for payments collected automatically using a self-serve checkout where payment is collected using a checkout. Pass the transaction to a checkout or use the returned checkout.url to collect for payment. checkout.url is a unique Paddle payment link composed of the URL passed as checkout.url, or the default payment URL on the account, with ?_ptxn= and the Paddle ID for this transaction appended to the URL.

Transactions have a status. Set the status or omit it to have Paddle set it. It's only recommended to set the status manually if working with manually-collected transactions as part of an invoicing workflow. Options are:

- billed: Marks as finalized and can't be updated, only canceled. This is essentially issuing an invoice. At this point, it becomes a legal record so it can't be changed. Paddle automatically assigns an invoice number, creates a related subscription, and sends it to the customer.
- canceled: Canceled transactions are no longer due. This is only for record purposes on creation.

When status is omitted, transactions are initially created with the status of draft or ready:

- Draft transactions have items against them, but don't have all of the required fields for billing. Paddle creates draft transactions automatically when a checkout is opened.
- Paddle automatically marks transactions as ready when all of the required fields are present for billing. This includes customerId and addressId for automatically-collected transactions, and billingDetails for manually-collected transactions.

When a transaction has items which are recurring, and the transaction has a status of billed when manually-collected or completed when automatically-collected, Paddle automatically creates a related subscription for the items on the transaction. Use the returned subscriptionId to get the subscription entity.

Use the include parameter to include related entities in the response:

- address: An object for the address entity related to this transaction. Only returned if an address is set against the transaction with addressId.
- available_payment_methods: An array of payment methods that are available to use for this transaction. 
- business: An object for the business entity related to this transaction. Only returned if a business is set against the transaction with businessId.
- customer: An object for the customer entity related to this transaction. Only returned if a customer is set against the transaction with customerId.
- discount: An object for the discount entity related to this transaction. Only returned if a discount is set against the transaction with discount or discountId.

${additionalDetailsWarning}

Consider using the preview_transaction_create tool to preview and confirm the transaction before creating it.

If successful, the response includes a copy of the new transaction entity.
`;

export const previewPricesPrompt = `
This tool will preview price calculations for one or more prices.

Consider using the preview_transaction_create tool for more advanced and accurate pricing calculations or for all manually-collected invoiced transactions.

Providing location information when previewing prices allows Paddle to calculate tax or automatically localize prices. Provide one of the following:

- customer_ip_address: Paddle fetches location using the IP address to calculate totals.
- address: Paddle uses the country and ZIP code (where supplied) to calculate totals.
- customerId, addressId, businessId: Paddle uses existing customer data to calculate totals. Typically used for logged-in customers.

Each line item includes formattedUnitTotals and formattedTotals objects that return totals formatted for the country or region being worked with, including the currency symbol.

If successful, the response includes the data sent with a details object that includes totals for the supplied prices.
`;

export const previewTransactionCreatePrompt = `
This tool will preview a transaction without creating a transaction entity.

Consider using the preview_prices tool for simpler pricing calculations where payment is often taken through checkout.

Providing location information when previewing a transaction allows Paddle to calculate tax or automatically localize prices. Provide one of the following:

- customer_ip_address: Paddle fetches location using the IP address to calculate totals.
- address: Paddle uses the country and ZIP code (where supplied) to calculate totals.
- customerId, addressId, businessId: Paddle uses existing customer data to calculate totals. Typically used for logged-in customers.

Exclude items from the total calculation using the includeInTotals boolean.

By default, recurring items with trials are considered to have a zero charge when previewing. Set ignoreTrials to true to ignore trial periods against prices for transaction preview calculations.

Transaction previews don't create transactions, so no id is returned.

If successful, the response includes the data sent with a details object that includes totals for the supplied prices.
`;

export const getTransactionPrompt = `
This tool will retrieve a transaction from Paddle by its ID.

Use the include parameter to include related entities in the response:

- address: An object for the address entity related to this transaction. Only returned if an address is set against the transaction.
- adjustments: An array of adjustment entities related to this transaction. Only returned if adjustments have been created against the transaction.
- adjustments_totals: An object containing totals for all adjustments on a transaction. Only returned if adjustments have been created against the transaction.
- available_payment_methods: An array of payment methods that are available to use for this transaction. 
- business: An object for the business entity related to this transaction. Only returned if a business is set against the transaction.
- customer: An object for the customer entity related to this transaction. Only returned if a customer is set against the transaction.
- discount: An object for the discount entity related to this transaction. Only returned if a discount is set against the transaction.

Transactions have a collectionMode that determines how Paddle tries to collect for payment:

- automatic: Payment is collected automatically using a checkout initially, then using a payment method on file.
- manual: Payment is collected manually. Customers are sent an invoice with payment terms and can make a payment offline or using a checkout. Requires billingDetails.

Transactions have a status that determines the current state of the transaction:

- draft: Transaction is missing required fields. Typically the first stage of a checkout before customer details are captured.
- ready: Transaction has all of the required fields to be marked as billed or completed.
- billed: Transaction has been updated to billed. Billed transactions get an invoice number and are considered a legal record. They can't be changed. Typically used as part of an invoice workflow.
- paid: Transaction is fully paid, but has not yet been processed internally.
- completed: Transaction is fully paid and processed.
- canceled: Transaction has been updated to canceled. If an invoice, it's no longer due.
- past_due: Transaction is past due. Occurs for automatically-collected transactions when the related subscription is in dunning, and for manually-collected transactions when payment terms have elapsed.
`;

export const updateTransactionPrompt = `
This tool will update a transaction in Paddle by its ID.

${checkBeforeWarning}

Update transactions that are draft or ready. billed and completed transactions are considered records for tax and legal purposes, so they can't be changed. Either:

- Create an adjustment to record a refund or credit for a transaction.
- Cancel a billed transaction by sending a PATCH request to set status to canceled.

Only set the status manually if working with manually-collected transactions as part of an invoicing workflow. Options are:

- billed: Marks as finalized and can't be updated, only canceled. This is essentially issuing an invoice. At this point, it becomes a legal record so it can't be changed. Paddle automatically assigns an invoice number, creates a related subscription, and sends it to the customer.
- canceled: Canceled transactions are no longer due.

All other statuses (draft, ready, paid, completed, past_due) are set automatically by Paddle.

When making changes to items on a transaction, send the complete list of items that should be on a transaction — including existing items. For each item, send an object containing priceId and quantity. Paddle responds with the full price object for each item.

The collectionMode of a transaction can be changed to change how Paddle tries to collect for payment. Options are:

- automatic: Payment is collected automatically using a checkout initially, then using a payment method on file.
- manual: Payment is collected manually. Customers are sent an invoice with payment terms and can make a payment offline or using a checkout. Requires billingDetails.

If changing the collection mode from automatic to manual, always first:

- Check the customer associated to the subscription has a name. If not, get and then set a name on the customer.
- Check the customer has an address. If not, get and then set an address for the customer with a country, postalCode, region, city, and firstLine.
- Check the currencyCode of the subscription is USD, GBP, or EUR. If not, get which currency is preferred and then change the currency of the subscription to the preferred currency.

${additionalDetailsWarning}

If successful, the response includes a copy of the updated transaction entity.
`;

export const reviseTransactionPrompt = `
This tool will revise customer information for a billed or completed transaction where the customer information is incorrect and needs to be rectified on invoice documents generated by Paddle.

${checkBeforeWarning}

Details that don't impact the tax rates on a transaction can be revised. This includes:

- Customer name
- Business name and tax or VAT number (taxIdentifier)
- Address details, apart from the country

Removing a valid tax or VAT number isn't possible, only replacing it with another valid one. If a valid tax or VAT number is added, Paddle automatically creates an adjustment to refund any tax where applicable.

Transactions can only be revised once.

Only the customer information for this transaction is updated. The related customer, address, and business entities aren't updated.

${additionalDetailsWarning}

If successful, the response includes a copy of the transaction entity. Get a transaction using the include parameter with the customer, address, and business values to see the revised customer information.
`;

export const listAdjustmentsPrompt = `
This tool will list adjustments in Paddle.

Use the maximum perPage by default (50) to ensure comprehensive results.
Filter adjustments by action, customerId, status, subscriptionId, transactionId, and id as needed.
Results are paginated - use the 'after' parameter with the last ID from previous results to get the next page.
Sort and order results using the orderBy parameter.

Amounts are in the smallest currency unit (e.g., cents).

Adjustments have an action that determines how the adjustment impacts the related transaction:

- credit: Credits some or all the related transaction. Can be created manually.
- refund: Refunds some or all the related transaction. Must be approved by Paddle in most cases. Can be created manually.
- chargeback: Chargeback for the related transaction. Automatically created by Paddle when a customer successfully disputes a charge.
- chargeback_reverse: Reversal of a chargeback for the related transaction. Automatically created by Paddle when Paddle contests a chargeback successfully.
- chargeback_warning: Warning of an upcoming chargeback for the related transaction. Automatically created by Paddle.
- chargeback_warning_reverse: Reversal of a chargeback warning for the related transaction. Automatically created by Paddle.
- credit_reverse: Reversal of a credit for the related transaction. Automatically created by Paddle.
`;

export const createAdjustmentPrompt = `
This tool will create an adjustment to refund or credit all or part of a transaction and its items. 

Billed transactions are considered financial records for tax and legal purposes, so they can't be changed. Adjustments record actions that impact revenue for a transaction after it's been billed.

${checkBeforeWarning}

The transaction ID and the IDs of any transaction items (details.lineItems[].id) are required to create a refund or credit.

An adjustment can have an action of credit or refund:

- Refunds return an amount to a customer's original payment method. Create refund adjustments for transactions that are completed.
- Credits reduce the amount that a customer has to pay for a transaction. Create credit adjustments for manually-collected transactions that are billed or past_due.

Most refunds for live accounts are created with the status of pending_approval until reviewed by Paddle, but some are automatically approved. For sandbox accounts, Paddle automatically approves refunds every ten minutes.

Other action types (chargeback, chargeback_reverse, chargeback_warning, chargeback_warning_reverse, credit_reverse) are automatically created by Paddle and can't be set manually.

Adjustments can apply to some or all items on a transaction by defining the type:

- full: The grand total for the related transaction is adjusted.
- partial: Some line items for the related transaction are adjusted. Requires items.

When selecting taxMode, choose the one that best describes how the tax should be calculated for the adjustment:

- external: Amounts are exclusive of tax. Common in European countries.
- internal: Amounts are inclusive of tax. Common in countries like the United States and Canada.

Creating an adjustment for a transaction that has a refund that's pending approval isn't possible.

${additionalDetailsWarning}

If successful, the response includes a copy of the new adjustment entity.
`;

export const getAdjustmentCreditNotePrompt = `
This tool will retrieve a link to a credit note PDF for an adjustment from Paddle.

Credit note PDFs are created for refunds and credits as a record of an adjustment. Return this if record is needed to be given to the customer immediately after the adjustment is created.

The link returned is not a permanent link. It expires after an hour.
`;

export const listCreditBalancesPrompt = `
This tool will list credit balances in each currency for a customer.

Credit balances are created automatically by Paddle when a customer takes an action that results in Paddle creating a credit for a customer, like making prorated changes to a subscription. These are transaction credits, not promotional credits like from discounts.

Each balance has three totals:

- available: Total available to use.
- reserved: Total temporarily reserved for billed transactions.
- used: Total amount of credit used.

Credit is added to the available total initially. When used, it moves to the used total.

The reserved total is used when a credit balance is applied to a transaction that's marked as billed, like when working with an issued invoice. It's not available for other transactions at this point, but isn't considered used until the transaction is completed. If a billed transaction is canceled, any reserved credit moves back to available.

A credit balance can only be used for transactions in the same currency.

Adding to a credit balance directly isn't possible. Create a credit adjustment with the create_adjustment tool to reduce the amount due to pay for a transaction instead.

Filter credit balances by currencyCode as needed.
Amounts are in the smallest currency unit (e.g., cents).

The response isn't paginated. An empty array is returned if a customer has no credit balances.
`;

export const listCustomersPrompt = `
This tool will list customers in Paddle.

Use the maximum perPage by default (200) to ensure comprehensive results.
Filter customers by email, id, search (fuzzy search on the customer's name), and status as needed.
Results are paginated - use the 'after' parameter with the last ID from previous results to get the next page.
Sort and order results using the orderBy parameter.
`;

export const createCustomerPrompt = `
This tool will create a new customer in Paddle.

Customer entities hold information about the people and businesses that make purchases.

Customers have two sub-entities: 

- addresses: Customers require an address to make a purchase, which can be created through the create_address tool. Can have multiple addresses.
- businesses: Customers can optionally be associated with businesses, which can be created through the create_business tool.

${additionalDetailsWarning}

If successful, the response includes a copy of the new customer entity.
`;

export const getCustomerPrompt = `
This tool will retrieve a customer from Paddle by its ID.
`;

export const updateCustomerPrompt = `
This tool will update a customer in Paddle by its ID.

There's no delete operation for customers. Instead, archive them. Options are:

- active: Entity is active and can be used.
- archived: Entity is archived, so can't be used.

${additionalDetailsWarning}

If successful, the response includes a copy of the updated customer entity.
`;

export const listAddressesPrompt = `
This tool will list addresses for a customer in Paddle.

Use the maximum perPage by default (200) to ensure comprehensive results.
Filter addresses by id, search (fuzzy search on the address's street, city, state, postalCode, or country), and status as needed.
Results are paginated - use the 'after' parameter with the last ID from previous results to get the next page.
Sort and order results using the orderBy parameter.
`;

export const createAddressPrompt = `
This tool will create a new address for a customer in Paddle.

Address entities hold billing address information for a customer. Customers must have an address to make a purchase. A transaction can be created without an address, but it can't go past a status of draft until an address is added.

To make buying as frictionless as possible, Paddle only requires a country. For tax calculation, fraud prevention, and compliance purposes, postalCode is required when creating addresses for some countries, like ZIP codes in the USA and postcodes in the UK.

${additionalDetailsWarning}

If successful, the response includes a copy of the new address entity.
`;

export const getAddressPrompt = `
This tool will retrieve an address for a customer from Paddle using its ID and related customer ID.
`;

export const updateAddressPrompt = `
This tool will update an address for a customer in Paddle using its ID and related customer ID.

There's no delete operation for addresses. Instead, archive them. Options are:

- active: Entity is active and can be used.
- archived: Entity is archived, so can't be used.

${additionalDetailsWarning}

If successful, the response includes a copy of the updated address entity.
`;

export const listBusinessesPrompt = `
This tool will list businesses for a customer in Paddle.

Use the maximum perPage by default (200) to ensure comprehensive results.
Filter businesses by id, search (fuzzy search on the business's name or tax or VAT number), and status as needed.
Results are paginated - use the 'after' parameter with the last ID from previous results to get the next page.
Sort and order results using the orderBy parameter.
`;

export const createBusinessPrompt = `
This tool will create a new business for a customer in Paddle.

Business entities hold business information for a customer when working with a business rather than an individual. Customers do not need to have a business to make a purchase, but should if working with a business.

${additionalDetailsWarning}

If successful, the response includes a copy of the new business entity.
`;

export const getBusinessPrompt = `
This tool will retrieve a business for a customer from Paddle using its ID and related customer ID.
`;

export const updateBusinessPrompt = `
This tool will update a business for a customer in Paddle using its ID and related customer ID.

There's no delete operation for businesses. Instead, archive them. Options are:

- active: Entity is active and can be used.
- archived: Entity is archived, so can't be used.

${additionalDetailsWarning}

If successful, the response includes a copy of the updated business entity.
`;

export const listSavedPaymentMethodsPrompt = `
This tool will list payment methods for a customer in Paddle.

These are payment methods saved by the customer at checkout to be presented for future purchases. They aren't payment methods stored for transactions related to a recurring subscription. View a customers most recently used payment method for purchases or subscriptions by listing transactions (with the list_transactions tool) with a filter of customerId or subscriptionId, and looking at the returned payments[].methodDetails object.

Use the maximum perPage by default (200) to ensure comprehensive results.
Filter payment methods by addressId and supportsCheckout as needed.
Results are paginated - use the 'after' parameter with the last ID from previous results to get the next page.
Sort and order results using the orderBy parameter.
`;

export const getSavedPaymentMethodPrompt = `
This tool will retrieve a payment method for a customer from Paddle using its ID and related customer ID.

These are payment methods saved by the customer at checkout to be presented for future purchases. They aren't payment methods stored for transactions related to a recurring subscription. View a customers most recently used payment method for purchases or subscriptions by listing transactions (with the list_transactions tool) with a filter of customerId or subscriptionId, and looking at the returned payments[].methodDetails object.
`;

export const deleteSavedPaymentMethodPrompt = `
This tool will delete a customer payment method using its ID.

These are payment methods saved by the customer at checkout to be presented for future purchases. They aren't payment methods stored for transactions related to a recurring subscription. Deleting payment methods stored for subscriptions isn't possible. They must be updated by an authenticated customer using the customer portal (create_customer_portal_session tool) or by using an implementation of the Paddle checkout set up to allow customers to update their payment methods.

${checkBeforeWarning}

When a customer payment method is deleted, it's permanently removed from that customer. There's no way to recover a deleted payment method.
`;

export const createCustomerPortalSessionPrompt = `
This tool will create a customer portal session for a customer in Paddle.

The customer portal is a secure, Paddle-hosted site that allows customers and authorized individuals to:

- View transaction history
- Download invoices
- Update saved payment methods for future purchases
- Update stored payment methods for subscriptions
- Manage their subscriptions including cancellations
- Revise details on completed transactions

${checkBeforeWarning}

Authenticated links are returned which automatically sign in the customer. Ensure those creating a customer portal session are authorized to access the customer portal.

- urls.general.overview: Allows the customer to view their account information, transactions, and subscriptions.

Provide subscriptionIds to return urls.subscriptions[] to manage one or more subscriptions directly:

- urls.subscriptions[].updateSubscriptionPaymentMethod: Allows the customer to update the payment method for a subscription.
- urls.subscriptions[].cancelSubscription: Allows the customer to cancel a subscription.

If subscriptions are paused or canceled, links open the overview page for a subscription.

If successful, the response includes a copy of the new customer portal session entity with the urls to open up the customer portal for access. Customer portal sessions are temporary and shouldn't be cached.
`;

export const listNotificationSettingsPrompt = `
This tool will list notification settings in Paddle.

Use the maximum perPage by default (200) to ensure comprehensive results.
Filter notification settings by active and trafficSource as needed.
Results are paginated - use the 'after' parameter with the last ID from previous results to get the next page.
Sort and order results using the orderBy parameter.

The endpointSecretKey is returned for webhook signature verification, but is a secure value and should never be shared, never be made publicly-accessible, and should only be stored securely.
`;

export const createNotificationSettingPrompt = `
This tool will create a new notification setting (notification destination) in Paddle.

Create notification destinations to get notifications, like webhooks, for events that happen in Paddle. Paddle recommends handling the storage and provisioning of access after purchase and subscription using webhooks.

The type describes how and where the event should be sent:

- email: Deliver to an email address. Add the email address to the destination parameter.
- url: Deliver to a webhook endpoint. Add the full URL including the path to the destination parameter.

The destination URL must be publicly accessible. localhost is not a valid address. For local development, use a tunnelling service like ngrok or Hookdeck to generate a public URL.

Pass an array of event type names to subscribedEvents to say which events should be subscribed to. Paddle responds with the full event type object for each event type.

Provide the trafficSource to define if the notification destination should be sent real events and/or simulated test events:

- platform: Deliver real platform events. These are sent when real events which are subscribed to take place.
- simulation: Deliver simulated events. These are sent when simulations are run to test single events or scenarios, usually to verify implementations of Paddle.
- all: Deliver both platform (real) and simulation (test) events.

Create notification destinations as many as needed, but only 10 can be active as per the active boolean parameter. Prompt users to toggle in the dashboard. Alternatively, use the list_notification_setting tool, verify which should be active, and use the update_notification_setting tool to toggle the boolean accordingly.

If successful, the response includes a copy of the new notification setting entity. The endpointSecretKey is returned for webhook signature verification, but is a secure value and should never be shared, never be made publicly-accessible, and should only be stored securely.
`;

export const getNotificationSettingPrompt = `
This tool will retrieve a notification setting (notification destination) from Paddle by its ID.

The endpointSecretKey is returned for webhook signature verification, but is a secure value and should never be shared, never be made publicly-accessible, and should only be stored securely.
`;

export const updateNotificationSettingPrompt = `
This tool will update a notification setting (notification destination) in Paddle by its ID.

When updating subscribed events, send the complete list of event types that should be subscribed to, including existing event types. If event types are omitted, they're removed from the notification setting. Only the event type name needs to be passed. 

Paddle responds with the full event type object for each event type.

The destination URL must be publicly accessible. localhost is not a valid address. For local development, use a tunnelling service like ngrok or Hookdeck to generate a public URL.

Provide the trafficSource to define if the notification destination should be sent real events and/or simulated test events:

- platform: Deliver real platform events. These are sent when real events which are subscribed to take place.
- simulation: Deliver simulated events. These are sent when simulations are run to test single events or scenarios, usually to verify implementations of Paddle.
- all: Deliver both platform (real) and simulation (test) events.

Create notification destinations as many as needed, but only 10 can be active as per the active boolean parameter. Prompt users to toggle in the dashboard. Alternatively, use the list_notification_setting tool, verify which should be active, and use the update_notification_setting tool to toggle the boolean accordingly.

If successful, the response includes a copy of the updated notification setting entity. The endpointSecretKey is returned for webhook signature verification, but is a secure value and should never be shared, never be made publicly-accessible, and should only be stored securely.
`;

export const deleteNotificationSettingPrompt = `
This tool will delete a notification setting (notification destination) using its ID.

${checkBeforeWarning}

When deleting a notification setting, it's permanently removed from the account. Paddle stops sending events to the destination, and access is lost to all the logs for this notification setting.

There's no way to recover a deleted notification setting. Deactivate a notification setting using the update_notification_setting tool if log access is required or it needs to be reactivated later on.
`;

export const listNotificationsPrompt = `
This tool will list notifications in Paddle.

When an event that has a notification destination occurs, Paddle creates a notification entity with information about the notification.

A single event might create multiple notifications. This is common when working with multiple notification destinations that are subscribed to the same events. When an event occurs, Paddle creates a separate notification entity for each notification destination. They'll share the same eventId, but have different notificationId.

Notifications older than 90 days aren't retained and won't be returned.

Use the maximum perPage by default (200) to ensure comprehensive results.
Filter notifications by notificationSettingId, search (fuzzy search on the event's type or id), status, filter (pass a transaction, customer, or subscription ID), to, and from as needed.
Results are paginated - use the 'after' parameter with the last ID from previous results to get the next page.
Sort and order results using the orderBy parameter.

Check the following details to understand the success or failure of the notification delivery according to Paddle and debug issues:

- status: Status of the notification.
  - notAttempted: Paddle hasn't yet tried to deliver this notification.
  - needsRetry: Paddle tried to deliver this notification, but it failed. It's scheduled to be retried.
  - delivered: Paddle delivered this notification successfully.
  - failed: Paddle tried to deliver this notification, but all attempts failed. It's not scheduled to be retried.
- origin: Describes how this notification was created.
  - event: Notification created when a subscribed event occurred.
  - replay: Notification created when a notification with the origin event was replayed.
- deliveredAt: RFC 3339 datetime string of when this notification was delivered. null if not yet delivered successfully.
- lastAttemptAt: RFC 3339 datetime string of when this notification was last attempted.
- retryAt: RFC 3339 datetime string of when this notification is scheduled to be retried.
- timesAttempted: How many times delivery of this notification has been attempted.
`;

export const getNotificationPrompt = `
This tool will retrieve a notification from Paddle by its ID.

When an event that has a notification destination occurs, Paddle creates a notification entity with information about the notification.

Notifications older than 90 days aren't retained. If trying to get a notification that's no longer retained, Paddle returns an error.

Check the following details to understand the success or failure of the notification according to Paddle and debug issues:

- status: Status of the notification.
  - notAttempted: Paddle hasn't yet tried to deliver this notification.
  - needsRetry: Paddle tried to deliver this notification, but it failed. It's scheduled to be retried.
  - delivered: Paddle delivered this notification successfully.
  - failed: Paddle tried to deliver this notification, but all attempts failed. It's not scheduled to be retried.
- origin: Describes how this notification was created.
  - event: Notification created when a subscribed event occurred.
  - replay: Notification created when a notification with the origin event was replayed.
- deliveredAt: RFC 3339 datetime string of when this notification was delivered. null if not yet delivered successfully.
- lastAttemptAt: RFC 3339 datetime string of when this notification was last attempted.
- retryAt: RFC 3339 datetime string of when this notification is scheduled to be retried.
- timesAttempted: How many times delivery of this notification has been attempted.
`;

export const replayNotificationPrompt = `
This tool will resend a delivered or failed notification, like a webhook notification, using its ID.

${checkBeforeWarning}

Paddle creates a new notification entity for the replay, related to the same eventId. The response includes the new notificationId of the created notification.

Notifications older than 90 days aren't retained. If trying to replay a notification that's no longer retained, Paddle returns an error.

Only notifications with the origin of event can be replayed. Replaying a notification created for a replay isn't possible.

Check the following details to understand the success or failure of the notification according to Paddle and debug issues:

- status: Status of the notification.
  - notAttempted: Paddle hasn't yet tried to deliver this notification.
  - needsRetry: Paddle tried to deliver this notification, but it failed. It's scheduled to be retried.
  - delivered: Paddle delivered this notification successfully.
  - failed: Paddle tried to deliver this notification, but all attempts failed. It's not scheduled to be retried.
- origin: Describes how this notification was created.
  - event: Notification created when a subscribed event occurred.
  - replay: Notification created when a notification with the origin event was replayed.
- deliveredAt: RFC 3339 datetime string of when this notification was delivered. null if not yet delivered successfully.
- lastAttemptAt: RFC 3339 datetime string of when this notification was last attempted.
- retryAt: RFC 3339 datetime string of when this notification is scheduled to be retried.
- timesAttempted: How many times delivery of this notification has been attempted.
`;

export const listNotificationLogsPrompt = `
This tool will list notification logs in Paddle.

When Paddle sends a notification to a webhook endpoint or email address, it records information about each delivery attempt as a log against the notification.

Every delivered notification has at least one log with information about the response that Paddle received on delivery.

Where a notification isn't delivered successfully, Paddle tries to deliver the notification again. Each delivery attempt is logged against a notification.

Use the maximum perPage by default (200) to ensure comprehensive results.
Results are paginated - use the 'after' parameter with the last ID from previous results to get the next page.

Check the following details to understand the success or failure of each delivery attempt and debug issues:

- responseCode: HTTP code sent by the responding server.
- responseContentType: Content-Type sent by the responding server.
- responseBody: Response body sent by the responding server. Typically empty for success responses.
- attemptedAt: RFC 3339 datetime string of when Paddle attempted to deliver the related notification.
`;

export const listEventsPrompt = `
This tool will list events in Paddle.

When something notable occurs, Paddle creates an event entity with information about what happened. Events are created for actions regardless of how they happened and regardless of whether a notification setting is subscribed to be notified by Paddle.

Some actions might create multiple events. For example, resuming a subscription typically results in a subscription.resumed, transaction.created, and other transaction events being created.

Use the maximum perPage by default (200) to ensure comprehensive results.
Results are paginated - use the 'after' parameter with the last ID from previous results to get the next page.
Sort and order results using the orderBy parameter.
`;

export const listSimulationsPrompt = `
This tool will list simulations in Paddle.

These are the configurations for simulations, as opposed to the simulation runs which are used to send the events to the notification destination.

Use the maximum perPage by default (200) to ensure comprehensive results.
Filter simulations by notificationSettingId, id, and status as needed.
Results are paginated - use the 'after' parameter with the last ID from previous results to get the next page.
Sort and order results using the orderBy parameter.
`;

export const createSimulationPrompt = `
This tool will create a new simulation for a notification setting (notification destination) in Paddle.

Test webhooks can be sent through the webhook simulator in the dashboard or via the API by creating and running a simulation. Simulations configure which test webhooks are sent by Paddle when run. They can simulate the sending of single events or scenarios which send multiple events, like subscription renewals or cancellations. This is ideal for testing webhook implementations and validating data before sending real events. If implementing webhooks or making changes to an implementation, create and run a simulation prior to sending real events.

For scenario simulations (type of subscription_creation, subscription_renewal, subscription_pause, subscription_resume, subscription_cancellation), config objects can be provided. The config object contains a key matching the scenario type (e.g., for type "subscription_creation", use config.subscription_creation). This nested object can contain entities and options fields to control which webhooks are sent and populate payloads with real entity data. If provided, the config object must match the scenario type selected.

Option values for scenario simulations:

subscriptionCancellation and subscriptionPause:
- options.effectiveFrom:
  - next_billing_period: Simulates as if the subscription cancels or pauses at the start of next billing period.
  - immediately: Simulates as if the subscription cancels or pauses immediately.

subscriptionResume and subscriptionRenewal:
- options.paymentOutcome:
  - success: Simulates as if the payment for the subscription is successful.
  - recovered_existing_payment_method: Simulates as if the payment for the subscription fails initially and the payment is recovered when retrying the existing payment method.
  - recovered_updated_payment_method: Simulates as if the payment for the subscription fails initially and the customer updates their payment method to successfully pay.
  - failed: Simulates as if the payment for the subscription is unsuccessful after all payment recovery attempts are exhausted.
- options.dunningExhaustedAction (only valid when paymentOutcome is "failed"):
  - subscription_paused: Simulates as if the subscription is paused after all payment recovery attempts are exhausted.
  - subscription_canceled: Simulates as if the subscription is canceled after all payment recovery attempts are exhausted.

subscriptionCreation:
- options.customerSimulatedAs:
  - new: Simulates as if a new customer enters their details at checkout and Paddle creates a new customer.
  - existing_email_matched: Simulates as if an existing customer enters their details at checkout. Paddle matches it to an existing customer based on the email supplied and creates a new address for that customer.
  - existing_details_prefilled: Simulates as if existing customer details are prefilled at checkout by passing them to Paddle.js.
- options.businessSimulatedAs:
  - not_provided: Simulates as if no business is provided.
  - new: Simulates as if a customer enters their business details at checkout and Paddle creates a new business.
  - existing_details_prefilled: Simulates as if an existing business is prefilled at checkout by passing it to Paddle.js.
- options.discountSimulatedAs:
  - not_provided: Simulates as if no discount is entered.
  - prefilled: Simulates as if a discount is prefilled at checkout by passing it to Paddle.js. Requires entities.discountId.
  - entered_by_customer: Simulates as if a customer entered a discount at checkout. Requires entities.discountId.

If config.entities are not provided, simulated webhook payloads are populated with static demo examples.

If successful, the response includes a copy of the new simulation entity. The simulation can then be run to send the events to the notification destination with the create_simulation_run tool.
`;

export const getSimulationPrompt = `
This tool will retrieve a simulation from Paddle by its ID.

This is for the configuration of a simulation, as opposed to the simulation run which is used to send the events to the notification destination.
`;

export const updateSimulationPrompt = `
This tool will update a simulation by its ID. 

Test webhooks can be sent through the webhook simulator in the dashboard or via the API by creating and running a simulation. Simulations configure which test webhooks are sent by Paddle when run. They can simulate the sending of single events or scenarios which send multiple events, like subscription renewals or cancellations. This is ideal for testing webhook implementations and validating data before sending real events. If implementing webhooks or making changes to an implementation, create and run a simulation prior to sending real events.

For scenario simulations (type of subscriptionCreation, subscriptionRenewal, subscriptionPause, subscriptionResume, subscriptionCancellation), config objects can be provided. The config object contains a key matching the scenario type (e.g., for type "subscriptionCreation", use config.subscriptionCreation). This nested object can contain entities and options fields to control which webhooks are sent and populate payloads with real entity data. If provided, the config object must match the scenario type selected.

Option values for scenario simulations:

subscriptionCancellation and subscriptionPause:
- options.effectiveFrom:
  - next_billing_period: Simulates as if the subscription cancels or pauses at the start of next billing period.
  - immediately: Simulates as if the subscription cancels or pauses immediately.

subscriptionResume and subscriptionRenewal:
- options.paymentOutcome:
  - success: Simulates as if the payment for the subscription is successful.
  - recovered_existing_payment_method: Simulates as if the payment for the subscription fails initially and the payment is recovered when retrying the existing payment method.
  - recovered_updated_payment_method: Simulates as if the payment for the subscription fails initially and the customer updates their payment method to successfully pay.
  - failed: Simulates as if the payment for the subscription is unsuccessful after all payment recovery attempts are exhausted.
- options.dunningExhaustedAction (only valid when paymentOutcome is "failed"):
  - subscription_paused: Simulates as if the subscription is paused after all payment recovery attempts are exhausted.
  - subscription_canceled: Simulates as if the subscription is canceled after all payment recovery attempts are exhausted.

subscriptionCreation:
- options.customerSimulatedAs:
  - new: Simulates as if a new customer enters their details at checkout and Paddle creates a new customer.
  - existing_email_matched: Simulates as if an existing customer enters their details at checkout. Paddle matches it to an existing customer based on the email supplied and creates a new address for that customer.
  - existing_details_prefilled: Simulates as if existing customer details are prefilled at checkout by passing them to Paddle.js.
- options.businessSimulatedAs:
  - not_provided: Simulates as if no business is provided.
  - new: Simulates as if a customer enters their business details at checkout and Paddle creates a new business.
  - existing_details_prefilled: Simulates as if an existing business is prefilled at checkout by passing it to Paddle.js.
- options.discountSimulatedAs:
  - not_provided: Simulates as if no discount is entered.
  - prefilled: Simulates as if a discount is prefilled at checkout by passing it to Paddle.js. Requires entities.discountId.
  - entered_by_customer: Simulates as if a customer entered a discount at checkout. Requires entities.discountId.

If config.entities are not provided, simulated webhook payloads are populated with static demo examples.

If successful, the response includes a copy of the updated simulation entity. The simulation can then be run to send the events to the notification destination with the create_simulation_run tool.
`;

export const listSimulationRunsPrompt = `
This tool will list simulation runs in Paddle.

Use the maximum perPage by default (200) to ensure comprehensive results.
Filter simulationRuns by id as needed.
Results are paginated - use the 'after' parameter with the last ID from previous results to get the next page.
Sort and order results using the orderBy parameter.

Use the include parameter to include related entities in the response:

- events: An array of events entities for events sent by this simulation run.
`;

export const createSimulationRunPrompt = `
This tool will create a new simulation run for a simulation in Paddle.

Test webhooks can be sent through the webhook simulator in the dashboard or via the API by creating and running a simulation. Simulation runs are used to send the test webhook events to the notification destination once the simulation has been configured.

If successful, the response includes a copy of the new simulation run entity. All events sent by the simulation run can be seen using the list_simulations_events tool or including the 'events' parameter in the response when fetching the individual simulation run using the get_simulation_run tool.
`;

export const getSimulationRunPrompt = `
This tool will retrieve a simulation run from Paddle by its ID.

Use the include parameter to include related entities in the response:

- events: An array of events entities for events sent by this simulation run.
`;

export const listSimulationRunEventsPrompt = `
This tool will list simulation run events in Paddle.

Use the maximum perPage by default (200) to ensure comprehensive results.
Filter simulationRunEvents by id as needed.
Results are paginated - use the 'after' parameter with the last ID from previous results to get the next page.
Sort and order results using the orderBy parameter.

Check the following details to understand the success or failure of the event according to Paddle and debug issues:

- status: Status of the event according to Paddle.
  - pending: No attempt has been made to deliver the event yet.
  - success: The event was delivered successfully.
  - failure: Paddle tried to deliver the simulated event, but it failed. If response object is null, no response received from the server. Check the notification setting endpoint configuration.
  - aborted: Paddle couldn't attempt delivery of the simulated event.
- payload: Payload sent by Paddle for this event within the simulation.
- request.body: Request body sent by Paddle.
- response.body: Response body sent by the responding server. May be empty for success responses.
- response.statusCode: HTTP status code sent by the responding server.

If the destination URL is using a tunnel or proxy service, the response may be from the tunnel or proxy service, not the original server. Don't assume success or failure based on the status and response alone. Check the logs of the tunnel/proxy service and the destination server.
`;

export const getSimulationRunEventPrompt = `
This tool will retrieve an event sent by a simulation run from Paddle by its ID.

Check the following details to understand the success or failure of the event according to Paddle and debug issues:

- status: Status of the event according to Paddle.
  - pending: No attempt has been made to deliver the event yet.
  - success: The event was delivered successfully.
  - failure: Paddle tried to deliver the simulated event, but it failed. If response object is null, no response received from the server. Check the notification setting endpoint configuration.
  - aborted: Paddle couldn't attempt delivery of the simulated event.
- payload: Payload sent by Paddle for this event within the simulation.
- request.body: Request body sent by Paddle.
- response.body: Response body sent by the responding server. May be empty for success responses.
- response.statusCode: HTTP status code sent by the responding server.

If the destination URL is using a tunnel or proxy service, the response may be from the tunnel or proxy service, not the original server. Don't assume success or failure based on the status and response alone. Check the logs of the tunnel/proxy service and the destination server.
`;

export const replaySimulationRunEventPrompt = `
This tool will resend an event sent by a simulation run from Paddle using its ID.

This is useful to retest the sending of an individual event within a simulation run rather than creating a new simulation run and sending all events again.

Paddle creates a new simulation run event entity for the replay, related to the same simulation run.

If successful, the response includes the new simulation run event entity.

Check the following details to understand the success or failure of the event according to Paddle and debug issues:

- status: Status of the event according to Paddle.
  - pending: No attempt has been made to deliver the event yet.
  - success: The event was delivered successfully.
  - failure: Paddle tried to deliver the simulated event, but it failed. If response object is null, no response received from the server. Check the notification setting endpoint configuration.
  - aborted: Paddle couldn't attempt delivery of the simulated event.
- payload: Payload sent by Paddle for this event within the simulation.
- request.body: Request body sent by Paddle.
- response.body: Response body sent by the responding server. May be empty for success responses.
- response.statusCode: HTTP status code sent by the responding server.
`;

export const getTransactionInvoicePrompt = `
This tool will retrieve a link to an invoice PDF for a transaction from Paddle.

Invoice PDFs are available for both automatically and manually-collected transactions:

- The PDF for manually-collected transactions includes payment terms, purchase order number, and notes for the customer. It's a demand for payment from the customer. Available for transactions billed or completed.
- The PDF for automatically-collected transactions lets the customer know that payment was taken successfully. Customers may require this for for tax-reporting purposes. Available for transactions completed.

Invoice PDFs aren't available for zero-value transactions.

The link returned isn't a permanent link. It expires after an hour.
`;

export const listDiscountsPrompt = `
This tool will list discounts in the account's catalog.

Use the maximum perPage by default (200) to ensure comprehensive results.
Filter discounts by code, id, status, and mode as needed.
Results are paginated - use the 'after' parameter with the last ID from previous results to get the next page.
Sort and order results using the orderBy parameter.

Amounts are in the smallest currency unit (e.g., cents).
`;

export const createDiscountPrompt = `
This tool will create a new discount in Paddle.

Discounts reduce a transaction total. They're sometimes called coupons or promo codes.

Use discount codes to let customers apply discounts themselves at checkout, or apply discounts manually to transactions as part of the sales process.

Discounts can be added to a discount group to organize them. Only one discount group can be added at a time. List discounts by discount groups with the list_discount_groups tool to see which discounts are in which groups.

When selecting type, choose the one that best describes how to apply the discount to the total:

- flat: Discounts a checkout or transaction by a flat amount, for example -$100. Requires currencyCode.
- flat_per_seat: Discounts a checkout or transaction by a flat amount per unit, for example -$100 per user. Requires currencyCode.
- percentage: Discounts a checkout or transaction by a percentage of the total, for example -10%. Maximum 100%.

When selecting mode, choose the one that best describes the use case:

- standard: Standard discount. Can be considered part of the listed catalog and reused across transactions and subscriptions easily.
- custom: Non-catalog discount. Custom, one-off discounts. Includes checkout recovery discounts. Not returned when listing or shown in the Paddle dashboard.

${additionalDetailsWarning}

If successful, the response includes a copy of the new discount entity. Discounts can be applied to transactions, subscriptions, or passed to checkout through Paddle.js.
`;

export const getDiscountPrompt = `
This tool will retrieve a discount from Paddle by its ID.
`;

export const updateDiscountPrompt = `
This tool will update a discount in Paddle by its ID.

Updating a checkout recovery discount isn't possible. Remind the user to configure the checkout recovery settings in the dashboard.

There's no delete operation for discounts. Instead, archive them. Choose:

- active: Entity is active and can be used.
- archived: Entity is archived, so can't be used.

When selecting type, choose the one that best describes how to apply the discount to the total:

- flat: Discounts a checkout or transaction by a flat amount, for example -$100. Requires currencyCode.
- flat_per_seat: Discounts a checkout or transaction by a flat amount per unit, for example -$100 per user. Requires currencyCode.
- percentage: Discounts a checkout or transaction by a percentage of the total, for example -10%. Maximum 100%.

When selecting mode, choose the one that best describes the use case:

- standard: Standard discount. Can be considered part of the catalog and reused across transactions and subscriptions easily.
- custom: Non-catalog discount. Custom, one-off discounts. Includes checkout recovery discounts. Not returned when listing or shown in the Paddle dashboard.

${additionalDetailsWarning}

If successful, the response includes a copy of the updated discount entity.
`;

export const listDiscountGroupsPrompt = `
This tool will list discount groups in the account's catalog.

Use the maximum perPage by default (200) to ensure comprehensive results.
Filter discount groups by id as needed.
Results are paginated - use the 'after' parameter with the last ID from previous results to get the next page.
Sort and order results using the orderBy parameter.
`;

export const createDiscountGroupPrompt = `
This tool will create a new discount group in Paddle.

Discount groups are used to organize and manage related discounts under a group name. Create one when managing multiple discounts together, like for a campaign, promotion, or team.

${additionalDetailsWarning}

If successful, the response includes a copy of the new discount group entity.
`;

export const getDiscountGroupPrompt = `
This tool will retrieve a discount group from Paddle by its ID.
`;

export const updateDiscountGroupPrompt = `
This tool will update a discount group in Paddle by its ID.

There's no delete operation for discount groups. Instead, archive them. Choose:

- active: Discount group is active and can be used.
- archived: Discount group is archived and can't be used in new contexts.

Archiving a discount group doesn't affect the associated discounts - they remain active and can still be used.

${additionalDetailsWarning}

If successful, the response includes a copy of the updated discount group entity.
`;

export const archiveDiscountGroupPrompt = `
This tool will archive a discount group using its ID.

${checkBeforeWarning}

Discount groups can't be deleted, only archived. This is useful when cleaning up old, unused, or inactive discount groups.

If successful, the response includes a copy of the archived discount group entity.
`;

export const getSubscriptionPrompt = `
This tool will retrieve a subscription from Paddle by its ID.

Use the include parameter to include related entities in the response:

- next_transaction: Include an object with a preview of the next transaction for this subscription. May include prorated charges that aren't yet billed and one-time charges.
- recurring_transaction_details: Include an object with a preview of the recurring transaction for this subscription. This is what the customer can expect to be billed when there are no prorated or one-time charges.
`;

export const updateSubscriptionPrompt = `
This tool will update a subscription in Paddle by its ID.

Use this tool to update the items, the next billing date, or the collection mode on a subscription. To add items which should be charged only one-time and aren't recurring, use the create_subscription_charge tool. To update the payment method on a subscription, use the create_customer_portal_session tool and pass the returned urls.subscriptions[].updateSubscriptionPaymentMethod URL so the user can update manually.

Use this tool to remove any scheduled changes (cancellations, pauses, or resumes). To create a scheduled change on a subscription, use the pause_subscription, cancel_subscription, and resume_subscription tools respectively.

${checkBeforeWarning}

Send the complete list of items to include on the subscription - including existing items. If items are omitted, they're removed from the subscription. Fetch the existing subscription using the get_subscription tool to extract all items currently on the subscription.

All items added or updated must have the same billing interval (billingCycle.interval). If changing billing frequency, it may be necessary to replace existing items with new ones that have the new billing interval.

For each item, send priceId and quantity. Paddle responds with the full price object for each price. If updating an existing item, the quantity can be omitted if not updating it. 

All items can't be removed from a subscription. Cancel the subscription using the cancel_subscription tool instead.

When selecting collectionMode, choose the one that best describes how Paddle tries to collect for payment:

- automatic: Payment is collected automatically using a checkout initially, then using a payment method on file.
- manual: Payment is collected manually. Customers are sent an invoice with payment terms and can make a payment offline or using a checkout. Requires billingDetails.

If changing the collection mode from automatic to manual, always first:

- Check the customer associated to the subscription has a name. If not, get and then set a name on the customer.
- Check the customer has an address. If not, get and then set an address for the customer with a country, postalCode, region, city, and firstLine.
- Check the currencyCode of the subscription is USD, GBP, or EUR. If not, get which currency is preferred and then change the currency of the subscription to the preferred currency.

When making changes to items or the next billing date for a subscription, the prorationBillingMode field must be included to tell Paddle how to handle proration and bill for those changes.

When selecting prorationBillingMode, choose the one that best fits the behavior wanted:

- prorated_immediately: Paddle calculates the prorated amount for the subscription changes based on the current billing cycle, then creates a transaction to collect immediately.
- prorated_next_billing_period: Paddle calculates the prorated amount for the subscription changes based on the current billing cycle, then schedules them to be billed on the next renewal.
- full_immediately: Paddle doesn't calculate proration for the subscription changes, creating a transaction to collect for the full amount immediately.
- full_next_billing_period: Paddle doesn't calculate proration for the subscription changes, scheduling for the full amount for the changes to be billed on the next renewal.
- do_not_bill: Paddle doesn't bill for the subscription changes.

If prorated_immediately or full_immediately is selected, the status of the payment attempt can be seen and the invoice PDF can be fetched. Fetch the transaction using the list_transactions tool with the subscriptionId, and if the subscription is manually-collected, use the get_transaction_invoice tool.

If changing the billing frequency (interval) of items or the nextBilledAt date, only prorated_immediately, full_immediately, and do_not_bill can be selected.

When selecting onPaymentFailure, choose the one that best describes how Paddle should handle subscription updates when payment fails during one-time charges:

- prevent_change: Prevent the change to the subscription from applying.
- apply_change: Apply the change and update the subscription.

Test any changes before making them with the preview_subscription_update tool to confirm the changes are as expected.

${additionalDetailsWarning}

If successful, the response includes a copy of the updated subscription entity. An immediate charge results in payment processing.
`;

export const listSubscriptionsPrompt = `
This tool will list subscriptions in Paddle.

Use the maximum perPage by default (200) to ensure comprehensive results.
Filter subscriptions by addressId, collectionMode, customerId, id, priceId, scheduledChangeAction, and status as needed.
Results are paginated - use the 'after' parameter with the last ID from previous results to get the next page.
Sort and order results using the orderBy parameter.

Amounts are in the smallest currency unit (e.g., cents).
`;

export const cancelSubscriptionPrompt = `
This tool will cancel a subscription using its ID.

${checkBeforeWarning}

Subscriptions describe an ongoing financial relationship with a customer, so they can't be deleted. Instead, cancel them.

By default, active subscriptions are canceled at the end of the billing period. When sending a request to cancel, Paddle creates a scheduledChange against the subscription entity to say that it should cancel at the end of the current billing period. Its status remains active until after the effective date of the scheduled change, at which point it changes to canceled.

Canceling a subscription right away by including effectiveFrom in the request, setting the value to immediately is possible. Canceling immediately is the default behavior for paused subscriptions.

Reinstating a canceled subscription isn't possible.

If successful, the response includes a copy of the updated subscription entity. When canceling immediately, the status will be canceled.
`;

export const pauseSubscriptionPrompt = `
This tool will pause a subscription using its ID.

${checkBeforeWarning}

By default, subscriptions are paused at the end of the billing period. When sending a request to pause, Paddle creates a scheduledChange against the subscription entity to say that it should pause at the end of the current billing period. Its status remains active until after the effective date of the scheduled change, at which point it changes to paused.

Pausing a subscription right away by including effectiveFrom in the request, setting the value to immediately is possible.

To set a resume date, include the resumeAt field in the request. The subscription remains paused until the resume date, or until a resume request is sent. Omit to create an open-ended pause. The subscription remains paused indefinitely, until a resume request is sent.

If successful, the response includes a copy of the updated subscription entity. When pausing immediately, the status will be paused.
`;

export const resumeSubscriptionPrompt = `
This tool will resume a paused subscription using its ID. Only paused subscriptions can be resumed. If an active subscription has a scheduled change to pause in the future, use this operation to set or change the resume date.

${checkBeforeWarning}

Resuming a canceled subscription isn't possible.

On resume, Paddle bills for a subscription immediately by default. Subscription billing dates are recalculated based on the resume date. Use the onResume field to change this behavior.

This operation may result in an immediate charge, so responses may take longer than usual while a payment attempt is processed.

If successful, the response includes a copy of the updated subscription entity:

- When resuming a paused subscription immediately, the subscription status is active, and billing dates are updated to reflect the resume date.
- When scheduling a paused subscription to resume on a date in the future, the subscription status is paused, and scheduledChange.resumeAt is updated to reflect the scheduled resume date.
- When changing the resume date for an active subscription that's scheduled to pause, the subscription status is active and scheduledChange.resumeAt is updated to reflect the scheduled resume date.
`;

export const activateSubscriptionPrompt = `
This tool will activate a trialing subscription using its ID. Only automatically-collected subscriptions where the status is trialing can be activated.

${checkBeforeWarning}

On activation, Paddle bills for a subscription immediately. Subscription billing dates are recalculated based on the activation date (the time the activation request is made).

This operation results in an immediate charge, so responses may take longer than usual while a payment attempt is processed.

If successful, the response includes a copy of the updated subscription entity. The subscription status is active, and billing dates are updated to reflect the activation date.
`;

export const previewSubscriptionUpdatePrompt = `
This tool will preview an update for a subscription without applying those changes.

It's best practice to preview every time before updating the subscription to confirm the changes are as expected, especially when making updates to items, billing periods, and anything affecting proration.

The updateSummary object contains details of prorated credits and charges created, along with the overall result of the update.

If successful, the response includes immediateTransaction, nextTransaction, and recurringTransactionDetails to see expected transactions for the changes.
`;

export const createSubscriptionChargePrompt = `
This tool will create a one-time charge for a subscription in Paddle. Use to bill non-recurring items to a subscription. Non-recurring items are price entities where the billingCycle is null.

${checkBeforeWarning}

When selecting effectiveFrom, choose the one that best describes when the one-time charges should be billed:

- next_billing_period: Bill for one-time charges on the next billing period. Paddle adds the charges to the transaction created when the subscription next renews.
- immediately: Bill for one-time charges now. Paddle creates a transaction for them right away. For automatically-collected subscriptions, responses may take longer than usual while a payment attempt is processed.

When selecting onPaymentFailure, choose the one that best describes how Paddle should handle subscription updates when payment fails during one-time charges:

- prevent_change: Prevent the change to the subscription from applying.
- apply_change: Apply the change and update the subscription.

Once created, to get details of a one-time charge:

- When created with effectiveFrom as next_billing_period, get the subscription the charge was billed to and use the include query parameter with the nextTransaction value.
- When created with effectiveFrom as immediately, list transactions and use the subscriptionId query parameter with the subscription ID of the subscription the charge was billed to.

When an update results in an immediate charge, responses may take longer than usual while a payment attempt is processed.

${additionalDetailsWarning}

If successful, the response includes a copy of the updated subscription entity. However, one-time charges aren't held against the subscription entity, so the charges billed aren't returned in the response.
`;

export const previewSubscriptionChargePrompt = `
This tool will preview creating a one-time charge for a subscription without billing that charge, typically used for previewing calculations before making changes to a subscription.

One-time charges are non-recurring items. These are price entities where the billingCycle is null.

If successful, the response includes immediateTransaction, nextTransaction, and recurringTransactionDetails to see expected transactions for the changes.
`;

export const listReportsPrompt = `
This tool will list reports in Paddle.

This lists generated report exports only. It does not return report contents or analytical summaries.

${metricsReportsGuidance}

Use the maximum perPage by default (200) to ensure comprehensive results.
Filter reports by status as needed.
Results are paginated - use the 'after' parameter with the last ID from previous results to get the next page.
Sort and order results using the orderBy parameter.

Amounts are in the smallest currency unit (e.g., cents).
`;

export const createReportPrompt = `
This tool will create a new report in Paddle.

Use this tool when detailed financial data for analysis, reconciliation, auditing, or export to spreadsheet applications is needed.
Use this tool over listTransactions when trying to gather larger amounts of data from Paddle.

${metricsReportsGuidance}

When to use this tool:
- The user wants a CSV export or a list of individual records.
- The user needs transaction-level, adjustment-level, discount-level, or product/price-level detail.
- The user wants to reconcile data, audit historical activity, or work in a spreadsheet.
- Do NOT use this when the user wants an aggregate trend, dashboard metric, or chart-ready timeseries. Use a metrics tool instead.

Reports are generated asynchronously - a report ID will be returned that can be used to check status.
Reports initially have 'pending' status, then move to 'ready' when available to download.
Reports are available in CSV format and can be downloaded once ready using the get_report_csv tool.
Reports expire after a certain period and are no longer available to download after they expire.

There are different report types available:

- adjustments: For information about refunds, credits, and chargebacks
- adjustment_line_items: For information about refunds, credits, and chargebacks, broken down by line item level
- transactions: For information about revenue received, past due invoices, draft and issued invoices, and canceled transactions
- transaction_line_items: For information about revenue received, past due invoices, draft and issued invoices, and canceled transactions, broken down by line item level
- products_prices: For information about the products and prices. May include non-catalog products and prices.
- discounts: For information about the product and checkout discounts

Each report type has different filters which can be used:

- action: adjustments and adjustment_line_items. Pass an array of strings containing any of 'refund', 'credit', 'chargeback', 'chargeback_reverse', 'chargeback_warning', 'chargeback_warning_reverse', 'credit_reverse' as values.
- collection_mode: transactions and transaction_line_items. Pass an array of strings containing any of 'automatic' and 'manual' as values.
- currency_code: adjustments, adjustment_line_items, transactions, and transaction_line_items. Pass an array of strings containing any valid supported three-letter ISO 4217 currency code.
- origin: transactions and transaction_line_items. Pass an array of strings containing any of 'api', 'subscription_charge', 'subscription_payment_method_change', 'subscription_recurring', 'subscription_update', and 'web' as values.
- product_status: products_prices. Pass an array of strings containing any of 'active' and 'archived' as values.
- price_status: products_prices. Pass an array of strings containing any of 'active' and 'archived' as values.
- product_type: products_prices. Pass an array of strings containing any of 'custom' and 'standard' as values.
- price_type: products_prices. Pass an array of strings containing any of 'custom' and 'standard' as values.
- product_updated_at: products_prices. Pass an RFC 3339 datetime string.
- price_updated_at: products_prices. Pass an RFC 3339 datetime string.
- status: adjustments, adjustment_line_items, transactions, transaction_line_items, and discounts. Pass an array of strings containing any valid value for the status field against an adjustment, transaction, or discount.
- type: discounts and products_prices. Pass an array of strings containing any of 'custom' and 'standard' as values.
- updated_at: adjustments, adjustment_line_items, transactions, transaction_line_items, and discounts. Pass an RFC 3339 datetime string. Use the operator parameter to specify the operator to use when filtering.

If successful, the response includes a copy of the new report entity.
`;

export const getReportCsvPrompt = `
This tool will retrieve a link to a CSV file for a report from Paddle by its ID.

Use this only after a report is ready. This returns a temporary download URL for the CSV export, not the CSV contents inline.

${metricsReportsGuidance}

Only returned for reports that are ready. This means Paddle has completed processing the report and it's ready to download. The status of a report can be checked using the get_report tool.

The link returned isn't a permanent link. It expires after 3 minutes.
`;

export const getReportPrompt = `
This tool will retrieve a report entity from Paddle by its ID. It only contains information about the report, like the ID, status, and the date it was created. 

Use this tool to check the status of a generated report, or to get the ID of a report, to then use with the get_report_csv tool to download the CSV.
It does not return the exported rows themselves.

${metricsReportsGuidance}
`;

export const listClientSideTokensPrompt = `
This tool will list client-side tokens in Paddle.

Client-side tokens are needed to authenticate with Paddle.js. A token is provided when initializing Paddle.js.

Use the maximum perPage by default (200) to ensure comprehensive results.
Filter client-side tokens by status as needed.
Results are paginated - use the 'after' parameter with the last ID from previous results to get the next page.
Sort and order results using the orderBy parameter.

The returned token field is the client-side token that needs to be provided when initializing Paddle.js. Can be exposed client-side safely. If it starts with:

- test_: The token is a test token for a sandbox environment and shouldn't be used in production.
- live_: The token is a live token for a production environment. It can be used to test too but Paddle.js checkouts require real cards.

Client-side tokens have a status:
- active: Client-side token can be used to authenticate with Paddle.js.
- revoked: Client-side token has been revoked and can no longer be used to authenticate with Paddle.js.
`;

export const createClientSideTokenPrompt = `
This tool will create a new client-side token in Paddle.

Client-side tokens are needed to authenticate with Paddle.js. A token is provided when initializing Paddle.js.

When creating a client-side token, provide a descriptive name to help identify its purpose. Usually created for each application or environment that needs to authenticate with Paddle.js.

If successful, the response includes a copy of the new client-side token entity. The returned token field is the client-side token that needs to be provided when initializing Paddle.js. Can be exposed client-side safely. If it starts with:

- test_: The token is a test token for a sandbox environment and shouldn't be used in production.
- live_: The token is a live token for a production environment. It can be used to test too but Paddle.js checkouts require real cards.
`;

export const getClientSideTokenPrompt = `
This tool will retrieve a client-side token from Paddle by its ID.

The returned token field is the client-side token that needs to be provided when initializing Paddle.js. Can be exposed client-side safely. If it starts with:

- test_: The token is a test token for a sandbox environment and shouldn't be used in production.
- live_: The token is a live token for a production environment. It can be used to test too but Paddle.js checkouts require real cards.

Client-side tokens have a status:
- active: Client-side token can be used to authenticate with Paddle.js.
- revoked: Client-side token has been revoked and can no longer be used to authenticate with Paddle.js.
`;

export const revokeClientSideTokenPrompt = `
This tool will revoke a client-side token using its ID.

When revoking a client-side token, it can no longer be used to authenticate with Paddle.js. Revoking a token is permanent and can't be undone. Create a new client-side token using the create_client_side_token tool if authentication is needed again.

If successful, the response includes a copy of the revoked client-side token entity.
`;

export const getActiveSubscribersPrompt = `
This tool will retrieve active subscriber metrics from Paddle.

Returns timeseries data for active subscriber counts in a given date range. Trends have a daily granularity. Current number of paying users with active subscriptions (does not include trialling users).

${metricsEnvironmentGuidance}

${metricsReportsGuidance}

When to use this tool:
- The user asks about subscriber counts, subscriber growth, or how many paying customers they have.
- The user wants to compare active subscriber levels across dates or periods.
- Do NOT use this for revenue questions. Use the monthly recurring revenue or revenue metrics tools instead.
- Do NOT use this for individual subscription records or subscriber details. Use subscription tools or reports instead.

How to read and use the timeseries data:
- Each datapoint contains a \`count\` field. This is a count-based metric, not a money metric.
- Each datapoint is a snapshot of total active subscribers on that day, not the number gained that day.
- Compare the first and last datapoints in the range to describe period-over-period growth or decline.
- Flat periods do not necessarily mean no activity. New subscribers may be offset by churn.
- If the user asks about trialling users, clarify that trialling subscriptions are excluded.

Data freshness:
- Use \`updated_at\` to describe when the metric was last refreshed. This is not realtime data.

${metricsDateRangeGuidance}
`;

export const getMonthlyRecurringRevenuePrompt = `
This tool will retrieve monthly recurring revenue (MRR) metrics from Paddle.

Returns timeseries data for monthly recurring revenue in a given date range. Trends have a daily granularity. Current monthly recurring revenue total. Includes new subscriptions, upgrades, downgrades and churn. Does not include one-time payments or deductions for Paddle fees.

${metricsEnvironmentGuidance}

${metricsReportsGuidance}

When to use this tool:
- The user asks about MRR, recurring revenue, or subscription revenue trends.
- The user wants the health of their subscription business over time.
- Do NOT use this for total revenue including one-time payments. Use the revenue metrics tool instead.
- Do NOT use this to explain what changed MRR. Use the monthly recurring revenue change metric alongside it.
- Do NOT use this for individual subscription transactions. Use reports instead.

How to read and use the timeseries data:
- Each datapoint contains an \`amount\` field in the smallest currency unit.
- \`currency_code\` is returned at the top level of \`data\`, not per datapoint. If the account's primary balance currency changes, amounts continue to use the previous currency until the next payout period begins (per Paddle API behavior).
- Each datapoint is a snapshot of total MRR on that day, not revenue earned that day.
- Compare the first and last datapoints to describe MRR growth or contraction across the period.
- Convert \`amount\` to a human-readable value before presenting it.
- Pair this with the monthly recurring revenue change metric when the user asks why MRR moved.
- Pair this with active subscribers if the user wants MRR per subscriber.

Data freshness:
- Use \`updated_at\` to describe when the metric was last refreshed. This is not realtime data.

${metricsDateRangeGuidance}
`;

export const getRevenuePrompt = `
This tool will retrieve revenue metrics from Paddle.

Returns timeseries data for revenue in a given date range. Trends have a daily granularity. Net revenue from completed payments (e.g. single purchase, subscription, B2B invoices) after tax & fees have been deducted, but before adjustments such as refunds or chargebacks.

${metricsEnvironmentGuidance}

${metricsReportsGuidance}

When to use this tool:
- The user asks about total revenue, earnings, or money made over time.
- The user wants completed payment revenue across subscriptions, one-time payments, and invoices.
- Do NOT use this for subscription-only recurring revenue. Use the monthly recurring revenue metric instead.
- Do NOT assume this is true take-home revenue. Refunds and chargebacks are not deducted here.
- Do NOT use this for individual transactions. Use reports instead.

How to read and use the timeseries data:
- Each datapoint contains an \`amount\` field in the smallest currency unit and a \`count\` field for the number of transactions that day.
- Each datapoint is a daily increment, not a running total.
- Sum the \`amount\` values across datapoints to get total revenue for the period.
- Use \`amount / count\` to estimate average transaction value for each day when \`count\` is non-zero.
- Watch for billing-cycle spikes before describing them as growth trends.
- Convert \`amount\` to a human-readable value before presenting it.
- If the user wants a truer net view, fetch refunds and chargebacks for the same period too.

Data freshness:
- Use \`updated_at\` to describe when the metric was last refreshed. This is not realtime data.

${metricsDateRangeGuidance}
`;

export const getRefundsPrompt = `
This tool will retrieve refund metrics from Paddle.

Returns timeseries data for refunds in a given date range. Trends have a daily granularity. The transaction subtotal (base cost minus discounts excluding taxes and fees) of refunded products returned to the customer. This does not include chargebacks.

${metricsEnvironmentGuidance}

${metricsReportsGuidance}

When to use this tool:
- The user asks about refund trends, refund volume, or money returned to customers.
- The user wants to monitor refund activity or calculate a refund rate.
- Do NOT use this for chargebacks. Use the chargebacks metric instead.
- Do NOT use this for individual refund records. Use adjustment, transaction, or report tools instead.

How to read and use the timeseries data:
- Each datapoint contains an \`amount\` field in the smallest currency unit.
- Each datapoint is a daily increment, not a running total.
- Sum the datapoint amounts to get total refunds for the period.
- The refunded amount here is the refunded product subtotal, excluding taxes and fees.
- Compare this metric with revenue for the same period to calculate a refund rate.
- Spikes after launches, pricing changes, or renewal cohorts can be expected; sustained rises are the stronger signal.
- Convert \`amount\` to a human-readable value before presenting it.

Data freshness:
- Use \`updated_at\` to describe when the metric was last refreshed. This is not realtime data.

${metricsDateRangeGuidance}
`;

export const getChargebacksPrompt = `
This tool will retrieve chargeback metrics from Paddle.

Returns timeseries data for chargebacks in a given date range. Trends have a daily granularity. Total number of chargebacks received for the period. Does not include pre-chargeback alerts or chargeback reversals.

${metricsEnvironmentGuidance}

${metricsReportsGuidance}

When to use this tool:
- The user asks about chargebacks, disputes, or chargeback volume.
- The user wants to monitor chargeback trends or assess payment risk.
- Do NOT use this for refunds. Refunds and chargebacks are different concepts.
- Do NOT use this for financial impact in currency terms or for individual dispute records. Use report or entity-level tools instead.

How to read and use the timeseries data:
- Each datapoint contains a \`count\` field. This is a count-based metric, not a money metric.
- Each datapoint is a daily increment, not a running total.
- Sum the datapoint counts to get total chargebacks for the period.
- Compare total chargebacks with total transaction count from the revenue metric to calculate a chargeback rate.
- Chargebacks usually lag the underlying transaction by weeks or months, so avoid attributing a spike only to current-period behavior.
- Highlight sustained elevated counts over isolated spikes when discussing risk.

Data freshness:
- Use \`updated_at\` to describe when the metric was last refreshed. This is not realtime data.

${metricsDateRangeGuidance}
`;

export const getCheckoutConversionPrompt = `
This tool will retrieve checkout conversion metrics from Paddle.

Returns timeseries data for checkout conversion in a given date range. Trends have a daily granularity. The conversion rate for checkouts in the period. A checkout is considered converted when a payment is successfully completed.

${metricsEnvironmentGuidance}

${metricsReportsGuidance}

When to use this tool:
- The user asks about checkout conversion, payment completion rate, or checkout funnel performance.
- The user wants to understand how effectively checkouts turn into successful payments.
- Do NOT use this for revenue amounts. Use revenue or monthly recurring revenue metrics instead.
- Do NOT use this to debug individual failed checkouts. Use entity-level transaction tools instead.

How to read and use the timeseries data:
- Each datapoint contains \`count\`, \`completed_count\`, and \`rate\`.
- \`count\` is total checkouts started that day.
- \`completed_count\` is the number of those checkouts that successfully completed.
- \`rate\` is the per-day conversion rate. Convert it to a percentage for display.
- For an overall period conversion rate, sum all \`completed_count\` values and divide by the sum of all \`count\` values.
- Do NOT average the daily \`rate\` values across the period; that can be misleading when daily volume changes.
- Always present conversion rate alongside checkout volume so the result is not misleading.

Data freshness:
- Use \`updated_at\` to describe when the metric was last refreshed. This is not realtime data.

${metricsDateRangeGuidance}
`;

export const getMonthlyRecurringRevenueChangePrompt = `
This tool will retrieve monthly recurring revenue (MRR) change metrics from Paddle.

Returns timeseries data for monthly recurring revenue change in a given date range. Trends have a daily granularity. Monthly recurring revenue (MRR) change compared to the same time interval last month.

${metricsEnvironmentGuidance}

${metricsReportsGuidance}

When to use this tool:
- The user asks about MRR growth, MRR movement, or whether recurring revenue is expanding or shrinking.
- The user wants to understand the direction of recurring revenue, not just the total.
- Do NOT use this for absolute MRR totals. Use the monthly recurring revenue metric instead.
- Do NOT use this for individual subscription changes. Use reports or entity-level tools instead.

How to read and use the timeseries data:
- Each datapoint contains an \`amount\` field in the smallest currency unit.
- \`currency_code\` is returned at the top level of \`data\`, not per datapoint. If the account's primary balance currency changes, amounts continue to use the previous currency until the next payout period begins (per Paddle API behavior).
- Values can be positive or negative. Preserve the sign when presenting the result.
- Each datapoint is already a daily delta. Do NOT calculate an additional delta from it.
- Sum the datapoint amounts to get total net MRR change across the period.
- Consistently negative values suggest recurring revenue contraction; large isolated positives may indicate dependence on a few big changes.
- Pair this metric with the monthly recurring revenue metric so the user gets both direction and absolute level.
- Convert \`amount\` to a human-readable value before presenting it.

Data freshness:
- Use \`updated_at\` to describe when the metric was last refreshed. This is not realtime data.

${metricsDateRangeGuidance}
`;
