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

  const handleClick = () => {
    router.back();
  };

  return (
    <>
      <Head>
        <title>Crear un devit</title>
      </Head>
      <header>
        <button onClick={handleClick}>Cancelar</button>
      </header>
      <ComposeDevit
        user={user}
        maxNumberOfFiles={1}
        validMimeTypes={VALID_FILE_TYPES}
        onSuccess={handleSuccess}
      />
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
          font-size: 1rem;
        }
        button:hover {
          color: #09f;
        }
      `}</style>
    </>
  );
}
