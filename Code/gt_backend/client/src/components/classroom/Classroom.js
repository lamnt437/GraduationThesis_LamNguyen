import React, { useState, useEffect } from 'react';
import { fetchClassRoom } from '../../services/classroom';
import ClassOverview from './ClassOverview';
import ClassDetail from './ClassDetail';

export const Classroom = (props) => {
  const [classContent, setClassContent] = useState({});
  const [isRelated, setIsRelated] = useState(false);
  useEffect(async () => {
    const res = await fetchClassRoom(id);
    const classroom = res.data;
    const isRelated = res.data.isRelated;

    if (isRelated) {
      setIsRelated(true);
    }

    setClassContent(classroom);
  }, []);

  if (isRelated) {
    return <ClassDetail />;
  } else return <ClassOverview />;
};
