import "@/styles/globals.css";
import Layout from "@/comps/Layout.js";
import { useState, useEffect } from "react";
import { connectWallet, checkIfWalletConnected } from "@/pages/web3";

export default function App({ Component, pageProps }) {
  return (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  );
}
