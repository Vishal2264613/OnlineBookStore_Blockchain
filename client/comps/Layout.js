import Head from "next/head";
import AddBook from "./AddBook";
import Footer from "./Footer";
import Navbar from "./Navbar";

const Layout = ({ children }) => {
  return (
    <>
      <Head>
        <title>Pyramid Books | {children.type.name}</title>
        <meta name="keywords" content="Books" />
      </Head>
      <div>
        <Navbar />

        {children}

        <Footer />
      </div>
    </>
  );
};

export default Layout;
