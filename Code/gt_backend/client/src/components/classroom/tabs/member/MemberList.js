import React, { useState, useEffect } from 'react';
import { fetchMembers, fetchSupervisors } from '../../../../services/classroom';
import MemberItem from './MemberItem';

const MemberList = ({ classId, className }) => {
  const [members, setMembers] = useState([]);
  const [supervisors, setSupervisors] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(async () => {
    try {
      const memRes = await fetchMembers(classId);
      setMembers(memRes.data?.members);

      const supRes = await fetchSupervisors(classId);
      setSupervisors(supRes.data?.supervisors);

      setIsLoading(false);
    } catch (err) {
      console.log(err);
      setIsLoading(false);
      setHasError(true);
    }
  }, []);

  let render = <div>Loading....</div>;
  if (!isLoading) {
    if (hasError) {
      render = <div>Error loading members</div>;
    } else {
      render = (
        <div className={className}>
          {Array.isArray(members) &&
            members.map((member) => (
              <MemberItem member={member} key={member._id} />
            ))}
          {Array.isArray(supervisors) &&
            supervisors.map((supervisor) => (
              <MemberItem member={supervisor} key={supervisor._id} />
            ))}
        </div>
      );
    }
  }

  return render;
};

export default MemberList;
