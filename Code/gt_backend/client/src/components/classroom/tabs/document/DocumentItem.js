import React from 'react';

const DocumentItem = ({ doc }) => {
  return (
    <div>
      <h1>{doc.filename}</h1>
      <p>{Date(doc.created_at).toString()}</p>
      <a href={doc.link}>Link</a>
    </div>
  );
};

export default DocumentItem;
