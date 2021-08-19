import React from 'react';
import { Route, Switch } from 'wouter';
import { Flex } from 'pkg.admin-components';
import DashboardLayout from '@product/components/Dashboard/Layout';
import DashboardNavigationButton from '@product/components/Dashboard/NavigationButton';
import { DASHBOARD_BILLING_ROUTE } from '@product/routes/Dashboard/Billing';
import { DASHBOARD_OVERVIEW_ROUTE } from '@product/routes/Dashboard/Overview';
import { DASHBOARD_TEAM_ROUTE } from '@product/routes/Dashboard/Team';

export const DASHBOARD_ROUTE = '/dashboard';

const DashboardBillingPage = React.lazy(() => import('@product/routes/Dashboard/Billing'));
const DashboardOverviewPage = React.lazy(() => import('@product/routes/Dashboard/Overview'));
const DashboardTeamPage = React.lazy(() => import('@product/routes/Dashboard/Team'));

export default function Dashboard() {
  return (
    <DashboardLayout>
      <Flex.Row paddingTop="48px" justify="space-between" gridGap="24px">
        <Flex.Column specificWidth="25%" gridGap="6px">
          <DashboardNavigationButton
            route={DASHBOARD_OVERVIEW_ROUTE}
            label="Campaign Overview"
          />
          <DashboardNavigationButton
            route={DASHBOARD_TEAM_ROUTE}
            label="Team Members"
          />
          <DashboardNavigationButton
            route={DASHBOARD_BILLING_ROUTE}
            label="Manage Billing"
          />
        </Flex.Column>
        <Flex.Column flexGrow>
          <React.Suspense loading={<p>Loading...</p>}>
            <Switch>
              <Route path={DASHBOARD_OVERVIEW_ROUTE} component={DashboardOverviewPage} />
              <Route path={DASHBOARD_TEAM_ROUTE} component={DashboardTeamPage} />
              <Route path={DASHBOARD_BILLING_ROUTE} component={DashboardBillingPage} />
              <Route path="/:rest*">
                {(params) => `404, Sorry the page ${params.rest} does not exist!`}
              </Route>
            </Switch>
          </React.Suspense>
        </Flex.Column>
      </Flex.Row>
    </DashboardLayout>
  );
}
