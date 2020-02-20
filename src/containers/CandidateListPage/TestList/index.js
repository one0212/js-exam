import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { formatTime } from 'utils/format';

import { Row, List, Avatar, Icon, Button, Modal, Divider, Tooltip } from 'antd';
import { deleteTestAction } from '../../../redux/test/actions';

import style from './TestList.module.scss';

import SummaryCard from '../../../components/Summary/SummaryCard';
import InterviewQuestions from '../../../components/Summary/InterviewQuestions';
import AddSummaryCard from '../../../components/Summary/AddSummaryCard';

class TestList extends React.Component {
  state = {
    delConfirmModalVisible: false,
    delTest: null,
    delAnime: false,
    testResultModalVisible: false,
    testResultModalTarget: [],
    addSummaryModalVisible: false,
    addSummaryModalTarget: [],
  };

  shouldComponentUpdate(nextProps, nextState) {
    return !(this.state.delAnime && !nextState.delAnime);
  }

  handleDeleteButton = test => event => {
    this.setState({ delConfirmModalVisible: true, delTest: test });
  };

  hideDelConfirmModal = () => {
    this.setState({
      delConfirmModalVisible: false,
    });
  };

  handleOnOkDelConfirmModal = async () => {
    const { delTest } = this.state;
    const { deleteTestAction } = this.props;
    this.hideDelConfirmModal();
    // show the delete animation first and then do the delete action
    this.setState({ delAnime: true });
    setTimeout(async () => {
      await deleteTestAction(delTest);
      this.setState({ delAnime: false });
    }, 500);
  };

  showTestResultModal = e => {
    this.setState({
      testResultModalVisible: true,
      testResultModalTarget: [
        e.target.getAttribute('candidate'),
        e.target.getAttribute('interviewer'),
      ],
    });
  };

  testResultModalCancel = () => {
    this.setState({
      testResultModalVisible: false,
    });
  };

  showAddSummaryModal = e => {
    this.setState({
      addSummaryModalVisible: true,
      addSummaryModalTarget: [
        e.target.getAttribute('candidate'),
        e.target.getAttribute('interviewer'),
      ],
    });
  };

  addSummaryModalCancel = () => {
    this.setState({
      addSummaryModalVisible: false,
    });
  };

  render() {
    const { data } = this.props;
    const {
      delTest,
      delConfirmModalVisible,
      delAnime,
      testResultModalVisible,
      testResultModalTarget,
      addSummaryModalVisible,
      addSummaryModalTarget,
    } = this.state;
    return (
      <>
        <List
          itemLayout="horizontal"
          dataSource={data}
          renderItem={item => (
            <List.Item
              className={
                delAnime && delTest && delTest.id === item.id
                  ? style.delAnime
                  : ''
              }
              actions={[
                <Button
                  size="small"
                  onClick={this.showTestResultModal}
                  candidate={item.subjectId}
                  interviewer={item.tags[0]}
                >
                  Open Summary
                </Button>,
                <Link
                  to={{
                    pathname: `/admin/playback/${item.id}`,
                  }}
                >
                  Playback
                </Link>,
              ]}
            >
              <List.Item.Meta
                avatar={<Avatar icon="code" className={style.avatar} />}
                title={item.subjectId}
                description={formatTime(item.timeBegin)}
              />
              {item && item.tags && item.tags[0] === localStorage.username && (
                <>
                  <button
                    type="button"
                    className={style.floatTop}
                    onClick={this.handleDeleteButton(item)}
                  >
                    <Icon type="delete" theme="twoTone" twoToneColor="#f00" />
                  </button>
                  <Tooltip
                    placement="top"
                    title="write summary"
                    onClick={this.handleSummaryEdit}
                  >
                    <Button
                      type="link"
                      icon="edit"
                      style={{
                        fontSize: '18px',
                        cursor: 'pointer',
                        margin: '0 -20px 0 20px',
                      }}
                      candidate={item.subjectId}
                      interviewer={item.tags[0]}
                      onClick={this.showAddSummaryModal}
                    />
                  </Tooltip>
                </>
              )}
            </List.Item>
          )}
        />
        <Modal
          title={`Candidate：${testResultModalTarget[0]}`}
          visible={testResultModalVisible}
          onCancel={this.testResultModalCancel}
          footer={null}
          width={1000}
        >
          <h2 style={{ fontWeight: '600' }}>Interview Questions</h2>
          <h3>Interviewer：{testResultModalTarget[1]}</h3>
          <InterviewQuestions testListData={testResultModalTarget} />
          <Divider dashed />
          <h3>Interviewer：{testResultModalTarget[1]}</h3>
          <InterviewQuestions testListData={testResultModalTarget} />
          <Divider dashed />
          <h2 style={{ fontWeight: '600' }}>Comments</h2>
          <Row type="flex" align="middle" justify="space-around">
            <SummaryCard testListData={testResultModalTarget} />
            <SummaryCard testListData={testResultModalTarget} />
          </Row>
        </Modal>
        <Modal
          title={`Interviewer：${addSummaryModalTarget[1]}`}
          visible={addSummaryModalVisible}
          onCancel={this.addSummaryModalCancel}
          footer={null}
          width={800}
        >
          <h2>Interview Questions</h2>
          <Row type="flex" align="middle">
            <InterviewQuestions />
          </Row>
          <h2>Comments</h2>
          <Row type="flex" align="middle" justify="space-around">
            <AddSummaryCard testListData={addSummaryModalTarget} />
          </Row>
          <Button type="primary" style={{ margin: '16px 0 0 550px' }}>
            Add Summary
          </Button>
        </Modal>
        <Modal
          title=""
          visible={delConfirmModalVisible}
          okType="danger"
          okText="Delete"
          onOk={this.handleOnOkDelConfirmModal}
          onCancel={this.hideDelConfirmModal}
        >
          Are you sure you want to delete test{' '}
          <b>{delTest ? delTest.subjectId : ''}</b> ?
        </Modal>
      </>
    );
  }
}
TestList.propTypes = {
  data: PropTypes.array,
};

const mapDispatchToProps = dispatch => ({
  deleteTestAction: delTest => dispatch(deleteTestAction(delTest)),
});
export default connect(null, mapDispatchToProps)(TestList);
