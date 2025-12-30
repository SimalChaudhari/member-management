import { ReactElement } from 'react';
import Grid from '@mui/material/Unstable_Grid2';
import DashboardCard from './DashboardCard';

const DashboardCards = (): ReactElement => {
  const handleDownloadECard = () => {
    // TODO: Implement download e-Card functionality
    console.log('Download e-Card clicked');
  };

  return (
    <Grid container spacing={{ xs: 0, sm: 2, md: 3 }} sx={{ display: 'flex', m: 0 }}>
      <Grid xs={12} sm={6} md={3} sx={{ display: 'flex' }}>
        <DashboardCard
          title="Renewal Due Reminder"
          icon="mdi:calendar-alert"
          value="30 days"
          description="Your membership renewal is due in 30 days"
          color="warning"
        />
      </Grid>
      <Grid xs={12} sm={6} md={3} sx={{ display: 'flex' }}>
        <DashboardCard
          title="CPE Shortfall Indicator"
          icon="mdi:school-alert"
          value="15 hours"
          description="You need 15 more CPE hours to meet requirements"
          color="error"
        />
      </Grid>
      <Grid xs={12} sm={6} md={3} sx={{ display: 'flex' }}>
        <DashboardCard
          title="Outstanding Payments"
          icon="mdi:credit-card-alert"
          value="$250.00"
          description="You have outstanding payments pending"
          color="warning"
        />
      </Grid>
      <Grid xs={12} sm={6} md={3} sx={{ display: 'flex' }}>
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

