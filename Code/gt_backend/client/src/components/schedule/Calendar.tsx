import React, { Component, Fragment } from 'react';
import {
  Inject,
  ScheduleComponent,
  Day,
  Week,
  WorkWeek,
  Month,
  Agenda,
  EventSettingsModel,
} from '@syncfusion/ej2-react-schedule';
// import { extend } from "@syncfusion/ej2-base";
import { meetingAdapter } from '../../utils/meetingadapter';
import { fetchMeeting } from '../../services/meeting';

class Calendar extends Component {
  state = {
    // must process meeting time first ? how?
    meetings: [
      {
        _id: '60668b53033eb138d860bedb',
        meeting_id: '73400603504',
        start_time: '2021-04-02T03:11:14.000Z',
        password: '123456',
        length: 40,
        __v: 0,
      },
    ],
  };

  private localData: EventSettingsModel = {
    dataSource: [
      {
        EndTime: new Date(2021, 3, 9, 6, 0),
        StartTime: new Date(2021, 3, 9, 4, 0),
      },
    ],
  };

  async componentDidMount() {
    const meetings = await fetchMeeting();
    this.setState({ meetings: meetings.meetings });
  }

  render() {
    let eventData: Object[] = [];

    for (let i = 0; i < this.state.meetings.length; i++) {
      const parsedMeeting = meetingAdapter(this.state.meetings[i]);
      eventData.push(parsedMeeting);
    }

    // let overviewEvents: { [key: string]: Date }[] = extend([], eventData, undefined, true) as { [key: string]: Date }[];
    // console.log(typeof overviewEvents);
    let source: EventSettingsModel = {
      dataSource: eventData,
    };

    console.log({ localData: this.localData.dataSource });
    console.log({ dynamicData: source.dataSource });
    return (
      <Fragment>
        <ScheduleComponent eventSettings={{ dataSource: source.dataSource }}>
          <Inject services={[Day, Week, WorkWeek, Month, Agenda]} />
        </ScheduleComponent>
      </Fragment>
    );
  }
}

export default Calendar;
