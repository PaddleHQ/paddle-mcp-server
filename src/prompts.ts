export const listProductsPrompt = `
This tool will list products in your Paddle catalog.

Use the maximum perPage by default (200) to ensure comprehensive results.
Filter products by status, tax category, and type as needed.
Results are paginated - use the 'after' parameter with the last ID from previous results to get the next page.
Sort results using orderBy parameter.
Include related entities like prices if needed.
`;

export const createProductPrompt = `
This tool will create a new product in Paddle.

When selecting a tax category, choose the one that best describes your product:

- standard: Software products that are pre-written and can be downloaded and installed onto a local device
- digital-goods: Non-customizable digital files or media (not software) acquired with an up front payment that can be accessed without any physical product being delivered
- ebooks: Digital books and educational material which is sold with permanent rights for use by the customer
- implementation-services: Remote configuration, set-up, and integrating software on behalf of a customer
- professional-services: Services that involve the application of your expertise and specialized knowledge of a software product
- saas: Products that allow users to connect to and use online or cloud-based applications over the Internet
- software-programming-services: Services that can be used to customize and white label software products
- training-services: Training and education services related to software products
- website-hosting: Cloud storage service for personal or corporate information, assets, or intellectual property

The tax category affects how taxes are calculated in different jurisdictions. Choose carefully as it impacts your customers' tax rates.
When using the standard tax category, prompt the user to review the tax category in the Paddle dashboard.
`;

export const listPricesPrompt = `
This tool will list prices in your Paddle catalog.

Use the maximum perPage by default (200) to ensure comprehensive results.
Filter prices by product ID, status, recurring, and type as needed.
Results are paginated - use the 'after' parameter with the last ID from previous results to get the next page.
Sort results using orderBy parameter.
Include related entities like products if needed.
`;

export const createPricePrompt = `
This tool will create a new price for a product in Paddle.

When using unitPriceOverrides:
1. Group countries based on purchasing power parity (PPP), not just currency zones
2. Create separate overrides for countries with different economic conditions even if they share the same currency (e.g., Greece and Ireland should have different price points)
3. Adjust prices relative to local economic conditions - higher in wealthy markets, lower in developing economies
4. For optimal conversion rates, set prices using local market research and willingness-to-pay data
5. Use local currencies where preferred by the customer

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
`;

export const listCustomersPrompt = `
This tool will list customers in your Paddle account.

Use the maximum perPage by default (200) to ensure comprehensive results.
Filter customers by email, ID, and status as needed.
Use the search parameter to find customers by ID, name, or email address.
Results are paginated - use the 'after' parameter with the last ID from previous results to get the next page.
Sort results using orderBy parameter.
Customers can have either 'active' or 'archived' status.
`;

export const listTransactionsPrompt = `
This tool will list transactions from your Paddle account.

Use the maximum perPage by default (30) to ensure comprehensive results. 
Filter transactions by billing and creation dates, collection mode, customer ID, invoice number, origin, status and subscription ID as required. 
You can include related information such as addresses, adjustments, adjustment totals, available payment methods, business details, customer data, and discounts when needed.
Results are paginated - use the 'after' parameter with the last ID from previous results to get the next page.
Sort results using orderBy parameter.
`;

export const listSubscriptionsPrompt = `
This tool will list subscriptions from your Paddle account.

Use the maximum perPage by default (200) to ensure comprehensive results. 
Filter subscriptions by address ID, customer ID, price ID, collection mode, scheduled change action, and status as needed. 
Results are paginated - use the 'after' parameter with the last ID from previous results to get the next page.
Sort results using orderBy parameter.
`;

export const createReportPrompt = `
This tool creates custom reports in your Paddle account for financial analysis and reconciliation.

Use this tool over list_transactions when trying to gather larger amounts of data from Paddle.

Available report types:
- 'adjustments': For information about refunds, credits, and chargebacks
- 'adjustment_line_items': For information about refunds, credits, and chargebacks, broken down by line item level
- 'transactions': For information about revenue received, past due invoices, draft and issued invoices, and canceled transactions
- 'transaction_line_items': For information about revenue received, past due invoices, draft and issued invoices, and canceled transactions, broken down by line item level
- 'products_prices': For information about your products and prices. May include non-catalog products and prices.
- 'discounts': For information about your product and checkout discounts

Reports are generated asynchronously - you'll receive a report ID that can be used to check status.
Reports initially have 'pending' status, then move to 'ready' when available to download.
Reports are available in CSV format and can be downloaded once ready.
Reports expire after a certain period and are no longer available to download after expiration.

Use this tool when you need detailed financial data for analysis, reconciliation, or export to spreadsheet applications.
`;
