import './Sidebar.css';
import SidebarRow from './SidebarRow';
import EmojiFlagsIcon from '@material-ui/icons/EmojiFlags';
import PeopleIcon from '@material-ui/icons/People';
import ChatIcon from '@material-ui/icons/Chat';
import VideoLibraryIcon from '@material-ui/icons/VideoLibrary';
import CollectionsBookmarkIcon from '@material-ui/icons/CollectionsBookmark';

const Sidebar = () => {
  return (
    // TODO add class name + info
    <div className='sidebar'>
      {/* <SidebarRow src={avatar} title={username} /> */}
      <SidebarRow Icon={EmojiFlagsIcon} title='Nhiệm vụ' name='tasks' />
      <SidebarRow Icon={PeopleIcon} title='Thành viên' name='members' />
      <SidebarRow Icon={ChatIcon} title='Trao đổi' name='discuss' />
      <SidebarRow Icon={VideoLibraryIcon} title='Meeting' name='meetings' />
      <SidebarRow
        Icon={CollectionsBookmarkIcon}
        title='Học liệu'
        name='documents'
      />
    </div>
  );
};

export default Sidebar;
