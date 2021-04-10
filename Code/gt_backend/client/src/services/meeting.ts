const axios = require('axios');

export async function fetchMeeting() {
    const url = "http://localhost:3001/api/meeting";

    // TODO what to return if error occurs 
    try {
      const response = await axios.get(url);
      return response.data;
    } catch (error) {
      console.error(error);
    }
}