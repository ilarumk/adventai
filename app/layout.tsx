import "../styles/globals.css";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Quest - AI-Powered questions to learn",
  openGraph: {
    title: "Quest - AI-Powered questions to learn",
    description:
      "Quest is an AI-powered questions platform that helps you practice questions to improve your skills",
    images: [
      {
        url: "https://xxx.xxx.com/opengraph-image",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Quest - AI-Powered questions to learn",
    description:
      "Quest is an AI-powered questions platform that helps you practice questions to improve your skills",
    images: ["https://xxx.xxx.com/opengraph-image"],
    creator: "@tmeyer_me",
  },
  metadataBase: new URL("https://advertofmath.com"),
  themeColor: "#FFF",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="scroll-smooth antialiased [font-feature-settings:'ss01']">
        {children}
      </body>
    </html>
  );
}
