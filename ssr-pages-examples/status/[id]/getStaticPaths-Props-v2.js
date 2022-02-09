import Devit from 'components/Devit';
import { firestore } from 'fb/admin';
import { Timestamp } from 'fb/client';
import timeAgo from 'lib/timeago';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

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

export async function getStaticPaths() {
  return {
    paths: [
      { params: { id: 'uWhrOq3Qznag0hQa6Hnm' } },
      { params: { id: 'UqSjXRrVP66zaffpXTWr' } },
    ],
    fallback: false,
  };
}

export async function getStaticProps(context) {
  const { params } = context;
  const { id = null } = params;

  if (!id) return { props: {} };

  const doc = await firestore.collection('devits').doc(id).get();

  // JSON.parse & stringify is tricki because we need a serializable
  // object but firebase return some methods as well
  if (doc) {
    return {
      props: JSON.parse(
        JSON.stringify({
          ...(doc?.data() ?? {}),
          id: doc?.id ?? null,
        })
      ),
    };
  }

  return {
    props: {},
  };
}
