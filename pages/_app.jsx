import { Provider } from "react-redux";
import { store } from "@/services/store";
import Layout from "@/components/Layout";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "@/styles/globals.css";
import { useEffect } from "react";

export default function App({ Component, pageProps }) {

  useEffect(() => {}, []);

  return (<>
    <Provider store={store}>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </Provider>
  </>);
}
