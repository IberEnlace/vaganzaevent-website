import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Vaganza Events & Entertainment | Lisboa",
  description: "Boutique concerts, cultural nights and unforgettable experiences in the heart of Lisbon.",
  metadataBase: new URL("https://vaganzaevent.com"),
  openGraph: { title: "Vaganza Events & Entertainment", description: "Lisbon nights, beautifully curated.", type: "website" }
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
