import { faUpload } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useCallback, useState } from 'react';
import { Alert, Container, Figure, Image } from 'react-bootstrap';
import { useDropzone } from 'react-dropzone';
import './Dropzone.css'

export default function DropzoneComponent({ setFile }) {
  const [error, setError] = useState(null);
  const [preview, setPreview] = useState(null);

  const onDrop = useCallback(acceptedFiles => {
    setError(null);
    const file = acceptedFiles[0];
    setFile(file);
    
    if (
      file.type.split('/')[1] !== 'gif' &&
      file.type.split('/')[1] !== 'mp4' &&
      file.type.split('/')[1] !== 'png' &&
      file.type.split('/')[1] !== 'jpeg' &&
      file.type.split('/')[1] !== 'mov'
    ) {
      setError('Invalid file type!');
      return;
    }

    if (file.size <= 0) {
      setError('Cannot upload empty file!');
      return;
    } else if (file.size > 10485760) {
      setError('Max file size is 10MB');
      return;
    }

    const reader = new FileReader()
    reader.readAsDataURL(file);

    reader.onloadend = () => {
      // Do whatever you want with the file contents
      setPreview({ caption: reader.result, name: file.name })
    }
  });

  const { getRootProps, getInputProps } = useDropzone({
    accept: 'image/png, image/jpeg, image/gif, video/mp4, video/mov',
    maxSize: 10485760,
    onDrop
  });

  return (
    <div {...getRootProps()}>
      <input {...getInputProps()} />
      <Container className='align-items-center justify-content-center text-center d-flex flex-column dropzone' style={{ minHeight: '30vh' }}>
        <FontAwesomeIcon className='mb-3' icon={faUpload} style={{ color: "#fc004d", }} />
        <p>Click to upload file or drag and drop.</p>
        <p style={{ fontSize: '0.8em' }}>Allowed file types: PNG, JPG, GIF, MOV, MP4 up to 10MB</p>
        {error && (<Alert variant='danger'>{error}</Alert>)}
        {preview && (
          <Figure>
            <Image src={preview.caption} style={{ width: "100%" }} />
            <p>{preview.name}</p>
          </Figure>
        )}
      </Container>
    </div>
  )
}