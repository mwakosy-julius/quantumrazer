import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import type { Order, OrderItem } from "@prisma/client";

type OrderWithItems = Order & { items: OrderItem[] };

export function OrderConfirmation({ order }: { order: OrderWithItems }) {
  return (
    <Html>
      <Head />
      <Preview>Your order {order.orderNumber} is confirmed</Preview>
      <Body style={{ backgroundColor: "#f5f5f5", fontFamily: "Helvetica Neue, Helvetica, Arial, sans-serif" }}>
        <Container style={{ padding: "24px", maxWidth: "560px", margin: "0 auto" }}>
          <Heading style={{ color: "#111" }}>Thanks for your order</Heading>
          <Text style={{ color: "#444" }}>Order number: {order.orderNumber}</Text>
          <Section style={{ marginTop: "16px" }}>
            {order.items.map((item) => (
              <Text key={item.id} style={{ color: "#111", fontSize: "14px" }}>
                {item.productName} — {item.size} × {item.quantity} — ${Number(item.totalPrice).toFixed(2)}
              </Text>
            ))}
          </Section>
          <Text style={{ marginTop: "24px", fontWeight: 600 }}>Total: ${Number(order.total).toFixed(2)}</Text>
        </Container>
      </Body>
    </Html>
  );
}
