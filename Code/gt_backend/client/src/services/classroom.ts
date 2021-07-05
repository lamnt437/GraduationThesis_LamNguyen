import axios from 'axios';

const url = '/api/classroom';

export const fetchClassRooms = async () => {
  try {
    const classrooms = await axios.get(url);
    return classrooms;
  } catch (err) {
    console.log(err.message);
  }
};

export const fetchClassroom = async (id: String) => {
  const res = await axios.get(url + `/${id}`);
  return res;
};

export const findClassroom = async (id: String) => {
  const res = await axios.get(url + `/find?id=${id}`);
  return res;
};

export const requestClassroom = async (classId: String) => {
  const url = `/api/classroom/${classId}/request`;

  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const res = axios.post(url, {}, config);

  return res;
};

// route  PUT /api/classroom/:id/request/:reqId
// desc   approve request to join
// access Private supervisors
export const approveRequest = async (classId: String, requestId: String) => {
  const url = `/api/classroom/${classId}/request/${requestId}`;

  const res = axios.put(url);
  return res;
};

// route GET /api/classroom/:id/request
export const fetchRequest = async (classId: String) => {
  const res = await axios.get(`${url}/${classId}/request`);
  return res;
};

export const fetchMembers = async (id: String) => {
  const res = await axios.get(url + `/${id}/members`);

  return res;
};

export const fetchSupervisors = async (id: String) => {
  const res = await axios.get(url + `/${id}/supervisors`);

  return res;
};

export const fetchPosts = async (id: String) => {
  const res = await axios.get(url + `/${id}/posts`);

  return res;
};

export const fetchFilteredPosts = async (classId: String, topic: String) => {
  var res;
  if (!topic) {
    res = await axios.get(url + `/${classId}/posts`);
  } else {
    console.log({ topicClassroomService: topic });
    res = await axios.get(url + `/${classId}/feed/${topic}`);
  }

  return res;
};

export const addPost = async (fd: FormData, classId: String) => {
  const url = `/api/classroom/${classId}/posts`;

  const response = await axios.put(url, fd);

  return response;
};

export const addDoc = async (fd: FormData, classId: String) => {
  const url = `/api/classroom/${classId}/docs`;

  const response = await axios.put(url, fd);

  return response;
};

export const addMeeting = async (
  classId: String,
  topic: String,
  description: String,
  start_time: Date,
  duration: Number,
  password: String,
  type: Number,
  recurrence: any
) => {
  const url = `/api/classroom/${classId}/meetings`;

  const meeting = {
    topic,
    description,
    start_time,
    duration,
    password,
    type,
    recurrence,
  };

  const body = JSON.stringify(meeting);
  console.log(body);

  const reqConfig = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const response = await axios.put(url, body, reqConfig);
  return response;
};

export const fetchPostImageUrl = (image: String) => {
  return `/api/sandbox/images/${image}`;
};

export const fetchTopicDetail = async (topicId: String) => {
  // handle empty topic
  var topic;
  if (!topicId) {
    topic = {
      text: 'General',
    };
  } else {
    topic = await axios.get(`/api/topic/${topicId}`);
  }

  return topic;
};
