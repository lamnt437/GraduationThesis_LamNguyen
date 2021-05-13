import { approveRequest } from '../../../../services/classroom';

const RequestItem = ({ classId, id, username, email, handleStateChange }) => {
  const approveRequestHandler = async (e) => {
    e.preventDefault();

    try {
      const response = await approveRequest(classId, id);
      console.log('approved!');
      console.log(response);
      handleStateChange(id);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div>
      <h3>{username}</h3>
      <p>{email}</p>
      <button onClick={(e) => approveRequestHandler(e)}>Chấp nhận</button>
    </div>
  );
};

export default RequestItem;
