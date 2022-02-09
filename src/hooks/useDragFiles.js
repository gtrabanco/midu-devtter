import { useEffect, useState } from 'react';

export const DRAG_STATES = {
  ERROR: -1,
  NONE: 0,
  DRAG_OVER: 1,
};

export const DRAG_ERROR_TYPE = {
  MAX_FILES_REACHED: 1,
  NO_FILES_TO_DROP: 2,
  INVALID_MIMETYPE: 3,
};

export default function useDragFiles({
  ref,
  onDropComplete = () => {},
  onDragEnterComplete = () => {},
  onDragLeaveComplete = () => {},
  onError = () => {},
  validMimeTypes = [],
  maxNumberOfFiles = -1,
}) {
  const [files, setFiles] = useState([]);
  const [dragStatus, setDragStatus] = useState(DRAG_STATES.NONE);

  const deleteFile = (index = null) => {
    if (index === -1 || index === null) {
      setFiles([]);
    } else if (files.at(index)) {
      setFiles(files.splice(index, 1));
    }
  };

  useEffect(() => {
    const handleDragEnter = (event) => {
      event.preventDefault();
      setDragStatus(DRAG_STATES.DRAG_OVER);
      onDragEnterComplete(event);
    };

    const handleDragLeave = (event) => {
      event.preventDefault();
      setDragStatus(DRAG_STATES.NONE);
      onDragLeaveComplete(event);
    };

    const handleDrop = (event) => {
      event.preventDefault();

      if (event.dataTransfer.files.length === 0) {
        onError(DRAG_ERROR_TYPE.NO_FILES_TO_DROP, event);
        return;
      }

      if (
        validMimeTypes.length > 0 &&
        !validMimeTypes.includes(event.dataTransfer.files[0].type)
      ) {
        onError(DRAG_ERROR_TYPE.INVALID_MIMETYPE, event);
        return;
      }

      if (
        maxNumberOfFiles > 0 &&
        (files.length >= maxNumberOfFiles ||
          files.length + event.dataTransfer.files.length > maxNumberOfFiles)
      ) {
        onError(DRAG_ERROR_TYPE.MAX_FILES_REACHED, event);
        return;
      }

      setFiles(event.dataTransfer.files);
      setDragStatus(DRAG_STATES.NONE);
      onDropComplete(event);
    };

    ref?.current?.addEventListener('drop', handleDrop);
    ref?.current?.addEventListener('DragEnter', handleDragEnter);
    ref?.current?.addEventListener('DragLeave', handleDragLeave);
  }, [
    ref,
    onDropComplete,
    onDragEnterComplete,
    onDragLeaveComplete,
    onError,
    files,
    setFiles,
    setDragStatus,
    validMimeTypes,
    maxNumberOfFiles,
  ]);

  return { files, dragStatus, deleteFile };
}
