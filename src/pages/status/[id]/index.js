import Devit from 'components/Devit';
import { Timestamp } from 'fb/client';
import timeAgo from 'lib/timeago';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

const apiEndpoint = 'http://localhost:3000';

function normalizeDevit(devit) {
  try {
    const normalizedCreatedAt = new Timestamp(
      devit?.createdAt?._seconds,
      devit?.createdAt?._nanoseconds
    );
    const createdAtDate = normalizedCreatedAt.toDate();
    const timeago = timeAgo(createdAtDate);

    const normalizedDevit = {
      ...devit,
      createdAt: normalizedCreatedAt,
      timeago,
    };

    return normalizedDevit;
  } catch (e) {
    console.error(e);
  }

  return devit;
}

export default function DevitPage(props) {
  const router = useRouter();
  const devit = normalizeDevit(props);

  useEffect(() => {
    if (!devit?.content || !devit?.createdAt) {
      router.push('/home');
    }
  }, [devit, router]);

  const handleClick = () => {
    router.back();
  };

  return (
    <>
      <Head>
        <title>Devitter | {devit?.content ?? 'Devit'}</title>
      </Head>
      <header>
        <button onClick={handleClick}>&lt; Atrás</button>
      </header>
      {devit && (
        <Devit
          id={devit?.id}
          avatar={devit?.avatar}
          username={devit?.userName}
          content={devit?.content}
          createdat={devit?.createdAt}
          timeago={devit?.timeago}
          imgURL={devit?.imgURL ?? null}
          userId={devit?.userId}
        />
      )}
      <style jsx>{`
        header {
          align-items: center;
          background: #ffffffaa;
          backdrop-filter: blur(5px);
          border-bottom: 1px solid #eee;
          height: 49px;
          display: flex;
          position: sticky;
          top: 0;
          width: 100%;
        }
        button {
          background: transparent;
          border: none;
          border-radius: 5rem;
          font-size: 1rem;
        }
        button:hover {
          color: #09f;
        }
      `}</style>
    </>
  );
}

export async function getServerSideProps(context) {
  const { params } = context;
  const { id } = params;

  const apiResponse = await fetch(`${apiEndpoint}/api/devits/${id}`);

  if (apiResponse.ok) {
    return {
      props: apiResponse.json(),
    };
  }

  return {
    props: {},
  };
}
