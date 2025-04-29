"use client";

import { BrowserRouter } from "react-router-dom";
import "./layout.css";
import "./globals.css";
import { ConfigProvider } from "antd";
import { RecoilRoot } from "recoil";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <head></head>
      <body style={{ minHeight: "100vh", display: "flex", margin: "0" }}>
        <BrowserRouter>
          <RecoilRoot>
            <ConfigProvider
              theme={{
                token: {
                  fontFamily: "Pretendard-Medium",
                },
              }}
            >
              {children}
            </ConfigProvider>
          </RecoilRoot>
        </BrowserRouter>
      </body>
    </html>
  );
}
