import { CheckCircle2, Image as ImageIcon, Upload as UploadIcon } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';
import { useOutletContext } from 'react-router';
import {
  PROGRESS_INTERVAL_MS,
  PROGRESS_STEP,
  REDIRECT_DELAY_MS,
} from '../lib/constants';


type UploadProps = {
  onComplete?: (base64DataUrl: string) => void;
};

const Upload = ({ onComplete }: UploadProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [progress, setProgress] = useState(0);

  const inputRef = useRef<HTMLInputElement | null>(null);
  const intervalRef = useRef<number | null>(null);
  const timeoutRef = useRef<number | null>(null);

  const { isSignedIn } = useOutletContext<AuthContext>();

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };
  }, []);

  const processFile = (nextFile: File) => {
    if (!isSignedIn) return;

    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    setFile(nextFile);
    setIsDragging(false);
    setProgress(0);

    const reader = new FileReader();
    reader.onerror = () => {
        setFile(null);
        setProgress(0);
      };
    reader.onload = () => {
      const base64DataUrl = String(reader.result ?? '');

      let current = 0;
      intervalRef.current = window.setInterval(() => {
        current = Math.min(100, current + PROGRESS_STEP);
        setProgress(current);

        if (current >= 100) {
          if (intervalRef.current) {
            window.clearInterval(intervalRef.current);
            intervalRef.current = null;
          }
          if (timeoutRef.current) {
            window.clearTimeout(timeoutRef.current);
            timeoutRef.current = null;
          }

          timeoutRef.current = window.setTimeout(() => {
            onComplete?.(base64DataUrl);
            timeoutRef.current = null;
          }, REDIRECT_DELAY_MS);
        }
      }, PROGRESS_INTERVAL_MS);
    };

    reader.readAsDataURL(nextFile);
  };

  const onInputChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    if (!isSignedIn) return;
    const nextFile = e.target.files?.[0];
    if (!nextFile) return;
    processFile(nextFile);
  };

  const preventDefaults = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const onDragEnter: React.DragEventHandler<HTMLDivElement> = (e) => {
    preventDefaults(e);
    if (!isSignedIn) return;
    setIsDragging(true);
  };

  const onDragOver: React.DragEventHandler<HTMLDivElement> = (e) => {
    preventDefaults(e);
    if (!isSignedIn) return;
    setIsDragging(true);
  };

  const onDragLeave: React.DragEventHandler<HTMLDivElement> = (e) => {
    preventDefaults(e);
    setIsDragging(false);
  };

  const onDrop: React.DragEventHandler<HTMLDivElement> = (e) => {
    preventDefaults(e);
    setIsDragging(false);
    if (!isSignedIn) return;

    const nextFile = e.dataTransfer.files?.[0];
    if (!nextFile) return;
    processFile(nextFile);
  };

  const onClickDropzone = () => {
    if (!isSignedIn) return;
    inputRef.current?.click();
  };
  return (
    <div className="upload">
  {!file ? (
    <div
      className={`dropzone ${isDragging ? 'is-dragging' : ''} ${!isSignedIn ? 'is-disabled' : ''}`}
      onClick={onClickDropzone}
      onDragEnter={onDragEnter}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
      aria-disabled={!isSignedIn}
      role="button"
      tabIndex={!isSignedIn ? -1 : 0}
    >
      <input
        ref={inputRef}
        type="file"
        className="drop-input"
        accept=".jpg, .jpeg, .png"
        disabled={!isSignedIn}
        onChange={onInputChange}
      />

      <div className="drop-content">
        <div className="drop-icon">
          <UploadIcon size={20} />
        </div>
        <p>
          {isSignedIn ? (
            "Click to upload or just drag and drop"
          ) : (
            "Sign in or sign up with Puter to upload"
          )}
        </p>
        <p className="help">Maximum file size 50 MB.</p>
      </div>
    </div>
  ) : (
    <div className="upload-status">
  <div className="status-content">
    <div className="status-icon">
      {progress === 100 ? (
        <CheckCircle2 className="check" />
      ) : (
        <ImageIcon className="image" />
      )}
    </div>

    <h3>{file.name}</h3>

    <div className='progress'>
      <div className="bar" style={{ width: `${progress}%` }} />

      <p className="status-text">
        {progress < 100 ? 'Analyzing Floor Plan...' : 'Redirecting...'}
      </p>
    </div>
  </div>
</div>
  )}
</div>
  )
}

export default Upload