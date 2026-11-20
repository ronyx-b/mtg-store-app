import { Provider, useDispatch } from "react-redux";
import { store } from "@/services/store";
import { useEffect } from "react";
import Layout from "@/components/Layout";
import { hydrateCart } from "@/services/store/cartSlice";
import { hydrateToken } from "@/services/store/tokenSlice";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "@saeris/typeface-beleren-bold";
import "@/styles/globals.css";

function AppContent({ Component, pageProps }) {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(hydrateCart());
    dispatch(hydrateToken());
  }, [dispatch]);

  return (<>
    <Layout>
      <Component {...pageProps} />
    </Layout>
  </>);
}

export default function App({ Component, pageProps }) {
  return (
    <Provider store={store}>
      <AppContent Component={Component} pageProps={pageProps} />
    </Provider>
  );
}
