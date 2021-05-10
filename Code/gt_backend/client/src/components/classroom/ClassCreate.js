import React, { useState } from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { createClass } from '../../sandbox/actions/classroom';

const ClassCreate = ({ createClass }) => {
  // TODO this should be private route for teacher only
  const [classInfo, setClassInfo] = useState({
    name: '',
    description: '',
  });

  const [doneCreation, setDoneCreation] = useState(false);

  const onChange = (e) => {
    setClassInfo({ ...classInfo, [e.target.name]: e.target.value });
  };

  const onSubmit = (e) => {
    e.preventDefault();
    console.log('submt');
    console.log({
      classInfo: { name: classInfo.name, description: classInfo.description },
    });
    createClass(classInfo.name, classInfo.description);
    setDoneCreation(true);
    // TODO create redux flow like register new account
  };

  if (doneCreation) {
    return <Redirect to='/classroom' />;
  }

  return (
    <>
      {/* a form to input class info */}
      {/* then send create request to server */}
      <form onSubmit={(e) => onSubmit(e)}>
        <div className='form-group'>
          <input
            type='text'
            placeholder='Tên lớp học'
            name='name'
            value={classInfo.name}
            onChange={(e) => onChange(e)}
            required
          />
        </div>
        <div className='form-group'>
          <input
            type='text'
            placeholder='Mô tả (không bắt buộc)'
            name='description'
            value={classInfo.description}
            onChange={(e) => onChange(e)}
          />
        </div>
        <input type='submit' value='Create' />
      </form>
    </>
  );
};

export default connect(null, { createClass })(ClassCreate);
