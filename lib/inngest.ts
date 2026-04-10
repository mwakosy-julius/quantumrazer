import { Inngest } from "inngest";
import { Resend } from "resend";

import { prisma } from "@/lib/prisma";
import { OrderConfirmation } from "@/emails/OrderConfirmation";

export const inngest = new Inngest({ id: "quantum-ecommerce", name: "Quantum E-commerce" });

const resendApiKey = process.env.RESEND_API_KEY;
const resend = resendApiKey ? new Resend(resendApiKey) : null;

const sendOrderConfirmation = inngest.createFunction(
  { id: "send-order-confirmation", name: "Send order confirmation email" },
  { event: "order/created" },
  async ({ event }) => {
    const orderId = event.data.orderId as string;
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        items: true,
        user: true,
      },
    });
    if (!order) return { success: false, reason: "not_found" };

    const email = order.user?.email ?? order.guestEmail;
    if (!email || !resend) return { success: false, reason: "no_email_or_resend" };

    await resend.emails.send({
      from: process.env.RESEND_FROM ?? "orders@example.com",
      to: email,
      subject: `Order confirmed — ${order.orderNumber}`,
      react: OrderConfirmation({ order }),
    });

    return { success: true, orderId: order.id };
  },
);

const syncInventory = inngest.createFunction(
  { id: "sync-inventory", name: "Normalize zero inventory" },
  { cron: "0 * * * *" },
  async () => {
    await prisma.productVariant.updateMany({
      where: { inventoryCount: { lt: 0 } },
      data: { inventoryCount: 0 },
    });
    return { synced: true };
  },
);

const orderStatusUpdated = inngest.createFunction(
  { id: "order-status-updated", name: "Order status updated hook" },
  { event: "order/status-updated" },
  async ({ event }) => {
    return { ok: true, orderId: event.data.orderId as string };
  },
);

export const inngestFunctions = [sendOrderConfirmation, syncInventory, orderStatusUpdated];
