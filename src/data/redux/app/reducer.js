import { createSlice } from '@reduxjs/toolkit';

import { StrictDict } from 'utils';

const initialState = {
  pageNumber: 1,
  courseData: {},
  currentList: { courseIds: [] },
  entitlement: [],
  emailConfirmation: {},
  enterpriseDashboard: {},
  platformSettings: {},
  suggestedCourses: [],
  selectSessionModal: {},
  filters: [],
  completionPending: false,
};

export const cardId = (val) => `card-${val}`;

export const today = Date.now();

/**
 * Creates a redux slice with actions to load dashboard data and manage visual layout
 */
const app = createSlice({
  name: 'app',
  initialState,
  reducers: {
    loadCourses: (state, { payload: { courses } }) => {
      const courseData = courses.reduce((obj, curr, index) => {
        // get courseId from courseRun
        const courseId = curr.courseRun?.courseId;
        if (!courseId) {
          return obj;
        }

        const out = { ...curr, cardId: cardId(index) };
        out.courseKey = courseId; // 🔑 store for later lookups

        if (out.enrollment && out.enrollment.lastEnrolled === null) {
          out.enrollment.lastEnrolled = today;
        }

        return { ...obj, [cardId(index)]: out };
      }, {});

      return {
        ...state,
        courseData,
        currentList: { courseIds: courses.map(c => c.courseRun?.courseId).filter(Boolean) },
      };
    },
    loadGlobalData: (state, { payload }) => ({
      ...state,
      emailConfirmation: payload.emailConfirmation,
      enterpriseDashboard: payload.enterpriseDashboard,
      platformSettings: payload.platformSettings,
      suggestedCourses: payload.suggestedCourses,
      socialShareSettings: payload.socialShareSettings,
    }),
    updateSelectSessionModal: (state, { payload }) => ({
      ...state,
      selectSessionModal: { cardId: payload },
    }),
    setPageNumber: (state, { payload }) => ({ ...state, pageNumber: payload }),
    setFilters: (state, { payload }) => ({
      ...state,
      filters: payload,
    }),
    addFilter: (state, { payload }) => ({
      ...state,
      filters: [...state.filters, payload],
    }),
    removeFilter: (state, { payload }) => ({
      ...state,
      filters: state.filters.filter(item => item !== payload),
    }),
    clearFilters: (state) => ({
      ...state,
      filters: [],
    }),
    setCompletionPending: (state, { payload }) => ({
      ...state,
      completionPending: payload,
    }),
    updateCourseCard: (state, { payload }) => {
      const { courseId, data } = payload;
      // find the matching cardId
      const cardKey = Object.keys(state.courseData).find(
        key => state.courseData[key].courseKey === courseId,
      );
      if (cardKey) {
        state.courseData[cardKey] = {
          ...state.courseData[cardKey],
          ...data,
        };
      }
    },
  },
});

const actions = StrictDict(app.actions);

const { reducer } = app;

export {
  actions,
  initialState,
  reducer,
};
