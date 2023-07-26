import Script from "next/script";
import Head from "next/head";
import styles from "@/styles/Home.module.scss";
import HomePage from "../components/Home/HomePage";
import Header from "../components/Header/Header";

export default function Home() {
  return (
    <>
      <Head>
        <title>Invoice Dragon</title>
        <title>
          Invoice Dragon - Create PDF Invoices and Receipts for Free
        </title>
        <meta
          property="og:title"
          content="Invoice Dragon - Create PDF Invoices and Receipts for Free"
        />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="/assets/icon.png" />
        <meta
          property="og:description"
          content="Create professional Invoices and Receipts effortlessly with Invoice Dragon and download as PDF for easy sharing and record-keeping. And it's all for free!"
        />
        <meta
          name="description"
          content="Create professional Invoices and Receipts effortlessly with Invoice Dragon and download as PDF for easy sharing and record-keeping. And it's all for free!"
        />
        <meta name="application-name" content="Invoice Dragon" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        <script
          async
          src="https://laplantedevanalytics.netlify.app/script.js"
          data-website-id="9b5a586a-b8e5-45f0-a511-ed98c6a8fa4d"
        ></script>
      </Head>
      <main className={styles.main}>
        <Header />
        <HomePage />
      </main>
    </>
  );
}
