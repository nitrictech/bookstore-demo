import { api } from "@nitric/sdk";
import { InvoiceSchema, createInvoice } from "../common";

const invoiceApi = api("invoiceapi");

const ALLOWED_KEY =
  process.env.APIKEY || "20b75354-829f-11ee-b962-0242ac120002";

invoiceApi.post("/invoices", async (ctx) => {
  const key = ctx.req.headers["x-api-key"];
  if (key !== ALLOWED_KEY) {
    ctx.res.status = 401;
    ctx.res.body = "Unauthorized";
    return ctx;
  }

  let invoice;
  try {
    invoice = InvoiceSchema.parse(ctx.req.json());
  } catch (err) {
    ctx.res.status = 400;
    ctx.res.json(err);
  }

  // Create a PDF document
  const invoiceDoc = await createInvoice(invoice);

  ctx.res.body = invoiceDoc;
  ctx.res.status = 201;
  ctx.res.headers["Content-Type"] = ["application/pdf"];

  return ctx;
});
