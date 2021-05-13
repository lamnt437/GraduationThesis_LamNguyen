import { useState } from 'react';
import ClassRequest from './ClassRequest';
import { findClassroom } from '../../services/classroom';

const ClassFind = () => {
  const [inputId, setInputId] = useState({
    classId: '',
  });

  const [foundClass, setFoundClass] = useState({});

  const onChange = (e) => {
    setInputId({ ...inputId, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await findClassroom(inputId.classId);
      console.log(response.data);
      setFoundClass(response.data.classroom);
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <div>
      <h1>Tìm lớp học</h1>
      <form onSubmit={(e) => onSubmit(e)}>
        <div className='form-group'>
          <label for='classId'>Nhập mã lớp học</label>
          <input
            type='text'
            onChange={(e) => onChange(e)}
            required
            placeholder='Mã lớp học'
            name='classId'
          />
        </div>
        <div className='form-group'>
          <input type='submit' value='Tìm' />
        </div>
      </form>
      {Object.entries(foundClass).length !== 0 ? (
        <ClassRequest
          name={foundClass.name}
          description={foundClass.description}
          classId={foundClass._id}
        />
      ) : (
        ''
      )}
    </div>
  );
};

export default ClassFind;
