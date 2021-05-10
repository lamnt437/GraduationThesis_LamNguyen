import './Sidebar.css';
import SidebarRow from './SidebarRow';
import EmojiFlagsIcon from '@material-ui/icons/EmojiFlags';
import PeopleIcon from '@material-ui/icons/People';
import ChatIcon from '@material-ui/icons/Chat';
import VideoLibraryIcon from '@material-ui/icons/VideoLibrary';

const Sidebar = ({ username, avatar }) => {
  return (
    // TODO after having designed sub Router, create navigation inside sidebar
    <div className='sidebar'>
      {/* <SidebarRow src={avatar} title={username} /> */}
      <SidebarRow Icon={EmojiFlagsIcon} title='Nhiệm vụ' name='tasks' />
      <SidebarRow Icon={PeopleIcon} title='Thành viên' name='members' />
      <SidebarRow Icon={ChatIcon} title='Trao đổi' name='discuss' />
      <SidebarRow Icon={VideoLibraryIcon} title='Meeting' name='meetings' />
    </div>
  );
};

export default Sidebar;
