import React, { Component, Fragment } from 'react';
import {
  Inject,
  ScheduleComponent,
  Day,
  Week,
  WorkWeek,
  Month,
  Agenda,
} from '@syncfusion/ej2-react-schedule';
import { fetchMeetingFromClassroom } from '../../../../services/meeting';
import { meetingAdapter } from '../../../../utils/meetingadapter';

class ClassCalendar extends Component {
  state = {
    meetings: [],
    isLoading: true,
  };

  async componentDidMount() {
    const classId = this.props.classId;
    try {
      const response = await fetchMeetingFromClassroom(classId);
      this.setState({ meetings: response.data.meetings, isLoading: false });
      console.log({ state: this.state });
    } catch (err) {
      console.log(err);
      this.setState({ isLoading: false });
    }
  }

  render() {
    let eventData = [];

    for (let i = 0; i < this.state.meetings.length; i++) {
      const parsedMeeting = meetingAdapter(this.state.meetings[i]);
      eventData.push(parsedMeeting);
    }

    let source = {
      dataSource: eventData,
    };

    return (
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
}

export default ClassCalendar;
