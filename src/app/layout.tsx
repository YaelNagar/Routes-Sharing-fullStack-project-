"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import "./globals.css";
import Script from "next/script";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const userToken = localStorage.getItem("userToken");
    const publicPaths = [
      "/",
      "/pages/login",
      "/pages/signup",
      "/pages/forgetPassword",
      "/pages/noAccess",
      "/pages/Index",
    ];
    if (pathname == "/") {
      router.push("/pages/Index");
    }
    if (userToken && pathname === "/pages/login") {
      console.log("token deleted");
      localStorage.removeItem("userToken");
    }

    if (!userToken && !publicPaths.includes(pathname)) {
      router.push("/pages/noAccess");
    }
  }, [pathname, router]);

  return (
    <html lang="en">
      <head>
        {/* <link
          href="https://fonts.googleapis.com/css2?family=Great+Vibes&family=Assistant:wght@300;400;600&display=swap"
          rel="stylesheet"
        /> */}
        <link
          href="https://fonts.googleapis.com/css2?family=Pacifico&display=swap"
          rel="stylesheet"
        />
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css"
        />
      </head>
      <body>
        {children}
        <Script
          src="https://cdn.enable.co.il/licenses/enable-L352538x9gw76prm-1224-66858/init.js"
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}
