import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import { resetQuestion, changeQuestion } from 'app/actions/code';
import { changeCategory } from 'app/actions/category';

import QuestionSelector from 'app/components/Selectors/QuestionSelector';
import CategorySelector from 'app/components/Selectors/CategorySelector';

import { getStateInformation } from 'app/utils/stateHelper';

import { Button, Icon } from 'antd';
import styles from './ControlWidget.module.scss';

const ControlWidget = ({
  onReset,
  // setIntervieweeModal,
  intervieweeName
}) => (
  <div className={styles.control}>
    <div className={styles.interviewee}>
      <Icon type="user" />
      <p>
        Interviewee:
        <span>{ intervieweeName || 'UNSET' }</span>
      </p>
    </div>
    <Button type="danger" onClick={onReset}>Reset</Button>
    {/* <div>
      <Button type="primary" onClick={setIntervieweeModal}>Change Interviewee</Button>
    </div> */}
  </div>
);

export default ControlWidget;
