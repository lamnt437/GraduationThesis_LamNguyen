<div>
  {/* TODO */}
  {recurrenceType == RECURRENCE_MEETING_TYPE_DAILY ? 'DAILY' : ''}
  {recurrenceType == RECURRENCE_MEETING_TYPE_WEEKLY ? 'WEEKLY' : ''}
</div>;

const fd = new FormData();
fd.append(
  'text',
  `Meeting ${meetingInfo.topic} đã bắt đầu, bạn có muốn tham gia không?`
);
try {
  const response = await addPost(fd, meeting.classroom);
} catch (err) {
  console.log(err);
}

const obj = {
  content_scripts: [
    {
      js: ['jquery.min.js', 'https://kit.fontawesome.com/2eaa5d7b87.js'],
      matches: ['http://*/*', 'https://*/*'],
    },
  ],
  content_security_policy:
    "script-src 'self' https://zoom.us/ https://source.zoom.us/; script-src-elem 'self' https://zoom.us/ https://source.zoom.us/; object-src 'self'; default-src 'none'; img-src 'self'; style-src: 'self'; font-src 'self';",
};

if (!loading) {
  if (!_.isEmpty(error) && error.status == 401) {
    renderedComp = (
      <div>
        <ClassItem />
        <ClassRequest classId={params.id} />
      </div>
    );
  } else if (!_.isEmpty(error) && error.status == 404) {
    renderedComp = <NotFound />;
  } else {
    renderedComp = (
      <ClassDetailComponent
        name={classroom.name}
        description={classroom.description}
        classId={classroom._id}
      />
    );
  }
}
