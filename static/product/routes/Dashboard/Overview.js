import React from 'react';
import styled from 'styled-components';
import { rgba } from 'polished';
import { get } from 'lodash';
import { Link } from 'wouter';
import { useSelector } from 'react-redux';
import { Line } from 'react-chartjs-2';
import {
  useAdminTheme,
  Block,
  Buttons,
  Flex,
  Icons,
  Typography,
} from 'pkg.admin-components';
import DashboardWebsiteCard from '@product/components/Dashboard/WebsiteCard';
import { selectAuthOrganization } from '@product/features/auth';
import useProductApi from '@product/hooks/useProductApi';

export const DASHBOARD_OVERVIEW_ROUTE = '/dashboard';

const options = {
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false,
    },
  },
  scales: {
    yAxes: [
      {
        ticks: {
          beginAtZero: true,
        },
      },
    ],
  },
};

export default function DashboardOverview() {
  const adminTheme = useAdminTheme();
  const organization = useSelector(selectAuthOrganization);

  const [websites, setWebsites] = React.useState(null);

  const hitApi = useProductApi();

  React.useEffect(() => {
    if (!organization || Array.isArray(websites)) {
      return;
    }

    let cancel = false;

    hitApi({
      method: 'get',
      route: '/organization/websites',
      query: {
        updatedAt: -1,
        fillDraftSnapshot: true,
      },
      onResponse: ({ json, ok }) => {
        if (ok && !cancel) {
          setWebsites(get(json, 'websites', []));
        }
      },
    });

    return () => cancel = true;
  }, [organization, websites]);

  const fakePageData = {
    labels: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    datasets: [
      {
        label: 'Page views',
        data: [1100, 2000, 1500, 2200, 3100, 2400, 1200, 2600, 2800, 2500],
        fill: false,
        backgroundColor: adminTheme.colors.blue[500],
        borderColor: adminTheme.colors.blue[100],
      },
    ],
  };

  return (
    <Flex.Column gridGap="48px">
      <Flex.Column gridGap="6px">
        <Block specificHeight="200px" opacity={0.5} playFadeIn>
          <Line data={fakePageData} options={options} />
        </Block>
        <Typography
          as="span"
          fontStyle="medium"
          fontSize="12px"
          fg={(colors) => colors.mono[600]}
          textAlign="center"
        >
          Realtime website stats coming soon!
        </Typography>
      </Flex.Column>
      <Flex.Column gridGap="24px">
        <Flex.Row fullWidth align="center" justify="space-between">
          <Typography
            as="h2"
            fontStyle="bold"
            fontSize="18px"
            fg={(colors) => colors.mono[700]}
          >
            {get(organization, 'name', 'Campaign')} Websites
          </Typography>
          <Link href="/dashboard">
            <Buttons.Filled
              as="a"
              IconComponent={Icons.AddRoundFill}
              iconSize={20}
              gridGap="4px"
              buttonFg={(colors) => colors.mono[100]}
              buttonBg={(colors) => colors.mono[700]}
              hoverButtonBg={(colors) => colors.mono[900]}
              paddingVertical="4px"
              paddingHorizontal="8px"
            >
              <Typography fontStyle="medium" fontSize="14px">
                Create new website
              </Typography>
            </Buttons.Filled>
          </Link>
        </Flex.Row>
        {websites === null && (
          <Block
            fullWidth
            specificHeight="120px"
            bg={(colors) => colors.mono[200]}
            rounded={(radius) => radius.default}
          />
        )}
        {Array.isArray(websites) && !!websites.length && (
          websites.map((website) => (
            <DashboardWebsiteCard key={website.id} {...website} />
          ))
        )}
        {Array.isArray(websites) && !websites.length && (
          <Typography
            fontStyle="medium"
            fontSize="14px"
            fg={(colors) => colors.mono[700]}
          >
            You haven't made a website yet!
          </Typography>
        )}
      </Flex.Column>
    </Flex.Column>
  );
}
