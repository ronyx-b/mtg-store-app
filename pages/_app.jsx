import { Provider } from "react-redux";
import { store } from "@/services/store";
import Layout from "@/components/Layout";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "@/styles/globals.css";

export default function App({ Component, pageProps }) {

  return (<>
    <Provider store={store}>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </Provider>
  </>);
}
