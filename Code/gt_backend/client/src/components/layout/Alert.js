import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Toast from './Toast';

// check current state of alert first, multiple alert showed, check whether content is pushed down by alert

export const Alert = ({ alerts }) => {
  return (
    alerts !== null &&
    alerts.length > 0 &&
    alerts.map((alert) => {
      console.log('hello error');
      return <Toast key={alert.id} type='error' content={alert.msg} />;
    })
  );
};

// like define a schema for Alert props, with "alerts" prop as an array required
Alert.propTypes = {
  alerts: PropTypes.array.isRequired,
};

// get the state from redux store and map them to prop "alerts"
const mapStateToProp = (state) => ({
  alerts: state.alert,
});

export default connect(mapStateToProp)(Alert);
