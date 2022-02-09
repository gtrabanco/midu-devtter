import Avatar from 'components/Avatar';
import Button from 'components/Button';
import useDragFiles, { DRAG_STATES } from 'hooks/useDragFiles';
import usePostDevit, { POST_DEVIT_STATUS } from 'hooks/usePostDevit';
import useUser from 'hooks/useUser';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useCallback, useEffect, useRef, useState } from 'react';

const COMPOSE_STATES = {
  ERROR: -1,
  USER_NOT_KNOWN: 0,
  LOADING: 1,
  SUCCESS: 2,
};

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
  const dragRef = useRef();
  const { files, dragStatus, deleteFile } = useDragFiles({
    ref: dragRef,
    validMimeTypes: VALID_FILE_TYPES,
    maxNumberOfFiles: 1,
  });

  const { status: postStatus, progress, postDevit } = usePostDevit();
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState(COMPOSE_STATES.USER_NOT_KNOWN);
  const [file, setFile] = useState(null);

  const router = useRouter();

  const handleChange = (event) => {
    setMessage(event.target?.value ?? '');
  };

  const handleSubmit = useCallback(
    (event) => {
      event.preventDefault();
      setStatus(COMPOSE_STATES.LOADING);
      postDevit({
        avatar: user.avatar,
        userName: user.username,
        userId: user.uid,
        content: message,
        file,
      });
    },
    [file, message, user, postDevit]
  );

  const handleDeleteImage = (event) => {
    event.preventDefault();
    deleteFile();
  };

  const isUploading =
    postStatus === POST_DEVIT_STATUS.UPLOADING_IMAGE ||
    postStatus === POST_DEVIT_STATUS.UPLOADING_IMAGE_PAUSE;

  const isButtonDisabled = message.length === 0 || isUploading;

  useEffect(() => {
    if (files.length === 0 || files.length === 1) {
      setFile(files[0]);
    }
  }, [files, setFile]);

  useEffect(() => {
    if (postStatus === POST_DEVIT_STATUS.COMPLETED) {
      console.log(postStatus);
      router.push('/home');
    }
  }, [postStatus, router]);

  return (
    <>
      <Head>
        <title>Crear un devit</title>
      </Head>
      <section className="form-container">
        {user && (
          <section className="avatar-container">
            <Avatar src={user.avatar} />
          </section>
        )}
        <form onSubmit={handleSubmit}>
          <textarea
            placeholder="¿Qué está pasando?"
            value={message}
            onChange={handleChange}
            ref={dragRef}
          ></textarea>
          <div>
            <Button disabled={isButtonDisabled}>
              {isUploading ? <p>{progress} %</p> : 'Devitear'}
            </Button>
          </div>
          <div>
            <p>{message.length ?? 0}/200</p>
          </div>
        </form>
      </section>

      {status === COMPOSE_STATES.ERROR && (
        <div className="error">
          <p>The devit could not be posted</p>
        </div>
      )}

      {file && (
        <section className="remove-img">
          <button onClick={handleDeleteImage}>ⓧ</button>
          <img src={URL.createObjectURL(file)} alt="Uploaded image" />
        </section>
      )}

      <style jsx>{`
        div {
          padding: 1rem;
        }

        form {
          margin: 0;
          padding: 0.5rem;
        }

        textarea {
          outline: 0;
          margin: 0;
          padding: 1rem;
          width: 100%;
          min-height: 13rem;
          height: auto;
          border: ${dragStatus === DRAG_STATES.DRAG_OVER
            ? '3pt dashed #09f'
            : '3pt solid transparent'};
          border-radius: 0.7rem;
          resize: none;
          font-size: 1.4rem;
        }

        button {
          position: absolute;
          top: 1rem;
          left: 1rem;
          z-index: 2;
          border: none;
          border-radius: 100%;
          width: 2.2rem;
          height: 2.2rem;
          background: #666;
          opacity: 0.8;
          color: #ddd;
          font-size: 1.5rem;
          text-align: center;
          vertical-align: middle;
        }

        button:hover {
          background: #000;
          opacity: 1;
          font-weight: 800;
          cursor: pointer;
        }

        img {
          width: 100%;
          height: auto;
          border-radius: 0.8rem;
        }

        .error {
          color: red;
          font-weight: 800;
          text-align: center;
        }

        .avatar-container {
          padding-top: 20px;
          padding-left: 10px;
        }

        .form-container {
          align-items: flex-start;
          display: flex;
        }

        .remove-img {
          position: relative;
        }
      `}</style>
    </>
  );
}
