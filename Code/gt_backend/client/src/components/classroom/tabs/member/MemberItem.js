import React from 'react';

const MemberItem = ({ member }) => {
  return (
    <div>
      <h1>{member.name}</h1>
      <p>{member.email}</p>
      <p>{member.role == 2 ? 'Teacher' : 'Student'}</p>
    </div>
  );
};

export default MemberItem;
