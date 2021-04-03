import React, { useEffect } from "react";
import { ZoomMtg } from "@zoomus/websdk";
import axios from "axios";
import configData from "../../config.json";

// keep signature generate function in the backend side

export function ZoomMeeting(props) {
  // use effect to load all zoom module right after the module is mounted
  //   const { username } = props;
  //   console.log(username);

  useEffect(() => {
    async function initMeeting(props) {
      const { username } = props;
      console.log(username);
      // meeting info
      var meetingNumber = props.meetingNumber;
      var leaveUrl = "http://localhost:3000";
      var userName = props.username;
      var userEmail = props.email;
      var passWord = props.password;
      var role = props.role;
      var signatureEndpoint = "http://localhost:3001/api/meeting/signature";

      const meetingInfo = {
        meetingNumber,
        role,
      };

      const body = JSON.stringify(meetingInfo);

      const reqConfig = {
        headers: {
          "Content-Type": "application/json",
        },
      };

      var signResponse = await axios.post(signatureEndpoint, body, reqConfig);
      console.log(signResponse.data);

      ZoomMtg.init({
        leaveUrl: leaveUrl,
        isSupportAV: true,
        success: (success) => {
          console.log(success);

          ZoomMtg.join({
            signature: signResponse.data,
            meetingNumber: meetingNumber,
            userName: userName,
            apiKey: configData.ZOOM_API_KEY,
            userEmail: userEmail,
            passWord: passWord,
            success: (success) => {
              console.log(success);
            },
            error: (error) => {
              console.log(error);
            },
          });
        },
        error: (error) => {
          console.log(error);
        },
      });
    }

    function showMeeting() {
      const zoomRoot = document.getElementById("zmmtg-root");
      zoomRoot.style.display = "block";
    }

    showMeeting();
    ZoomMtg.setZoomJSLib("https://source.zoom.us/1.9.1/lib", "/av");
    ZoomMtg.preLoadWasm();
    ZoomMtg.prepareJssdk();
    initMeeting(props);
  }, []);

  return <div className="App">Zoom</div>;
}

export default ZoomMeeting;
