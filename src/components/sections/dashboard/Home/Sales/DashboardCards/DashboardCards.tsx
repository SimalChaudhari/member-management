import { ReactElement } from 'react';
import Grid from '@mui/material/Unstable_Grid2';
import DashboardCard from './DashboardCard';
import { useSidebar } from 'providers/SidebarProvider';

const DashboardCards = (): ReactElement => {
  const { sidebarExpanded, isSmallScreen } = useSidebar();
  const handleDownloadECard = () => {
    // TODO: Implement download e-Card functionality
    console.log('Download e-Card clicked');
  };

  // At 1280px (isSmallScreen), when sidebar is expanded, show 2 columns (lg={6})
  // Otherwise show 4 columns (lg={3})
  const lgColumnSize = isSmallScreen && sidebarExpanded ? 6 : 3;

  return (
    <Grid
      container
      spacing={{ xs: 1, sm: 2, md: 2.5, lg: 3 }}
      sx={{
        width: '100%',
        margin: 0,
        boxSizing: 'border-box',
      }}
    >
      <Grid
        xs={6}
        sm={6}
        md={6}
        lg={lgColumnSize}
        xl={3}
        sx={{
          display: 'flex',
          minWidth: 0,
          width: '100%',
        }}
      >
        <DashboardCard
          title="Renewal Due Reminder"
          icon="mdi:calendar-alert"
          value="30 days"
          description="Your membership renewal is due in 30 days"
          color="warning"
        />
      </Grid>
      <Grid
        xs={6}
        sm={6}
        md={6}
        lg={lgColumnSize}
        xl={3}
        sx={{
          display: 'flex',
          minWidth: 0,
          width: '100%',
        }}
      >
        <DashboardCard
          title="CPE Shortfall Indicator"
          icon="mdi:school-alert"
          value="15 hours"
          description="You need 15 more CPE hours to meet requirements"
          color="error"
        />
      </Grid>
      <Grid
        xs={6}
        sm={6}
        md={6}
        lg={lgColumnSize}
        xl={3}
        sx={{
          display: 'flex',
          minWidth: 0,
          width: '100%',
        }}
      >
        <DashboardCard
          title="Outstanding Payments"
          icon="mdi:credit-card-alert"
          value="$250.00"
          description="You have outstanding payments pending"
          color="warning"
        />
      </Grid>
      <Grid
        xs={6}
        sm={6}
        md={6}
        lg={lgColumnSize}
        xl={3}
        sx={{
          display: 'flex',
          minWidth: 0,
          width: '100%',
        }}
      >
        <DashboardCard
          title="Quick Download"
          icon="mdi:card-account-details"
          description="Download your digital membership e-Card"
          buttonText="Download"
          buttonAction={handleDownloadECard}
          color="primary"
        />
      </Grid>
    </Grid>
  );
};

export default DashboardCards;

