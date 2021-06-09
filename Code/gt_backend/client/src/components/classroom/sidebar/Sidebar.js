import './Sidebar.css';
import SidebarRow from './SidebarRow';
import ChannelList from './Channel/ChannelList';
import EmojiFlagsIcon from '@material-ui/icons/EmojiFlags';
import PeopleIcon from '@material-ui/icons/People';
import ChatIcon from '@material-ui/icons/Chat';
import VideoLibraryIcon from '@material-ui/icons/VideoLibrary';
import CollectionsBookmarkIcon from '@material-ui/icons/CollectionsBookmark';

const Sidebar = ({ classroomName }) => {
  return (
    // TODO add class name + info for sharing
    <div className='sidebar'>
      <SidebarRow title={classroomName} />
      <SidebarRow Icon={EmojiFlagsIcon} title='Nhiệm vụ' name='tasks' />
      <SidebarRow Icon={PeopleIcon} title='Thành viên' name='members' />
      <SidebarRow Icon={ChatIcon} title='Trao đổi' name='discuss' />
      <SidebarRow Icon={VideoLibraryIcon} title='Meeting' name='meetings' />
      <SidebarRow
        Icon={CollectionsBookmarkIcon}
        title='Học liệu'
        name='documents'
      />
      <ChannelList />
    </div>
  );
};

export default Sidebar;
