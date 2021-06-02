import { Fragment, useEffect } from 'react';
import {
  Inject,
  ScheduleComponent,
  Day,
  Week,
  WorkWeek,
  Month,
  Agenda,
} from '@syncfusion/ej2-react-schedule';
import { meetingAdapter } from '../../../../utils/meetingadapter';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { getMeetings } from '../../../../sandbox/actions/meeting';
import Loading from '../../../layout/Loading';

const ClassCalendar = ({
  classId,
  meeting: { meetings, loading },
  getMeetings,
}) => {
  useEffect(() => {
    getMeetings(classId);
  }, [getMeetings]);

  var renderedComp = <Loading />;
  if (!loading) {
    let eventData = [];

    for (let i = 0; i < meetings.length; i++) {
      const parsedMeeting = meetingAdapter(meetings[i]);
      eventData.push(parsedMeeting);
    }

    let source = {
      dataSource: eventData,
    };

    renderedComp = (
      <Fragment>
        <ScheduleComponent
          height='550px'
          eventSettings={{ dataSource: source.dataSource }}
          currentView='Agenda'
        >
          <Inject services={[Day, Week, Month, Agenda, WorkWeek]} />
        </ScheduleComponent>
      </Fragment>
    );
  }

  return renderedComp;
};

ClassCalendar.propTypes = {
  meeting: PropTypes.object.isRequired,
  getMeetings: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  meeting: state.meeting,
});

export default connect(mapStateToProps, { getMeetings })(ClassCalendar);
