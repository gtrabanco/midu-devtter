import Avatar from 'components/Avatar';
import Button from 'components/Button';
import { addDevit, uploadImage } from 'fb/client';
import { getDownloadURL } from 'firebase/storage';
import useUser from 'hooks/useUser';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useCallback, useEffect, useState } from 'react';

const COMPOSE_STATES = {
  ERROR: -1,
  USER_NOT_KNOWN: 0,
  LOADING: 1,
  SUCCESS: 2,
};

const DRAG_IMAGE_STATES = {
  ERROR: -1,
  NONE: 0,
  DRAG_OVER: 1,
  UPDLOADING: 2,
  UPLOADING_PAUSED: 3,
  UPLOADING_COMPLETED: 4,
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
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState(COMPOSE_STATES.USER_NOT_KNOWN);

  const [drag, setDrag] = useState(DRAG_IMAGE_STATES.NONE);
  const [task, setTask] = useState(null);
  const [taskInfo, setTaskInfo] = useState({});
  const [imgURL, setImgURL] = useState(null);
  const [file, setFile] = useState(null);

  const router = useRouter();

  const postDevit = useCallback(() => {
    addDevit({
      avatar: user.avatar,
      userName: user.username,
      userId: user.uid,
      content: message,
      imgURL,
    })
      .then((data) => {
        setStatus(COMPOSE_STATES.SUCCESS);
        router.push('/home');
      })
      .catch((err) => {
        console.error(err);
        setStatus(COMPOSE_STATES.ERROR);
      });
  }, [message, user, router, imgURL]);

  useEffect(() => {
    if (task) {
      task.on(
        'state_changed',
        (snapshot) => {
          const progress = Math.floor(
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          );
          let status;
          switch (snapshot.state) {
            case 'paused':
              status = DRAG_IMAGE_STATES.UPLOADING_PAUSED;
              break;
            case 'running':
              status = DRAG_IMAGE_STATES.UPDLOADING;
              break;
            default:
              // This should never change unless firebase library and api changed
              status = snapshot.state;
              console.error('Unknown status');
              console.log(snapshot.state);
              break;
          }
          setTaskInfo({ status, progress });
        },
        (error) => {
          const status = DRAG_IMAGE_STATES.ERROR;
          const progress = -1;
          setTaskInfo({ status, progress, error });
        },
        async () => {
          // Completed upload
          setTaskInfo({});
          const imgDownloadUrl = await getDownloadURL(task.snapshot.ref);
          setImgURL(imgDownloadUrl);
          setTask(null);
          setFile(null);

          postDevit();
        }
      );
    }
  }, [task, postDevit]);

  const handleChange = (event) => {
    setMessage(event.target?.value ?? '');
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setStatus(COMPOSE_STATES.LOADING);
    if (file) {
      uploadFiles();
    } else {
      postDevit();
    }
  };

  const handleDragEnter = (event) => {
    event.preventDefault();
    setDrag(DRAG_IMAGE_STATES.DRAG_OVER);
  };

  const handleDragLeave = (event) => {
    event.preventDefault();
    setDrag(DRAG_IMAGE_STATES.NONE);
  };

  const handleDrop = (event) => {
    event.preventDefault();

    if (event.dataTransfer.files.length === 0) {
      return;
    }

    if (event.dataTransfer.files.length > 1 || imgURL !== null) {
      return alert('You can not upload more than one archive per devit.');
    }

    if (!VALID_FILE_TYPES.includes(event.dataTransfer.files[0].type)) {
      return alert(
        'You can only upload image types: gif, png, jpeg, tiff, svg, apng, webp, bmp, pjpeg and icon'
      );
    }

    setFile(event.dataTransfer.files[0]);
    setDrag(DRAG_IMAGE_STATES.NONE);
  };

  const handleDeleteImage = (event) => {
    event.preventDefault();
    setFile(null);
  };

  const uploadFiles = () => {
    if (file === null) return;
    setDrag(DRAG_IMAGE_STATES.NONE);
    const uploadTask = uploadImage(file);
    setTask(uploadTask);
  };

  const isButtonDisabled =
    message.length === 0 || status === COMPOSE_STATES.LOADING;

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
        <form>
          <textarea
            placeholder="¿Qué está pasando?"
            value={message}
            onChange={handleChange}
            onSubmit={handleSubmit}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          ></textarea>
          <div>
            <Button disabled={isButtonDisabled}>
              {taskInfo?.progress > 0 ? (
                <p>{taskInfo.progress} %</p>
              ) : (
                'Devitear'
              )}
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

      {file !== null && (
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
          border: ${drag === DRAG_IMAGE_STATES.DRAG_OVER
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
