import { getAuthenticatedHttpClient } from '@edx/frontend-platform/auth';
import { logError } from '@edx/frontend-platform/logging';
import { ensureConfig, getConfig } from '@edx/frontend-platform';
import { actions } from './reducer';

const { updateCourseCard, setCompletionPending } = actions;

// Ensure LMS_BASE_URL is available
ensureConfig(['LMS_BASE_URL'], 'fetchCompletionSummaries');

const fetchCompletionSummaries = (courseIds = []) => async (dispatch, getState) => {
  if (!courseIds.length) {
    return;
  }

  const courseData = getState().app.courseData || {};
  const idsToFetch = courseIds.filter(
    id => !Object.values(courseData).some(c => c.courseKey === id && c.completionSummary),
  );
  if (!idsToFetch.length) {
    return;
  }

  dispatch(setCompletionPending(true));

  try {
    const client = getAuthenticatedHttpClient();
    const url = `${getConfig().LMS_BASE_URL}/api/learner_home/completion_data?${idsToFetch
      .map(c => `course_ids=${encodeURIComponent(c)}`)
      .join('&')}`;
    const { data } = await client.get(url);

    Object.entries(data).forEach(([courseKey, summary]) => {
      dispatch(updateCourseCard({ courseId: courseKey, data: { completionSummary: summary } }));
    });
  } catch (error) {
    logError(error);
  } finally {
    dispatch(setCompletionPending(false));
  }
};

export default fetchCompletionSummaries;
