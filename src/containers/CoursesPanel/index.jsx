import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getCompletionData } from 'data/services/lms/api';
import { actions } from 'data/redux/app/reducer';

import { useIntl } from '@edx/frontend-platform/i18n';

import { reduxHooks } from 'hooks';
import {
  CourseFilterControls,
} from 'containers/CourseFilterControls';
import CourseListSlot from 'plugin-slots/CourseListSlot';
import NoCoursesViewSlot from 'plugin-slots/NoCoursesViewSlot';

import { useCourseListData } from './hooks';

import messages from './messages';

import './index.scss';

/**
 * Renders the list of CourseCards, as well as the controls (CourseFilterControls) for modifying the list.
 * Also houses the NoCoursesView to display if the user hasn't enrolled in any courses.
 * @returns List of courses as CourseCards or empty state
*/
export const CoursesPanel = () => {
  const dispatch = useDispatch();
  const { formatMessage } = useIntl();
  const hasCourses = reduxHooks.useHasCourses();
  const courseListData = useCourseListData();
  const courses = useSelector(state => state.app.currentList?.courseIds || []);

  useEffect(() => {
    const { updateCourseCard, setCompletionPending } = actions;
    const load = async () => {
      if (!courses.length) {
        return;
      }
      dispatch(setCompletionPending(true));
      try {
        const { data } = await getCompletionData({ courseIds: courses });
        Object.entries(data).forEach(([courseKey, summary]) => {
          dispatch(updateCourseCard({ courseId: courseKey, data: { completionSummary: summary } }));
        });
      } catch (err) {
        // logging is handled elsewhere; swallow to avoid breaking UI
      } finally {
        dispatch(setCompletionPending(false));
      }
    };
    load();
  }, [dispatch, courses]);

  return (
    <div className="course-list-container">
      <div className="course-list-heading-container">
        <h2 className="course-list-title">{formatMessage(messages.myCourses)}</h2>
        <div className="course-filter-controls-container">
          <CourseFilterControls {...courseListData.filterOptions} />
        </div>
      </div>
      {hasCourses ? <CourseListSlot courseListData={courseListData} /> : <NoCoursesViewSlot />}
    </div>
  );
};

CoursesPanel.propTypes = {};

export default CoursesPanel;
