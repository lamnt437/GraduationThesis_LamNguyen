import { useState } from 'react';
import {
  Grid,
  makeStyles,
  TextField,
  Button as MuiButton,
} from '@material-ui/core';
import { findClassroom } from '../../services/classroom';
import ClassRequest from './ClassRequest';

const useStyles = makeStyles((theme) => ({
  root: {
    '& .MuiFormControl-root': {
      width: '100%',
      margin: theme.spacing(1),
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    },

    '& .MuiButton-root': {
      margin: '15px;',
      backgroundColor: '#2e81f4',
    },
  },
}));

// a form similar to create class
// but show found results directly under form
const ClassFindForm = ({ setShowModal }) => {
  const classes = useStyles();

  const [classId, setClassId] = useState('');

  const [findStatus, setFindStatus] = useState({
    finding: true,
    classroom: null,
    error: null,
  });
  const { finding, classroom, error } = findStatus;

  const onChange = (e) => {
    setClassId(e.target.value);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    console.log('finding');
    console.log({ classId });

    try {
      const response = await findClassroom(classId);
      console.log(response.data);
      setFindStatus({
        loading: false,
        classroom: response.data.classroom,
        error: null,
      });
    } catch (err) {
      setFindStatus({
        loading: false,
        classroom: null,
        error: 'Classroom not found',
      });
    }
  };

  let result = null;
  if (!finding) {
    if (error === null) {
      result = (
        <ClassRequest
          name={classroom.name}
          description={classroom.description}
          classId={classroom._id}
        />
      );
    } else {
      result = <p>{error}</p>;
    }
  }

  return (
    <form className={classes.root} onSubmit={(e) => onSubmit(e)}>
      <Grid container>
        <Grid item xs={12}>
          <TextField
            variant='outlined'
            label='Nhập Id lớp học cần tìm'
            name='classId'
            value={classId}
            onChange={(e) => onChange(e)}
            required={true}
          />

          <MuiButton
            variant='contained'
            size='large'
            color='primary'
            type='submit'
          >
            Tìm
          </MuiButton>
        </Grid>
      </Grid>
      <Grid container>{result}</Grid>
    </form>
  );
};

export default ClassFindForm;
