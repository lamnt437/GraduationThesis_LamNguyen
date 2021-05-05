const ClassRoom = require('../models/ClassRoom');

const getRelatedClasses = async (id) => {
  // try on mongodb shell first
  const classrooms = await ClassRoom.find(
    {
      $or: [{ supervisor_ids: id }, { member_ids: id }],
    },
    { name: 1, description: 1, _id: 1 }
  );

  return classrooms;
};

module.exports.getRelatedClasses = getRelatedClasses;
