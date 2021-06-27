import React from 'react';
import styles from './DocumentItem.module.css';
import CollectionsBookmarkIcon from '@material-ui/icons/CollectionsBookmark';

const DocumentItem = ({ doc }) => {
  return (
    <div className={styles.documentItem}>
      <div className={styles.documentItem__top}>
        <CollectionsBookmarkIcon className={styles.avatar} />
        <h3>{doc.filename}</h3>
      </div>

      <div className={styles.documentItem__bottom}>
        <p>Tải lên lúc: {Date(doc.created_at).toString()}</p>
        <a href={doc.link}>Tải xuống</a>
      </div>
    </div>
  );
};

export default DocumentItem;
