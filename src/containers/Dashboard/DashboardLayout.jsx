import React from 'react';
import PropTypes from 'prop-types';

import { Container, Col, Row } from '@openedx/paragon';

import WidgetSidebarSlot from 'plugin-slots/WidgetSidebarSlot';

import hooks from './hooks';

export const columnConfig = {
  courseList: {
    withSidebar: {
      lg: { span: 12, offset: 0 },
      xl: { span: 12, offset: 0 },
    },
    noSidebar: {
      lg: { span: 12, offset: 0 },
      xl: { span: 12, offset: 0 },
    },
  },
  sidebar: {
    lg: { span: 12, offset: 0 },
    xl: { span: 12, offset: 0 },
  },
};

export const DashboardLayout = ({ children }) => {
  const {
    isCollapsed,
    sidebarShowing,
  } = hooks.useDashboardLayoutData();

  const courseListColumnProps = sidebarShowing
    ? columnConfig.courseList.withSidebar
    : columnConfig.courseList.noSidebar;

  return (
    <Container fluid size="lg">
      <Row>
        <Col {...columnConfig.sidebar} className="sidebar-column">
          <WidgetSidebarSlot />
          {!isCollapsed && (<h2 className="course-list-title m-0 micro">&nbsp;</h2>)}
        </Col>
        <Col {...courseListColumnProps} className="course-list-column">
          {children}
        </Col>
      </Row>
    </Container>
  );
};
DashboardLayout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default DashboardLayout;
