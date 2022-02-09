import ComposeDevit from 'components/ComposeDevit';
import useUser from 'hooks/useUser';
import Head from 'next/head';
import { useRouter } from 'next/router';

const VALID_FILE_TYPES = [
  'image/apng',
  'image/bmp',
  'image/gif',
  'image/jpeg',
  'image/pjpeg',
  'image/png',
  'image/svg+xml',
  'image/tiff',
  'image/webp',
  'image/x-icon',
];

export default function ComposeTweet() {
  const { user } = useUser();
  const router = useRouter();

  const handleSuccess = () => {
    router.push('/home');
  };

  return (
    <>
      <Head>
        <title>Crear un devit</title>
      </Head>
      <ComposeDevit
        user={user}
        maxNumberOfFiles={1}
        validMimeTypes={VALID_FILE_TYPES}
        onSuccess={handleSuccess}
      />
    </>
  );
}
