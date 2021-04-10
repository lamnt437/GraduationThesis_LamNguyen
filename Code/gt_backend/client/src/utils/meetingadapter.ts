
export function meetingAdapter(meeting: any) {
    const { start_time, duration, topic } = meeting;

    const startTime = new Date(start_time);
    // const formattedStartTime = dateFormat(startTime, "yyyy-mm-dd'T'HH:MM:ssZ");

    const endTime = new Date(new Date(start_time).getTime() + duration * 60000);
    // const formattedEndTime = dateFormat(endTime, "yyyy-mm-dd'T'HH:MM:ssZ");

    const parsedMeeting = {
        // // Subject: topic,
        Subject: topic,
        StartTime: startTime,
        EndTime: endTime
    }

    return parsedMeeting;
}