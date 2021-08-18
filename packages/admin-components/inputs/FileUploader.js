import React from 'react';
import mime from 'mime/lite';
import md5 from 'md5';
import { Column } from 'pkg.admin-components/Flex';
import Typography from 'pkg.admin-components/Typography';

export default function FileUploader(props) {
  const {
    accepts = [],
    children = () => {},
    onError = () => {},
    onUpload = () => {},
    src = '',
  } = props;

  const fileRef = React.useRef(null);
  const [error, setError] = React.useState(null);

  function openDialog() {
    setError(null);

    if (fileRef.current) {
      fileRef.current.click();
    }
  }

  async function onChange(event) {
    const { target: { files } } = event;

    const file = files[0];
    const { name, type } = file;

    if (accepts.length && !accepts.includes(type)) {
      setError('This file type is not accepted');
      return;
    }

    if (file.size > (1000000 * 25)) {
      setError('File must be less than 25mb');
      return;
    }

    const reader = new FileReader();
    reader.onload = function() {
      const binary = reader.result.split(';base64,')[1];

      onUpload({
        file,
        fileSize: binary.length,
        hash: md5(binary),
        mimeType: type,
        originalFileName: name.split('.')[0],
      });

      event.target.value = '';
    }

    reader.readAsDataURL(file);
  }

  return (
    <Column gridGap="6px">
      <input
        ref={fileRef}
        onChange={onChange}
        type="file"
        accepts={accepts.join(',')}
        hidden
        style={{ display: 'none' }}
      />
      {!!src && (
        <img
          src={src}
          alt="Upload preview"
          style={{ width: '100%' }}
        />
      )}
      {children({
        onClick: openDialog,
        fullWidth: true,
        type: 'button',
      })}
      <Typography
        fontStyle="regular"
        fontSize="12px"
        fg={(colors) => colors.mono[600]}
      >
        25 megabyte max file size. {accepts.length ? `Accepts ${accepts.map((type) => `.${mime.getExtension(type)}`).join(', ')}` : ''}
      </Typography>
      {!!error && (
        <Typography
          fontStyle="regular"
          fontSize="12px"
          fg={(colors) => colors.red[500]}
        >
          {error}
        </Typography>
      )}
    </Column>
  );
}
