import { css } from '@emotion/react';
import BarLoader from 'react-spinners/BarLoader';

// Can be a string as well. Need to ensure each key-value pair ends with ;
const override = css`
  display: block;
  margin: 0 auto;
  height: 4;
  width: 100;
`;

const Loading = () => {
  return <BarLoader color='#2e81f4' loading={true} css={override} size={150} />;
};

export default Loading;
