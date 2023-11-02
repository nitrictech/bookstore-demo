import { topic, bucket } from "@nitric/sdk";

const INVOICE_API_URL = process.env.INVOICE_API_URL;
const INVOICE_API_KEY = process.env.INVOICE_API_KEY;

const invoiceBucket = bucket("invoices").for("writing");

topic("order-updates").subscribe(async ctx => {
  const { payload: order } = ctx.req.json();

  const response = await fetch(`${INVOICE_API_URL}/invoices`, {
    method: "POST",
    headers: {
      "x-api-key": INVOICE_API_KEY,
    },
    body: JSON.stringify(order),
  });

  if (!response.ok) {
    console.log(`Failed to generate invoice for order ${order.orderNumber}, status code ${response.status}, ${await response.text()}`);
    throw new Error(`Failed to generate invoice for order ${order.orderNumber}`);
  }

  const invoicePdf = await response.arrayBuffer();
  await invoiceBucket.file(`${order.orderNumber}.pdf`).write(new Uint8Array(invoicePdf));
});