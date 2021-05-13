import { useState, useEffect } from 'react';
import RequestItem from './RequestItem';
import { fetchRequest } from '../../../../services/classroom';

const RequestList = ({ classId }) => {
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
    <div>
      <h1>Requests</h1>
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
