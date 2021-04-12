import React from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";


export const Alert = (props) => {
  const { alerts } = props;

  return alerts !== null &&
  alerts.length > 0 &&
  alerts.map(alert => (
    <div key={alert.id} className={`alert alert-${alert.alertType}`}>
      {alert.msg}
    </div>
  ))
};

// like define a schema for Alert props, with "alerts" prop as an array required
Alert.propTypes = {
  alerts: PropTypes.array.isRequired
}

// get the state from redux store and map them to prop "alerts"
const mapStateToProp = state => ({
  alerts: state.alert
})

export default connect(mapStateToProp)(Alert);
