import { useState } from 'react';
import {
  Grid,
  makeStyles,
  TextField,
  Button as MuiButton,
} from '@material-ui/core';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { createClass } from '../../sandbox/actions/classroom';

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

const ClassCreateForm = ({ createClass, setShowModal }) => {
  const classes = useStyles();

  const [classInfo, setClassInfo] = useState({
    name: '',
    description: '',
  });
  const { name, description } = classInfo;

  const [doneCreation, setDoneCreation] = useState(false);

  const onChange = (e) => {
    setClassInfo({ ...classInfo, [e.target.name]: e.target.value });
  };

  const onSubmit = (e) => {
    e.preventDefault();
    console.log('submt');
    console.log({
      classInfo: { name, description },
    });
    createClass(name, description);
    // TODO create redux flow like register new account
    setShowModal(false);
  };

  return (
    <form className={classes.root} onSubmit={(e) => onSubmit(e)}>
      <Grid container>
        <Grid item xs={12}>
          <TextField
            variant='outlined'
            label='Tên lớp học'
            name='name'
            value={name}
            onChange={(e) => onChange(e)}
            required={true}
          />

          <TextField
            variant='outlined'
            label='Mô tả (không bắt buộc)'
            name='description'
            value={description}
            onChange={(e) => onChange(e)}
          />

          <MuiButton
            variant='contained'
            size='large'
            color='primary'
            type='submit'
          >
            Tạo
          </MuiButton>
        </Grid>
      </Grid>
    </form>
  );
};

export default connect(null, { createClass })(ClassCreateForm);
