import { api, topic } from "@nitric/sdk";

const ordersApi = api("orders");
const ordersTopic = topic("order-updates").for("publishing");

ordersApi.post("/order", async ctx => {
  const order = ctx.req.json()
  await ordersTopic.publish(order);
});