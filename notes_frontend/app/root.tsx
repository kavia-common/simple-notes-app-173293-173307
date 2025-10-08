import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useNavigation,
} from "@remix-run/react";
import type { LinksFunction, MetaFunction } from "@remix-run/node";

import "./tailwind.css";

// Link fonts and provide base metadata
export const links: LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
  },
];

export const meta: MetaFunction = () => {
  return [
    { title: "Simple Notes - Ocean Professional" },
    {
      name: "description",
      content:
        "Create, edit, and manage notes with a modern Remix app styled in the Ocean Professional theme.",
    },
  ];
};

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body className="h-full bg-slate-50 text-gray-900 antialiased">
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  const navigation = useNavigation();
  const isLoading = navigation.state !== "idle";

  return (
    <>
      {/* Top subtle progress bar indicator */}
      <div
        aria-hidden
        className={`fixed left-0 top-0 h-1 w-full bg-gradient-to-r from-blue-500/10 to-gray-50 transition-opacity ${
          isLoading ? "opacity-100" : "opacity-0"
        }`}
      />
      <Outlet />
    </>
  );
}
