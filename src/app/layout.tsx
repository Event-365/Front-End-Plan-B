import type { Metadata, Viewport } from "next";
import "@fontsource-variable/inter/wght.css";
import "./globals.css";
import { PostHogProvider } from "./_components/PostHogProvider";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL("https://www.youreventpro.gr"),
  title:
    "Οργάνωσε το τέλειο πάρτι ή event: χώροι, catering, διακόσμηση & ψυχαγωγοί | YourEvent",
  description:
    "Βρες τους καλύτερους επαγγελματίες για το πάρτι ή event σου στην Ελλάδα: χώρους, catering, διακόσμηση, τούρτες, ψυχαγωγούς και φωτογράφους.",
  icons: {
    icon: [
      { url: "/redicon48.png", sizes: "48x48", type: "image/png" },
      { url: "/redicon192.png", sizes: "192x192", type: "image/png" },
    ],
    apple: "/redicon192.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="el" className="h-full antialiased">
      <body className="min-h-full">
        <PostHogProvider>{children}</PostHogProvider>
      </body>
    </html>
  );
}
