import axios from "axios";
import React, { Component } from "react";
import MeetingItem from "./MeetingItem";

class MeetingList extends Component {
  state = {
    meetings: [],
  };

  async componentDidMount() {
    const url = "http://localhost:3001/api/meeting";
    try {
      const response = await axios.get(url);
      //   console.log(response);
      this.setState({ meetings: response.data.meetings });
    } catch (error) {
      console.error(error);
    }
  }

  render() {
    let meetings = this.state.meetings.map((meeting) => {
      return (
        <MeetingItem
          meeting_id={meeting.meeting_id}
          password={meeting.password}
          start_time={meeting.start_time}
        />
      );
    });
    return <div>{meetings}</div>;
  }
}

export default MeetingList;
