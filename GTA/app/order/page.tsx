import type { Metadata } from "next";
import Nav from "@/components/site/Nav";
import Footer from "@/components/site/Footer";
import OrderBuilder from "@/components/order/OrderBuilder";
import { MAX_PEOPLE } from "@/lib/pricing";

export const metadata: Metadata = {
  title: "Build your character",
  description:
    "Design your custom GTA-style character art. Pick a style, add-ons and premium tee, upload your photo and place your order.",
};

export default async function OrderPage({
  searchParams,
}: {
  searchParams: Promise<{ people?: string }>;
}) {
  const sp = await searchParams;
  const people = Math.min(Math.max(Number(sp.people) || 1, 1), MAX_PEOPLE);

  return (
    <>
      <Nav />
      <main>
        <OrderBuilder initialPeople={people} />
      </main>
      <Footer />
    </>
  );
}
