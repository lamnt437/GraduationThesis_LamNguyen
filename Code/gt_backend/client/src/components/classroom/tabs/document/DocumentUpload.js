import React from 'react';

const DocumentUpload = () => {
  let inputFileComp = null;

  const selectedDocHandler = (e) => {
    // upload
    console.log('upload');
  };

  return (
    <div>
      <form>
        <input
          onChange={(e) => selectedDocHandler(e)}
          type='file'
          ref={(inputFile) => (inputFileComp = inputFile)}
          style={{ display: 'none' }}
        />
      </form>
      <button onClick={(e) => inputFileComp.click(e)}>Tải tài liệu lên</button>
    </div>
  );
};

export default DocumentUpload;
