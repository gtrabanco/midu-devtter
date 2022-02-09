import AppLayout from 'components/AppLayout';
import Head from 'next/head';
import 'styles/globals.css';

function MyApp({ Component, pageProps }) {
  return (
    <AppLayout>
      <Head>
        <title>Devitter</title>
      </Head>
      <Component {...pageProps} />
    </AppLayout>
  );
}

export default MyApp;
