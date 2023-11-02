import express, { Request, Response } from "express";
import { BlobServiceClient } from "@azure/storage-blob";
import bodyParser from "body-parser";

const PORT = process.env.PORT || 3000;

const app: express.Application = express();
app.use(bodyParser.json());

// Retrieve your Azure Storage account connection string from an environment variable
const STORAGE_CONN_STR = process.env.AZURE_STORAGE_CONNECTION_STRING;
if (!STORAGE_CONN_STR) {
  throw Error("Azure Storage Connection string not found");
}

const INV_CONTAINER = process.env.AZURE_INVOICES_CONTAINER_NAME;
if (!INV_CONTAINER) {
  throw Error("Azure Storage Container string not found");
}

const blobServiceClient = BlobServiceClient.fromConnectionString(STORAGE_CONN_STR);
const containerClient = blobServiceClient.getContainerClient(INV_CONTAINER);

const INVOICE_API_URL = process.env.INVOICE_API_URL || "";
const INVOICE_API_KEY = process.env.INVOICE_API_KEY || "";

app.post("/handle-orders", async (req: Request, res: Response) => {
  // Handle subscription validation (Azure Event Grid)
  if (req.header("aeg-event-type") === "SubscriptionValidation") {
    const validationCode = req.body[0].data.validationCode;
    return res.status(200).send({ validationResponse: validationCode });
  }

  const orderEvents = req.body;
  if (!Array.isArray(orderEvents)) {
    return res.status(400).send("expected array of order events");
  }

  await Promise.all(
    orderEvents.map(async (orderEvent) => {
      const order = orderEvent.data;

      const response = await fetch(`${INVOICE_API_URL}/invoices`, {
        method: "POST",
        headers: {
          "x-api-key": INVOICE_API_KEY,
        },
        body: JSON.stringify(order),
      });

      if (!response.ok) {
        throw new Error(
          `Failed to generate invoice for order ${order.orderNumber}`
        );
      }
      const invoiceFile = await response.arrayBuffer();
      const blockBlobClient = containerClient.getBlockBlobClient(`${order.orderNumber}.pdf`);

      // Upload data to the blob
      await blockBlobClient.upload(invoiceFile, invoiceFile.byteLength);
    })
  );

  return res.status(200);
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
});
