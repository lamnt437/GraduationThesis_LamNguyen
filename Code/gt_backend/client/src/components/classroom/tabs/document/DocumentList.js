import React, { useState } from 'react';
import DocumentUpload from './DocumentUpload';
import DocumentItem from './DocumentItem';
import '../Tab.css';

const DocumentList = ({ classId, docs }) => {
  const [docList, setDocList] = useState([...docs]);

  return (
    <div className='tab'>
      <DocumentUpload
        classId={classId}
        docList={docList}
        setDocList={setDocList}
      />
      <h1>Danh sách tài liệu</h1>
      {Array.isArray(docList) &&
        docList.map((doc) => <DocumentItem doc={doc} key={doc._id} />)}
    </div>
  );
};

export default DocumentList;
