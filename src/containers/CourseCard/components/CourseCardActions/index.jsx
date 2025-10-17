import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';

import { ActionRow } from '@openedx/paragon';

import { reduxHooks } from 'hooks';

import CourseCardActionSlot from 'plugin-slots/CourseCardActionSlot';
import SelectSessionButton from './SelectSessionButton';
import BeginCourseButton from './BeginCourseButton';
import ResumeButton from './ResumeButton';
import ViewCourseButton from './ViewCourseButton';
import ProgressBar from './ProgressBar';

const ProgressLoader = () => (
  <div className="dots-loader__container" role="status" aria-label="Loading">
    <div className="dots-loader" aria-hidden="true">
      <span className="dots-loader__dot" />
      <span className="dots-loader__dot" />
      <span className="dots-loader__dot" />
    </div>
  </div>
);

export const CourseCardActions = ({ cardId }) => {
  const { isEntitlement, isFulfilled } = reduxHooks.useCardEntitlementData(cardId);
  const {
    hasStarted,
  } = reduxHooks.useCardEnrollmentData(cardId);
  const { isArchived } = reduxHooks.useCardCourseRunData(cardId);

  const completionSummary = useSelector(state => state.app.courseData[cardId]?.completionSummary);

  return (
    <ActionRow data-test-id="CourseCardActions">
      <CourseCardActionSlot cardId={cardId} />
      {/* Show placeholder/progress if completion data hasn't arrived */}
      {completionSummary ? (
        <ProgressBar cardId={cardId} hasStarted={hasStarted} />
      ) : (
        <ProgressLoader />
      )}
      {isEntitlement && (isFulfilled
        ? <ViewCourseButton cardId={cardId} />
        : <SelectSessionButton cardId={cardId} />
      )}
      {(isArchived && !isEntitlement) && (
        <ViewCourseButton cardId={cardId} />
      )}
      {!(isArchived || isEntitlement) && (hasStarted
        ? <ResumeButton cardId={cardId} />
        : <BeginCourseButton cardId={cardId} />
      )}
    </ActionRow>
  );
};
CourseCardActions.propTypes = {
  cardId: PropTypes.string.isRequired,
};

export default CourseCardActions;
