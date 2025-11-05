# MCP Server for Paddle Billing

[Paddle Billing](https://www.paddle.com/billing?utm_source=dx&utm_medium=paddle-mcp-server) is the developer-first merchant of record. We take care of payments, tax, subscriptions, and metrics with one unified API that does it all.

This is a [Model Context Protocol (MCP)](https://modelcontextprotocol.io/introduction) server that provides LLMs and AI agents with tools for interacting with the Paddle API.

> **Important:** This MCP server works with Paddle Billing. It does not support Paddle Classic. To work with Paddle Classic, see: [Paddle Classic API reference](https://developer.paddle.com/classic/api-reference/1384a288aca7a-api-reference?utm_source=dx&utm_medium=paddle-mcp-server)

[![Install MCP Server](https://cursor.com/deeplink/mcp-install-dark.svg)](https://cursor.com/install-mcp?name=paddle&config=eyJjb21tYW5kIjoibnB4IC15IEBwYWRkbGUvcGFkZGxlLW1jcCIsImVudiI6eyJQQURETEVfQVBJX0tFWSI6InBkbF9zZGJ4X2FwaWtleV8iLCJQQURETEVfRU5WSVJPTk1FTlQiOiJzYW5kYm94In19)

## Features

The MCP server has near parity with the Paddle API, allowing AI assistants and agents to:

* Manage your full Paddle catalog
* View customer, purchase, and provisioning information
* Handle subscription, payment, and refund workflows
* Debug billing and order management issues
* Create and adjust transactions directly in conversation
* Generate financial reports for financial and operational insights
* Implement and test Paddle integrations faster

<details>
<summary>Available tools</summary>

### Products

| Operation | Tool | Non-destructive | Read only |
|-----------|------|-----------------|-----------|
| List products | `list_products` | ✅ | ✅ |
| Create a product | `create_product` | ✅ | ❌ |
| Get a product | `get_product` | ✅ | ✅ |
| Update a product | `update_product` | ❌ | ❌ |

### Prices

| Operation | Tool | Non-destructive | Read only |
|-----------|------|-----------------|-----------|
| List prices | `list_prices` | ✅ | ✅ |
| Create a price | `create_price` | ✅ | ❌ |
| Get a price | `get_price` | ✅ | ✅ |
| Update a price | `update_price` | ❌ | ❌ |
| Preview prices | `preview_prices` | ✅ | ❌ |

### Discounts

| Operation | Tool | Non-destructive | Read only |
|-----------|------|-----------------|-----------|
| List discounts | `list_discounts` | ✅ | ✅ |
| Create a discount | `create_discount` | ✅ | ❌ |
| Get a discount | `get_discount` | ✅ | ✅ |
| Update a discount | `update_discount` | ❌ | ❌ |

### Discount Groups

| Operation | Tool | Non-destructive | Read only |
|-----------|------|-----------------|-----------|
| List discount groups | `list_discount_groups` | ✅ | ✅ |
| Create a discount group | `create_discount_group` | ✅ | ❌ |
| Get a discount group | `get_discount_group` | ✅ | ✅ |
| Update a discount group | `update_discount_group` | ❌ | ❌ |
| Archive a discount group | `archive_discount_group` | ❌ | ❌ |

### Customers

| Operation | Tool | Non-destructive | Read only |
|-----------|------|-----------------|-----------|
| List customers | `list_customers` | ✅ | ✅ |
| Create a customer | `create_customer` | ✅ | ❌ |
| Get a customer | `get_customer` | ✅ | ✅ |
| Update a customer | `update_customer` | ❌ | ❌ |
| List credit balances for a customer | `list_credit_balances` | ✅ | ✅ |

### Addresses

| Operation | Tool | Non-destructive | Read only |
|-----------|------|-----------------|-----------|
| List addresses for a customer | `list_addresses` | ✅ | ✅ |
| Create an address for a customer | `create_address` | ✅ | ❌ |
| Get an address for a customer | `get_address` | ✅ | ✅ |
| Update an address for a customer | `update_address` | ❌ | ❌ |

### Businesses

| Operation | Tool | Non-destructive | Read only |
|-----------|------|-----------------|-----------|
| List businesses for a customer | `list_businesses` | ✅ | ✅ |
| Create a business for a customer | `create_business` | ✅ | ❌ |
| Get a business for a customer | `get_business` | ✅ | ✅ |
| Update a business for a customer | `update_business` | ❌ | ❌ |

### Transactions

| Operation | Tool | Non-destructive | Read only |
|-----------|------|-----------------|-----------|
| List transactions | `list_transactions` | ✅ | ✅ |
| Create a transaction | `create_transaction` | ✅ | ❌ |
| Get a transaction | `get_transaction` | ✅ | ✅ |
| Update a transaction | `update_transaction` | ❌ | ❌ |
| Preview a transaction | `preview_transaction_create` | ✅ | ❌ |
| Revise customer information on a billed or completed transaction | `revise_transaction` | ❌ | ❌ |
| Get a PDF invoice for a transaction | `get_transaction_invoice` | ✅ | ✅ |

### Adjustments

| Operation | Tool | Non-destructive | Read only |
|-----------|------|-----------------|-----------|
| List adjustments | `list_adjustments` | ✅ | ✅ |
| Create an adjustment | `create_adjustment` | ✅ | ❌ |
| Get a PDF credit note for an adjustment | `get_adjustment_credit_note` | ✅ | ✅ |

### Subscriptions

| Operation | Tool | Non-destructive | Read only |
|-----------|------|-----------------|-----------|
| List subscriptions | `list_subscriptions` | ✅ | ✅ |
| Get a subscription | `get_subscription` | ✅ | ✅ |
| Update a subscription | `update_subscription` | ❌ | ❌ |
| Cancel a subscription | `cancel_subscription` | ❌ | ❌ |
| Pause a subscription | `pause_subscription` | ❌ | ❌ |
| Resume a paused subscription | `resume_subscription` | ❌ | ❌ |
| Activate a trialing subscription | `activate_subscription` | ❌ | ❌ |
| Preview an update to a subscription | `preview_subscription_update` | ✅ | ❌ |
| Create a one-time charge for a subscription | `create_subscription_charge` | ✅ | ❌ |
| Preview a one-time charge for a subscription | `preview_subscription_charge` | ✅ | ❌ |

### Saved Payment Methods

| Operation | Tool | Non-destructive | Read only |
|-----------|------|-----------------|-----------|
| List payment methods saved for a customer | `list_saved_payment_methods` | ✅ | ✅ |
| Get a payment method saved for a customer | `get_saved_payment_method` | ✅ | ✅ |
| Delete a payment method saved for a customer | `delete_saved_payment_method` | ❌ | ❌ |

### Customer Portal Sessions

| Operation | Tool | Non-destructive | Read only |
|-----------|------|-----------------|-----------|
| Create a customer portal session | `create_customer_portal_session` | ✅ | ❌ |

### Notification Settings

| Operation | Tool | Non-destructive | Read only |
|-----------|------|-----------------|-----------|
| List notification settings | `list_notification_settings` | ✅ | ✅ |
| Create a notification setting | `create_notification_setting` | ✅ | ❌ |
| Get a notification setting | `get_notification_setting` | ✅ | ✅ |
| Update a notification setting | `update_notification_setting` | ❌ | ❌ |
| Delete a notification setting | `delete_notification_setting` | ❌ | ❌ |

### Events

| Operation | Tool | Non-destructive | Read only |
|-----------|------|-----------------|-----------|
| List events | `list_events` | ✅ | ✅ |

### Notifications

| Operation | Tool | Non-destructive | Read only |
|-----------|------|-----------------|-----------|
| List notifications | `list_notifications` | ✅ | ✅ |
| Get a notification | `get_notification` | ✅ | ✅ |
| Replay a notification | `replay_notification` | ✅ | ❌ |

### Notification Logs

| Operation | Tool | Non-destructive | Read only |
|-----------|------|-----------------|-----------|
| List logs for a notification | `list_notification_logs` | ✅ | ✅ |

### Simulations

| Operation | Tool | Non-destructive | Read only |
|-----------|------|-----------------|-----------|
| List simulations | `list_simulations` | ✅ | ✅ |
| Create a simulation | `create_simulation` | ✅ | ❌ |
| Get a simulation | `get_simulation` | ✅ | ✅ |
| Update a simulation | `update_simulation` | ❌ | ❌ |

### Simulation Runs

| Operation | Tool | Non-destructive | Read only |
|-----------|------|-----------------|-----------|
| List runs for a simulation | `list_simulation_runs` | ✅ | ✅ |
| Create a run for a simulation | `create_simulation_run` | ✅ | ❌ |
| Get a run for a simulation | `get_simulation_run` | ✅ | ✅ |

### Simulation Run Events

| Operation | Tool | Non-destructive | Read only |
|-----------|------|-----------------|-----------|
| List events for a simulation run | `list_simulation_run_events` | ✅ | ✅ |
| Get an event for a simulation run | `get_simulation_run_event` | ✅ | ✅ |
| Replay an event for a simulation run | `replay_simulation_run_event` | ✅ | ❌ |

### Reports

| Operation | Tool | Non-destructive | Read only |
|-----------|------|-----------------|-----------|
| List reports | `list_reports` | ✅ | ✅ |
| Create a report | `create_report` | ✅ | ❌ |
| Get a report | `get_report` | ✅ | ✅ |
| Get a CSV file for a report | `get_report_csv` | ✅ | ✅ |

### Client-Side Tokens

| Operation | Tool | Non-destructive | Read only |
|-----------|------|-----------------|-----------|
| List client-side tokens | `list_client_side_tokens` | ✅ | ✅ |
| Create a client-side token | `create_client_side_token` | ✅ | ❌ |
| Get a client-side token | `get_client_side_token` | ✅ | ✅ |
| Revoke a client-side token | `revoke_client_side_token` | ❌ | ❌ |

</details>

## Installation

To use the MCP server, you'll need an API key. You can create and manage API keys in **Paddle > Developer tools > Authentication**:

- Sandbox: https://sandbox-vendors.paddle.com/authentication-v2
- Live: https://vendors.paddle.com/authentication-v2

To run the server in a client like Claude Desktop, Cursor or Windsurf, add the following to your MCP config:

```json
{
  "mcpServers": {
    "paddle": {
      "command": "npx",
      "args": ["-y", "@paddle/paddle-mcp", "--api-key=PADDLE_API_KEY", "--environment=(sandbox|production)", "--tools=(all|read-only|non-destructive|tool_name1,tool_name2,...)"]
    }
  }
}
```

Replace `PADDLE_API_KEY` with your API key, and pass the correct value as `environment`.

You can also filter the tools available to the MCP server by passing the `--tools` argument. Accepted values are `all`, `read-only`, `non-destructive`, or a comma-separated list of tool names. The default is `non-destructive`.

For detailed setup guides, see:

- [Claude Desktop](https://modelcontextprotocol.io/quickstart/user)
- [Cursor](https://docs.cursor.com/context/model-context-protocol)
- [Windsurf](https://docs.codeium.com/windsurf/mcp)

## Development

1. Install dependencies:

   ```bash
   pnpm install
   ```

2. Build the server:

   ```bash
   pnpm build
   ```

3. Update client to use the local build:
   ```json
   {
     "mcpServers": {
       "paddle": {
         "command": "node",
         "args": ["path/to/paddle-mcp-server/build/index.js"],
         "env": {
           "PADDLE_API_KEY": "your_api_key",
           "PADDLE_ENVIRONMENT": "sandbox",
           "PADDLE_MCP_TOOLS": "all"
         }
       }
     }
   }
   ```

   The `PADDLE_MCP_TOOLS` environment variable accepts the same values as the `--tools` argument: `all`, `read-only`, `non-destructive`, or a comma-separated list of tool names. If not set, defaults to `non-destructive`.

## Debugging

To debug the MCP server, you can use the MCP Inspector tool:

1. Run the server with the inspector:

   ```bash
   pnpm inspector
   ```

2. Open the provided URL in your browser to view and debug the MCP requests and responses.

3. Include the `--api-key` and `--environment` arguments.

## Learn more

- [Paddle developer docs](https://developer.paddle.com?utm_source=dx&utm_medium=paddle-mcp-server)
- [Paddle API reference](https://developer.paddle.com/api-reference/overview?utm_source=dx&utm_medium=paddle-mcp-server)
- [Sign up for Paddle Billing](https://login.paddle.com/signup?utm_source=dx&utm_medium=paddle-mcp-server)
