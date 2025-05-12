import React from 'react';
import PropTypes from 'prop-types';
import { reduxHooks } from 'hooks';

const ProgressBar = ({ cardId, hasStarted }) => {
  const {
    completeCount = 0,
    incompleteCount = 0,
    lockedCount = 0,
  } = reduxHooks.useCardCompletionSummaryData(cardId);

  const totalUnits = completeCount + incompleteCount + lockedCount;
  const percent = totalUnits > 0 ? Math.round((completeCount / totalUnits) * 100) : 0;

  return (
    <div className="progress-bar-container">
      {hasStarted ? (
        <>
          <div className="progress-bar-label">
            Course • {percent}% Complete
          </div>
          <div className="progress-bar-line">
            <div
              className="progress-bar-line-fill"
              style={{ width: `${percent}%` }}
            />
          </div>
        </>
      ) : (
        <div className="progress-bar-label">Not started</div>
      )}
    </div>
  );
};

ProgressBar.propTypes = {
  cardId: PropTypes.string.isRequired,
  hasStarted: PropTypes.bool.isRequired,
};

export default ProgressBar;
