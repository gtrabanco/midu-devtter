import Devit from 'components/Devit';
import { Timestamp } from 'fb/client';
import timeAgo from 'lib/timeago';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

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

export default function DevitPage() {
  const [devit, setDevit] = useState({});
  const router = useRouter();
  const [id, setId] = useState(null);

  useEffect(() => {
    setId(router.query?.id);
  }, [setId, router]);

  useEffect(() => {
    id &&
      fetch(`/api/devits/${id}`)
        .then((res) => res.json())
        .then(normalizeDevit)
        .then(setDevit)
        .catch(() => {
          router.push('/home');
        });
  }, [setDevit, id, router]);
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
