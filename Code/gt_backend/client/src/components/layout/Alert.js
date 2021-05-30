import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import styled from 'styled-components';

// const Background = styled.div`
//   width: 100%;
//   height: 100%;
//   background: rgba(0, 0, 0, 0.8);
//   position: fixed;
//   left: 0;
//   top: 0;
//   display: flex;
//   justify-content: center;
//   align-items: center;
// `;

const AlertWrapper = styled.div`
  width: 100%;
  height: 30px;
  box-shadow: 0 5px 16px rgba(0, 0, 0, 0.2);
  background: #f00;
  color: #fff;
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  left: 0;
  top: 0;
  z-index: 10;
  border-radius: 10px;
`;

// check current state of alert first, multiple alert showed, check whether content is pushed down by alert

export const Alert = (props) => {
  const { alerts } = props;

  return (
    alerts !== null &&
    alerts.length > 0 &&
    alerts.map((alert) => (
      <div key={alert.id} className={`alert alert-${alert.alertType}`}>
        {alert.msg}
      </div>
    ))
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
