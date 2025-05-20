import React from 'react';
import PropTypes from 'prop-types';
import { useIntl } from '@edx/frontend-platform/i18n';
import { reduxHooks } from 'hooks';
import messages from './messages';

const ProgressBar = ({ cardId, hasStarted }) => {
  const { formatMessage } = useIntl();
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
            {formatMessage(messages.courseCompletion, { percent })}
          </div>
          <div className="progress-bar-line">
            <div
              className="progress-bar-line-fill"
              style={{ width: `${percent}%` }}
            />
          </div>
        </>
      ) : (
        <div className="progress-bar-label">
          {formatMessage(messages.notStarted)}
        </div>
      )}
    </div>
  );
};

ProgressBar.propTypes = {
  cardId: PropTypes.string.isRequired,
  hasStarted: PropTypes.bool.isRequired,
};

export default ProgressBar;
