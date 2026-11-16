import type { Metadata } from "next";
import Link from "next/link";

import { CONTACT, whatsappLink } from "@/lib/constants";
import {
  formatMoney,
  FREE_SHIPPING_MIN_SUBTOTAL,
  SHIPPING_EXPRESS,
  SHIPPING_NEXT_DAY,
  SHIPPING_PAID_FLAT,
} from "@/lib/currency";

export const metadata: Metadata = {
  title: "Help & Contact",
  description: "Contact Quantum Razer on WhatsApp or Instagram. Delivery, returns, warranty and ordering help.",
};

const faqs = [
  {
    q: "How do I order?",
    a: "Add the item to your bag and check out on the site, or send us the product name on WhatsApp and we will help you place the order.",
  },
  {
    q: "Is the laptop I want in stock?",
    a: "Each product page shows availability. If you are unsure, tap “Ask about this on WhatsApp” on the product page and we will confirm.",
  },
  {
    q: "Can you find a model that is not on the site?",
    a: "Message us on WhatsApp with the model or your budget and what you will use it for, and we will tell you what we can get.",
  },
  {
    q: "Where is my order?",
    a: "Sign in and open My Orders to see the status, or send us your order number on WhatsApp.",
  },
];

export default function HelpPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-12 md:py-16">
      <h1 className="text-[32px] font-black leading-tight text-black md:text-[40px]">Help &amp; Contact</h1>
      <p className="mt-3 text-[16px] text-grey-500">
        The fastest way to reach us is WhatsApp. Tell us what you need and we will reply there.
      </p>

      <div className="mt-8 grid gap-3 sm:grid-cols-2">
        <a
          href={whatsappLink("Hello Quantum Razer, I need help with:")}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-brand bg-[#25D366] p-5 text-black transition-opacity hover:opacity-90"
        >
          <p className="text-[13px] font-medium uppercase tracking-[0.06em]">WhatsApp</p>
          <p className="mt-1 text-[20px] font-bold">{CONTACT.whatsappDisplay}</p>
          <p className="mt-1 text-[14px]">Tap to start a chat</p>
        </a>
        <a
          href={CONTACT.instagramUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-brand border border-grey-200 p-5 text-black transition-colors hover:border-black"
        >
          <p className="text-[13px] font-medium uppercase tracking-[0.06em]">Instagram</p>
          <p className="mt-1 text-[20px] font-bold">{CONTACT.instagramHandle}</p>
          <p className="mt-1 text-[14px]">New arrivals and offers</p>
        </a>
      </div>

      <section id="delivery" className="mt-14 scroll-mt-24">
        <h2 className="text-[22px] font-bold text-black">Delivery</h2>
        <ul className="mt-4 divide-y divide-grey-200 border-y border-grey-200 text-[15px] text-black">
          <li className="flex justify-between gap-4 py-3">
            <span>Standard, orders over {formatMoney(FREE_SHIPPING_MIN_SUBTOTAL)}</span>
            <span className="font-medium">Free</span>
          </li>
          <li className="flex justify-between gap-4 py-3">
            <span>Standard, smaller orders</span>
            <span className="font-medium">{formatMoney(SHIPPING_PAID_FLAT)}</span>
          </li>
          <li className="flex justify-between gap-4 py-3">
            <span>Express</span>
            <span className="font-medium">{formatMoney(SHIPPING_EXPRESS)}</span>
          </li>
          <li className="flex justify-between gap-4 py-3">
            <span>Next day</span>
            <span className="font-medium">{formatMoney(SHIPPING_NEXT_DAY)}</span>
          </li>
        </ul>
        <p className="mt-3 text-[14px] text-grey-500">
          You choose the delivery option at checkout. <Link href="/account" className="underline">Track an order</Link>
        </p>
      </section>

      <section id="returns" className="mt-14 scroll-mt-24">
        <h2 className="text-[22px] font-bold text-black">Returns &amp; Warranty</h2>
        <p className="mt-4 text-[15px] text-black">
          If something is wrong with your order, or you have a warranty question, message us on WhatsApp with your
          order number and a photo of the problem. We will tell you the next step.
        </p>
        <a
          href={whatsappLink("Hello Quantum Razer, I have a return / warranty question. My order number is:")}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 inline-block text-[15px] font-medium text-black underline"
        >
          Message us about a return or warranty
        </a>
      </section>

      <section id="faq" className="mt-14 scroll-mt-24">
        <h2 className="text-[22px] font-bold text-black">FAQ</h2>
        <dl className="mt-4 divide-y divide-grey-200 border-y border-grey-200">
          {faqs.map((f) => (
            <div key={f.q} className="py-4">
              <dt className="text-[16px] font-medium text-black">{f.q}</dt>
              <dd className="mt-1 text-[15px] text-grey-500">{f.a}</dd>
            </div>
          ))}
        </dl>
      </section>
    </div>
  );
}
