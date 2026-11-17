import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { profile } from "@/content/profile";
import { SpotlightBackground } from "@/components/effects/SpotlightBackground";
import { SoundProvider } from "@/components/effects/SoundProvider";

const description = profile.tagline.replace(/\s*\n\s*/g, " ");

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL(profile.siteUrl),
  title: { default: `${profile.name} · ${profile.role}`, template: `%s · ${profile.name}` },
  description,
  openGraph: {
    title: `${profile.name} · ${profile.role}`,
    description,
    url: profile.siteUrl,
    type: "website",
    images: [{ url: "/og.png", width: 1200, height: 627, alt: `${profile.name}, ${profile.role}` }],
  },
  twitter: {
    card: "summary_large_image",
    title: `${profile.name} · ${profile.role}`,
    description,
    images: ["/og.png"],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased leading-relaxed`}>
        <SoundProvider>
          <SpotlightBackground />
          {children}
        </SoundProvider>
      </body>
    </html>
  );
}
