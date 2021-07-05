import './Sidebar.css';
import SidebarRow from './SidebarRow';
import ChannelList from './Channel/ChannelList';
import EmojiFlagsIcon from '@material-ui/icons/EmojiFlags';
import PeopleIcon from '@material-ui/icons/People';
import ChatIcon from '@material-ui/icons/Chat';
import VideoLibraryIcon from '@material-ui/icons/VideoLibrary';
import CollectionsBookmarkIcon from '@material-ui/icons/CollectionsBookmark';
import TodayIcon from '@material-ui/icons/Today';

const Sidebar = ({ classroomName, classId }) => {
  return (
    // TODO add class name + info for sharing
    <div className='sidebar'>
      <SidebarRow title={'Lớp học: ' + classroomName} name='home' />
      <SidebarRow Icon={TodayIcon} title='Lịch lớp học' name='calendar' />
      <SidebarRow Icon={PeopleIcon} title='Thành viên' name='members' />
      <SidebarRow Icon={VideoLibraryIcon} title='Meeting' name='meetings' />
      <SidebarRow
        Icon={CollectionsBookmarkIcon}
        title='Học liệu'
        name='documents'
      />
      <ChannelList classId={classId} />
    </div>
  );
};

export default Sidebar;
