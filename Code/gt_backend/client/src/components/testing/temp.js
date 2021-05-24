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
