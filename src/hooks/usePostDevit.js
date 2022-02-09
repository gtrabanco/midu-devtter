import { addDevit, uploadImage } from 'fb/client';
import { getDownloadURL } from 'firebase/storage';
import { useEffect, useState } from 'react';

export const POST_DEVIT_STATUS = {
  ERROR: -1,
  NONE: 0,
  UPLOADING_IMAGE: 1,
  UPLOADING_IMAGE_PAUSE: 2,
  UPLOADING_IMAGE_COMPLETED: 3,
  POSTING: 4,
  COMPLETED: 5,
};

const emptyDevit = {
  avatar: null,
  userName: null,
  userId: null,
  content: null,
  file: null,
};

export default function usePostDevit({ onError = () => {} } = {}) {
  const [status, setStatus] = useState();
  const [progress, setProgress] = useState(0.0);
  const [task, setTask] = useState(null);
  const [imgURL, setImgURL] = useState(null);
  const [file, setFile] = useState(null);
  const [devit, setDevit] = useState(emptyDevit);

  // Post Devit
  useEffect(() => {
    const { avatar, userName, userId, content, file = null } = devit;
    // Empty file or not empty file and we know the imgURL
    if (devit !== emptyDevit && (file === null || (file !== null && imgURL))) {
      setStatus(POST_DEVIT_STATUS.POSTING);
      addDevit({ avatar, userName, userId, content, imgURL })
        .then(() => setStatus(POST_DEVIT_STATUS.COMPLETED))
        .catch(() => setStatus(POST_DEVIT_STATUS.ERROR));
    }

    // No empty file and we do not know the imgURL
    if (file !== null && imgURL === null) {
      setFile(file);
    }
  }, [imgURL, devit]);

  // Upload Image if set
  useEffect(() => {
    if (file) {
      setStatus(POST_DEVIT_STATUS.UPLOADING_IMAGE);
      const task = uploadImage(file);
      setTask(task);
    }
  }, [file]);

  // Handle feedback when uploading image
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
              status = POST_DEVIT_STATUS.UPLOADING_IMAGE_PAUSE;
              break;
            case 'running':
              status = POST_DEVIT_STATUS.UPLOADING_IMAGE;
              break;
            default:
              // This should never change unless firebase library and api changed
              status = snapshot.state;
              console.error('Unknown status');
              console.log(snapshot.state);
              break;
          }
          setProgress(progress);
          setStatus(status);
        },
        (error) => {
          const status = POST_DEVIT_STATUS.ERROR;
          const progress = 0.0;
          setProgress(progress);
          setStatus(status);
          onError(error);
        },
        async () => {
          const status = POST_DEVIT_STATUS.UPLOADING_IMAGE_COMPLETED;
          const progress = 0.0;
          setProgress(progress);
          setStatus(status);
          const imgDownloadUrl = await getDownloadURL(task.snapshot.ref);
          setImgURL(imgDownloadUrl);
          setTask(null);

          setImgURL(imgDownloadUrl);
        }
      );
    }
  }, [task, onError]);

  return { task, status, progress, imgURL, postDevit: setDevit };
}
