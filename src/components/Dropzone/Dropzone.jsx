import { faUpload } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useCallback, useState } from 'react';
import { Alert, Container, Figure, Image } from 'react-bootstrap';
import { useDropzone } from 'react-dropzone';
import './Dropzone.css'
import PropTypes from "prop-types";

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
    } else if (file.size > 1048576000) {
      setError('Max file size is 10MB');
      return;
    }
    const url = URL.createObjectURL(file);
    const reader = new FileReader()
    reader.readAsDataURL(file);

    reader.onloadend = () => {
      // Do whatever you want with the file contents
      setPreview({ caption: url, name: file.name, type: file.type.split('/')[0] })
    }
  });

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: 'image/png, image/jpeg, image/gif, video/mp4, video/mov',
    maxSize: 1048576000,
    maxFiles: 1
  });

  return (
    <div {...getRootProps()}>
      <input {...getInputProps()} />
      <Container className='align-items-center justify-content-center text-center d-flex flex-column dropzone' style={{ minHeight: '30vh' }}>
        <FontAwesomeIcon className='mb-3' icon={faUpload} style={{ color: "#fc004d", }} />
        <p>Click to upload file or drag and drop.</p>
        <p style={{ fontSize: '0.8em' }}>Allowed file types: PNG, JPG, GIF, MOV, MP4 up to 100MB</p>
        {error && (<Alert variant='danger'>{error}</Alert>)}
        {preview && (
          <Figure>
            {preview.type === 'image' ? (
              <Image src={preview.caption} style={{ width: "90%" }} />)
              : (
                <video style={{ width: "90%" }} >
                  <source src={preview.caption} />
                </video>
              )}
            <p>{preview.name}</p>
          </Figure>
        )}
      </Container>
    </div>
  )
}

DropzoneComponent.propTypes = {
  setFile: PropTypes.func.isRequired,
};
