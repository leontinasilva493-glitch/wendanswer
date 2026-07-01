import type { Metadata } from "next";
import { Analytics } from "@/components/Analytics";
import { Header } from "@/components/Header";
import { DisclaimerFooter } from "@/components/DisclaimerFooter";
import { BottomNav } from "@/components/BottomNav";
import { site } from "@/lib/site";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: "LinkedIn Games Answers Today | WendAnswerToday.org",
    template: "%s | WendAnswerToday.org",
  },
  description: site.description,
  applicationName: site.name,
  icons: {
    icon: [
      { url: "/images/wend-logo-64.png", sizes: "64x64", type: "image/png" },
      { url: "/images/wend-logo-192.png", sizes: "192x192", type: "image/png" },
    ],
    apple: [{ url: site.logo.appleSrc, sizes: "180x180", type: "image/png" }],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <Analytics />
        <Header />
        {children}
        <DisclaimerFooter />
        <BottomNav />
      </body>
    </html>
  );
}
