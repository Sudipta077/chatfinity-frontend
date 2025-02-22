import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "./Providers";
import toast, { Toaster } from 'react-hot-toast';
import StoreProvider from "./StoreProvider";
export const metadata = {
  title: "Chatfinity",
  description: "Ai enabled chat app.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={``}
      >
        <AuthProvider>
          <StoreProvider>
            {children}
            <Toaster />
          </StoreProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
