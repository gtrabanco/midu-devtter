import Avatar from 'components/Avatar';
import Button from 'components/Button';
import useDragFiles, { DRAG_STATES } from 'hooks/useDragFiles';
import usePostDevit, { POST_DEVIT_STATUS } from 'hooks/usePostDevit';
import { useCallback, useEffect, useRef, useState } from 'react';

export default function ComposeDevit({
  user,
  maxNumberOfFiles = 1,
  validMimeTypes = [],
  onSuccess = () => {},
  onError = () => {},
  onStatusUpdate = () => {},
} = {}) {
  // Hooks
  const dragRef = useRef();
  const { files, dragStatus, deleteFile } = useDragFiles({
    ref: dragRef,
    validMimeTypes,
    maxNumberOfFiles,
  });

  const { status: postStatus, progress, postDevit } = usePostDevit();
  const [message, setMessage] = useState('');
  const [file, setFile] = useState(null);

  // useEffects
  useEffect(() => {
    if (files.length === 0 || files.length === 1) {
      setFile(files[0]);
    }
  }, [files, setFile]);

  useEffect(() => {
    onStatusUpdate(postStatus);

    if (postStatus === POST_DEVIT_STATUS.COMPLETED) {
      onSuccess();
    }

    if (postStatus === POST_DEVIT_STATUS.ERROR) {
      onError();
    }
  }, [postStatus, onSuccess, onError, onStatusUpdate]);

  // Handle events
  const handleChange = (event) => {
    setMessage(event.target?.value ?? '');
  };

  const handleSubmit = useCallback(
    (event) => {
      event.preventDefault();
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

  // helpers for rendering
  const isUploading =
    postStatus === POST_DEVIT_STATUS.UPLOADING_IMAGE ||
    postStatus === POST_DEVIT_STATUS.UPLOADING_IMAGE_PAUSE;

  const isButtonDisabled = message.length === 0 || isUploading;

  return (
    <>
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

      {postStatus === POST_DEVIT_STATUS.ERROR && (
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
