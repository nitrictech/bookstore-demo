import { z } from "zod";

const AddressSchema = z.object({
  line1: z.string(),
  city: z.string(),
  state: z.string(),
  postalCode: z.string(),
});

const ItemSchema = z.object({
  name: z.string(),
  quantity: z.number(),
  unitPrice: z.number(),
});

export const InvoiceSchema = z.object({
  customer: z.string(),
  shippingAddress: AddressSchema,
  orderNumber: z.string(),
  items: z.array(ItemSchema),
});

export type Invoice = z.infer<typeof InvoiceSchema>;
export type InvoiceItem = z.infer<typeof ItemSchema>;
export type Address = z.infer<typeof AddressSchema>;
