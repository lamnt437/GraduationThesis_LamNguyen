import React from 'react';
import axios from 'axios';

const ClassRequest = (props) => {
  const requestButtonClickHandler = (e) => {
    e.preventDefault();

    const url = `http://localhost:3001/api/classroom/${props.classId}/request`;

    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    };
    try {
      const res = axios.post(url, {}, config);
      console.log(res);
    } catch (err) {
      console.error(err.message);
    }
  };

  return (
    <div>
      {/* basic classroom info */}
      {/* button send request */}
      <button onClick={(e) => requestButtonClickHandler(e)}>
        Request to join
      </button>
    </div>
  );
};

export default ClassRequest;
