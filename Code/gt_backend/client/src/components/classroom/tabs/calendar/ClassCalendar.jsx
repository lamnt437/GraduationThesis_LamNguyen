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
import '../Tab.css';

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
      <div className='tab'>
        <div style={{ 'margin-bottom': '15px' }}>
          <h1>Lịch lớp học</h1>
        </div>
        <ScheduleComponent
          height='550px'
          eventSettings={{ dataSource: source.dataSource }}
          currentView='Week'
        >
          <Inject services={[Day, Week, Month, Agenda, WorkWeek]} />
        </ScheduleComponent>
      </div>
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
