import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import ClassDetailComponent from '../components/classroom/ClassDetail';
import ClassRequest from '../components/classroom/ClassRequest';
import ClassItem from '../components/classroom/ClassItem';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import {
  getClassDetail,
  resetClassDetail,
} from '../sandbox/actions/classDetail';
import _ from 'lodash';
import Loading from '../components/layout/Loading';
import NotFound from '../components/layout/NotFound';

const ClassDetail = ({
  getClassDetail,
  resetClassDetail,
  classDetail: { classDetail, error, loading },
  match,
}) => {
  useEffect(() => {
    console.log('Class detail page mount');
    getClassDetail(match.params.id);

    return () => {
      console.log('Class detail page will unmount');
      resetClassDetail();
    };
  }, []);

  var renderedComp = <Loading />;

  if (!loading) {
    if (!_.isEmpty(error) && error.status == 401) {
      renderedComp = (
        <div>
          <ClassItem />
          <ClassRequest classId={match.params.id} />
        </div>
      );
    } else if (!_.isEmpty(error) && error.status == 404) {
      renderedComp = <NotFound />;
    } else if (!_.isEmpty(error) && error.status == 500) {
      renderedComp = <div>Server error</div>;
    } else {
      renderedComp = (
        <ClassDetailComponent
          name={classDetail.name}
          description={classDetail.description}
          classId={classDetail._id}
        />
      );
    }
  }

  return renderedComp;
};

ClassDetail.propTypes = {
  classDetail: PropTypes.object.isRequired,
  getClassDetail: PropTypes.func.isRequired,
  resetClassDetail: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  classDetail: state.classDetail,
});

export default connect(mapStateToProps, { getClassDetail, resetClassDetail })(
  ClassDetail
);
