import { useState, useEffect } from 'react';
import RequestItem from './RequestItem';
import { fetchRequest } from '../../../../services/classroom';
import '../Tab.css';

const RequestList = ({ classId, className }) => {
  const [requests, setRequests] = useState([]);

  useEffect(async () => {
    // TODO fetchrequest
    try {
      const response = await fetchRequest(classId);
      setRequests(response.data.requests);
    } catch (err) {
      console.log(err);
    }
    // add request to list
    // display list of requests
  }, []);

  const handleStateChange = (removedId) => {
    setRequests(requests.filter((request) => request._id !== removedId));
  };

  return (
    <div className={className}>
      <div style={{ 'margin-bottom': '15px' }}>
        <h1>Yêu cầu vào lớp</h1>
      </div>
      {Array.isArray(requests)
        ? requests.map((request) => (
            <RequestItem
              classId={classId}
              id={request._id}
              username={request.username}
              email={request.email}
              key={request._id}
              handleStateChange={handleStateChange}
            />
          ))
        : ''}
    </div>
  );
};

export default RequestList;
