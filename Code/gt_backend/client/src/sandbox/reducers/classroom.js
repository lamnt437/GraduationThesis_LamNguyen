import {
  LOAD_CLASS_SUCCESS,
  LOAD_CLASS_FAIL,
  CREATE_CLASS_SUCCESS,
  CREATE_CLASS_FAIL,
} from '../actions/types';

const initialState = {
  name: null,
  description: null,
  _id: null,
  posts: [],
  meetings: [],
  members: [],
  supervisors: [],
  created_at: null,
  isLoading: true,
};

export default function (state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case LOAD_CLASS_SUCCESS:
    case CREATE_CLASS_SUCCESS:
      return {
        ...state,
        ...payload,
        isLoading: false,
        isLoaded: true,
      };

    case LOAD_CLASS_FAIL:
    case CREATE_CLASS_FAIL:
      return {
        name: null,
        description: null,
        _id: null,
        posts: [],
        meetings: [],
        members: [],
        supervisors: [],
        created_at: null,
        isLoading: false,
        isLoaded: false,
      };

    default:
      return state;
  }
}

// const class = {
//     myClass: [],
//     member: {},
//     info: {
//         _id: {
//             id: null,
//             name: null,
//             avatar: null
//         }
//     },
//     noti: {
//         _id: []
//     }
// }
