import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useHistory, useRouteMatch } from 'react-router-dom';
import MeetingItem from './MeetingItem';
import { fetchMeetingFromClassroom } from '../../../../services/meeting.ts';

// class MeetingList extends Component {
//   state = {
//     meetings: [],
//   };

//   async componentDidMount() {
//     const classId = this.props.classId;
//     const url = `http://localhost:3001/api/classroom/${classId}/meetings`;
//     try {
//       const response = await axios.get(url);
//       //   console.log(response);
//       this.setState({ meetings: response.data.meetings });
//     } catch (error) {
//       console.error(error);
//     }
//   }

//   render() {
//     let meetings = this.state.meetings.map((meeting) => {
//       return (
//         <MeetingItem
//           topic={meeting.topic}
//           meeting_id={meeting.meeting_id}
//           password={meeting.password}
//           start_time={meeting.start_time}
//         />
//       );
//     });
//     return <div>{meetings}</div>;
//   }
// }

const MeetingList = ({ classId }) => {
  const [meetingList, setMeetingList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const history = useHistory();
  const match = useRouteMatch();

  const onCreateHandler = (e) => {
    e.preventDefault();
    history.push(`/meeting/schedule`);
  };

  useEffect(async () => {
    try {
      const response = await fetchMeetingFromClassroom(classId);
      console.log({ response });
      if (response.data) {
        console.log('set');
        setMeetingList(response.data.meetings);
      }
      console.log({ meetingList });
      setIsLoading(false);
    } catch (err) {
      console.log(err);
      setHasError(true);
      setIsLoading(false);
    }
  }, []);

  let renderedComp = <div>Loading...</div>;

  if (!isLoading) {
    if (hasError) {
      renderedComp = <div>Can't load meeting</div>;
    } else {
      renderedComp = (
        <div>
          <button onClick={(e) => onCreateHandler(e)}>Tạo meeting mới</button>
          {Array.isArray(meetingList) &&
            meetingList.map((meeting) => (
              <MeetingItem meeting={meeting} key={meeting._id} />
            ))}
        </div>
      );
    }
  }

  return renderedComp;
};

export default MeetingList;
