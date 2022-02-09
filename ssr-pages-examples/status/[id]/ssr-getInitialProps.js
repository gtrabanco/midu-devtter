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

  return (
    <>
      <Head>
        <title>Devitter | {devit?.content ?? 'Devit'}</title>
      </Head>
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
    </>
  );
}

DevitPage.getInitialProps = async (context) => {
  const { query } = context;
  const { id } = query;

  const apiResponse = await fetch(`${apiEndpoint}/api/devits/${id}`);

  if (apiResponse.ok) {
    return apiResponse.json();
  }

  return {};
};
