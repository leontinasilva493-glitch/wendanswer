import type { Metadata } from "next";
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
    icon: "/icon.svg",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <Header />
        {children}
        <DisclaimerFooter />
        <BottomNav />
      </body>
    </html>
  );
}
