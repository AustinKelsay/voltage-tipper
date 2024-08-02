# Voltage Tipper - under construction 🚧
A Simple Lightning tipping app template built with NextJS and Voltage.

To deploy, click the button below, create a free Vercel account if you don't have one, fill in the required environment variables from your Voltage node, deploy, and everything should work!

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FAustinKelsay%2Fvoltage-tipper&env=NEXT_PUBLIC_HOST,NEXT_PUBLIC_INVOICE_MACAROON,NEXT_PUBLIC_READM_MACAROON&envDescription=The%20host%20url%20for%20your%20lnd%20lightning%20node%20(not%20including%20port)%2C%20the%20invoice%20macaroon%20and%20read%20only%20macaroon.&envLink=https%3A%2F%2Fdocs.voltage.cloud%2Flnd-node-api&project-name=voltage-tipper&repository-name=voltage-tipper)

## Table of Contents
1. [Getting Started](#getting-started)
2. [Deployment](#deployment)
3. [Environment Variables](#environment-variables)
4. [API](#api)
5. [Contributing](#contributing)
6. [License](#license)

## Introduction
A Simple Lightning tipping app template built with NextJS and Voltage.

## Getting Started
To deploy, click the button below, create a free Vercel account if you don't have one, fill in the required environment variables from your Voltage node, deploy, and everything should work!

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FAustinKelsay%2Fvoltage-tipper&env=NEXT_PUBLIC_HOST,NEXT_PUBLIC_INVOICE_MACAROON,NEXT_PUBLIC_READM_MACAROON&envDescription=The%20host%20url%20for%20your%20lnd%20lightning%20node%20(not%20including%20port)%2C%20the%20invoice%20macaroon%20and%20read%20only%20macaroon.&envLink=https%3A%2F%2Fdocs.voltage.cloud%2Flnd-node-api&project-name=voltage-tipper&repository-name=voltage-tipper)

## Deployment
To deploy, click the button below, create a free Vercel account if you don't have one, fill in the required environment variables from your Voltage node, deploy, and everything should work!
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FAustinKelsay%2Fvoltage-tipper&env=NEXT_PUBLIC_HOST,NEXT_PUBLIC_INVOICE_MACAROON,NEXT_PUBLIC_READM_MACAROON&envDescription=The%20host%20url%20for%20your%20lnd%20lightning%20node%20(not%20including%20port)%2C%20the%20invoice%20macaroon%20and%20read%20only%20macaroon.&envLink=https%3A%2F%2Fdocs.voltage.cloud%2Flnd-node-api&project-name=voltage-tipper&repository-name=voltage-tipper)

## Environment Variables
- `NEXT_PUBLIC_HOST`: The host URL for your LND lightning node (not including port).
- `NEXT_PUBLIC_INVOICE_MACAROON`: The invoice macaroon.
- `NEXT_PUBLIC_READM_MACAROON`: The read-only macaroon.

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
