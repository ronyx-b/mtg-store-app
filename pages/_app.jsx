import { Provider } from "react-redux";
import { store } from "@/services/store";
import { useEffect } from "react";
import Layout from "@/components/Layout";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "@saeris/typeface-beleren-bold";
import "@/styles/globals.css";

export default function App({ Component, pageProps }) {

  useEffect(() => {}, []);

  return (<>
    <Provider store={store}>
      <Layout suppressHydrationWarning={true}>
        <Component suppressHydrationWarning={true} {...pageProps} />
      </Layout>
    </Provider>
  </>);
}
