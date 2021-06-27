import { useState } from 'react';
import DocumentUpload from './DocumentUpload';
import DocumentItem from './DocumentItem';
import '../Tab.css';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { ROLE_TEACHER } from '../../../../constants/constants';

const DocumentList = ({ classId, docs, user }) => {
  const [docList, setDocList] = useState([...docs]);

  return (
    <div className='tab'>
      <div style={{ 'margin-bottom': '15px' }}>
        <h1>Danh sách tài liệu</h1>
      </div>

      {user.role == ROLE_TEACHER ? (
        <DocumentUpload
          classId={classId}
          docList={docList}
          setDocList={setDocList}
        />
      ) : (
        ''
      )}

      {Array.isArray(docList) &&
        docList.map((doc) => <DocumentItem doc={doc} key={doc._id} />)}
    </div>
  );
};

DocumentList.propTypes = {
  user: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  user: state.auth.user,
});

export default connect(mapStateToProps)(DocumentList);
