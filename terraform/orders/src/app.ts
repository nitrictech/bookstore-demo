import express, { Request, Response } from "express";
import { EventGridPublisherClient } from "@azure/eventgrid";
import { v4 as uuid } from "uuid";
import bodyParser from "body-parser";
import { DefaultAzureCredential } from "@azure/identity";

const app: express.Application = express();
app.use(bodyParser.json());

const PORT = process.env.PORT || 3000;
const TOPIC = process.env.AZURE_TOPIC || "terraform-order-updates";
const REGION = process.env.AZURE_REGION || "eastus";

const client = new EventGridPublisherClient(
  `https://${TOPIC}.${REGION}-1.eventgrid.azure.net/api/events`,
  "EventGrid",
  new DefaultAzureCredential()
);

app.post("/orders", async (req: Request, res: Response) => {
  await client.send([
    {
      eventType: "order.created",
      subject: req.body.orderNumber,
      dataVersion: "1.0",
      data: req.body,
    },
  ]);

  return res.status(201).json({
    message: "Order received",
    order: req.body,
  });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
});
