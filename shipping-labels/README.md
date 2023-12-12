<p align="center"><a href="https://nitric.io" target="_blank"><img src="https://raw.githubusercontent.com/nitrictech/nitric/main/docs/assets/nitric-logo.svg" height="120"></a></p>

## About Nitric

This is a [Nitric](https://nitric.io) TypeScript project, but Nitric is a framework for rapid development of cloud-native and serverless applications in many languages.

Using Nitric you define your apps in terms of the resources they need, then write the code for serverless function based APIs, event subscribers and scheduled jobs.

Apps built with Nitric can be deployed to AWS, Azure or Google Cloud all from the same code base so you can focus on your products, not your cloud provider.

Nitric makes it easy to:

- Create smart [serverless functions and APIs](https://nitric.io/docs/apis)
- Build reliable distributed apps that use [events](https://nitric.io/docs/messaging/topics) and/or [queues](https://nitric.io/docs/messaging/queues)
- Securely store, retrieve and rotate [secrets](https://nitric.io/docs/secrets)
- Read and write files from [buckets](https://nitric.io/docs/storage)

## Learning Nitric

Nitric provides detailed and intuitive [documentation](https://nitric.io/docs) and [guides](https://nitric.io/docs/getting-started) to help you get started quickly.

If you'd rather chat with the maintainers or community, come and join our [Discord](https://discord.gg/Webemece5C) server, [GitHub Discussions](https://github.com/nitrictech/nitric/discussions) or find us on [Twitter](https://twitter.com/nitric_io).

## About this project

This project serves as an auxilary API to remove some of the complexity from the Terraform and Nitric comparison blog found [here](). This API generates invoice PDFs from the order requests sent from the application code of the comparison projects. The request body is validated by the API before creating the PDF. It has a single route `/invoices` which accepts POST requests. An example request will have a body that looks like so.

```json
{
  "customer": "John Doe",
  "shippingAddress": {
    "line1": "123 Fake St",
    "city": "San Francisco",
    "state": "CA",
    "postalCode": "94105"
  },
  "orderNumber": "250-6880554-12345",
  "items": [
    {
      "name": "Widget",
      "quantity": 1,
      "unitPrice": 100
    },
    {
      "name": "Gadget",
      "quantity": 2,
      "unitPrice": 50
    }
  ]
}
```

You must be authenticated with the `x-api-header` header. The default API key is `20b75354-829f-11ee-b962-0242ac120002`. It's recommended you change this within the `.env` or update the API to use API security by using the features found [here](https://nitric.io/docs/apis#api-security) as the current method is not recommended for production systems.

## Running this project

To run this project you'll need the [Nitric CLI](https://nitric.io/docs/installation) installed, then you can use the CLI commands to run, build or deploy the project.

You'll also want to make sure the project's required dependencies have been installed.

```bash
# install dependencies
npm install

# run locally
npm run dev
```

## Deploying this project

To deploy this project you'll need the [Nitric CLI](https://nitric.io/docs/installation) installed, first create a stack.

```bash
nitric stack new
```

Then you can use the following command to deploy the project.

```bash
nitric up
```
