import type { Metadata } from "next";
import Nav from "@/components/site/Nav";
import Footer from "@/components/site/Footer";
import PhotoPreview from "@/components/order/PhotoPreview";
import SectionHeading from "@/components/site/SectionHeading";

export const metadata: Metadata = {
  title: "Free preview",
  description:
    "Upload a selfie and get an instant AI preview of yourself as a GTA V style character. Free to try.",
};

export default function PreviewPage() {
  return (
    <>
      <Nav />
      <main className="pt-28 sm:pt-32">
        <section className="mx-auto max-w-7xl px-4 pb-24 sm:px-6">
          <SectionHeading
            eyebrow="Try it free"
            title={<>See yourself in GTA V style</>}
            subtitle="Upload a clear selfie and get an instant AI preview of your character. Love it? Order the hand-finished, high-resolution version."
          />
          <div className="mt-12">
            <PhotoPreview />
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
