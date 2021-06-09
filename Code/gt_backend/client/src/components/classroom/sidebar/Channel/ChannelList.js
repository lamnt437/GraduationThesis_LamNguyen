import classes from './ChannelList.module.css';
import ChannelItem from './ChannelItem';
import styled from 'styled-components';
import { useState } from 'react';

const AddButton = styled.div`
  margin-top: 20px;
  display: flex;
  align-items: center;
  padding: 10px;
  cursor: pointer;
  background-color: #2e81f4;
  border-radius: 10px;
  color: #fff;

  h4 {
    font-weight: 600;
    font-family: 'Open Sans';
  }
`;

const ChannelList = () => {
  const [showList, setShowList] = useState(true);

  const onAddTopicHandler = (e) => {
    console.log('add topic');
  };

  const toggleChannelList = (e) => {
    setShowList(!showList);
  };
  return (
    <div className={classes.channellist_container}>
      <h3 style={{ cursor: 'pointer' }} onClick={(e) => toggleChannelList(e)}>
        Danh sách chủ điểm
      </h3>
      {showList ? (
        <div>
          <ChannelItem title='1 Introduction' />
          <ChannelItem title='2 Operating system' />
          <ChannelItem title='3 Computer hardware' />
        </div>
      ) : null}

      <AddButton onClick={(e) => onAddTopicHandler(e)}>
        <h4>+ Thêm chủ điểm</h4>
      </AddButton>
    </div>
  );
};

export default ChannelList;
