# Voltage Tipper ⚡
A Simple Lightning tipping app template built with NextJS and Voltage.

To deploy, click the button below, create a free Vercel account if you don't have one, fill in the required environment variables from your Voltage node, deploy, and everything should work!

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FAustinKelsay%2Fvoltage-tipper&env=NEXT_PUBLIC_HOST,NEXT_PUBLIC_INVOICE_MACAROON,NEXT_PUBLIC_READ_MACAROON&envDescription=The%20host%20url%20for%20your%20lnd%20lightning%20node%20(not%20including%20port)%2C%20the%20invoice%20macaroon%20and%20read%20only%20macaroon.&envLink=https%3A%2F%2Fdocs.voltage.cloud%2Flnd-node-api&project-name=voltage-tipper&repository-name=voltage-tipper)

## Table of Contents
1. [Deployment](#deployment)
2. [Environment Variables](#environment-variables)
3. [API](#api)
4. [Contributing](#contributing)
5. [License](#license)

## Deployment
To deploy, click the button below, create a free Vercel account if you don't have one, fill in the required environment variables from your Voltage node, deploy, and everything should work!

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FAustinKelsay%2Fvoltage-tipper&env=NEXT_PUBLIC_HOST,NEXT_PUBLIC_INVOICE_MACAROON,NEXT_PUBLIC_READ_MACAROON&envDescription=The%20host%20url%20for%20your%20lnd%20lightning%20node%20(not%20including%20port)%2C%20the%20invoice%20macaroon%20and%20read%20only%20macaroon.&envLink=https%3A%2F%2Fdocs.voltage.cloud%2Flnd-node-api&project-name=voltage-tipper&repository-name=voltage-tipper)

## Environment Variables
- `NEXT_PUBLIC_HOST`: The host URL for your LND lightning node (not including port).
- `NEXT_PUBLIC_INVOICE_MACAROON`: The invoice macaroon.
- `NEXT_PUBLIC_READ_MACAROON`: The read-only macaroon.

#### Host
The host is your Node's 'API endpoint' you can copy it from your Voltage Dashboard, be sure to include 'https://'. Example: `https://plebdev.m.voltageapp.io`

#### Macaroons
The Invoice and Read macaroons are authentication tokens that allows you to interact with your LND node's REST API with permissions for reading data, and creating invoices. You can also grab a "Admin" macaroon for permissions to spend but that is not required here since we are only receiving through this webapp, so your funds are safu. You can find your Macaroons in your Voltage Dashboard by visiting Manage Access -> Macaroon Bakery

## API
Returns lnurlPay response object defined in [LUD-06](https://github.com/lnurl/luds/blob/luds/06.md)
`/api/lnurl`

Returns bech32 encoded lnurlPay
`/api/getlnurl`

This is your lightning address endpoint, returns lnurlPay response defined in [LUD-16](https://github.com/lnurl/luds/blob/luds/16.md)
`/.well-known/lnurlp/{NodeAlias}`

This is your callback endpoint that will return an invoice when `amount` query parameter is passed with millisat value
`/api/callback?amount=21000`


## Contributing

Contributions are welcome! Please open an issue or submit a pull request.

## License

This project is licensed under the MIT License. See the LICENSE file for details.
