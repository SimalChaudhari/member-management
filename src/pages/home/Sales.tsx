import Grid from '@mui/material/Unstable_Grid2';
import { Stack } from '@mui/material';
import { ReactElement } from 'react';

import TopSellingProduct from 'components/sections/dashboard/Home/Sales/TopSellingProduct/TopSellingProduct';
import WebsiteVisitors from 'components/sections/dashboard/Home/Sales/WebsiteVisitors/WebsiteVisitors';
import DashboardCards from 'components/sections/dashboard/Home/Sales/DashboardCards/DashboardCards';
import BuyersProfile from 'components/sections/dashboard/Home/Sales/BuyersProfile/BuyersProfile';
import NewCustomers from 'components/sections/dashboard/Home/Sales/NewCustomers/NewCustomers';
import Revenue from 'components/sections/dashboard/Home/Sales/Revenue/Revenue';


const Sales = (): ReactElement => {
  return (
    <Stack spacing={{ xs: 0, sm: 2, md: 3 }} sx={{ width: '100%' }}>
      {/* First Grid: Dashboard Cards */}
      <Grid container spacing={{ xs: 0, sm: 2, md: 3 }}>
        <Grid xs={12}>
          <DashboardCards />
        </Grid>
      </Grid>

      {/* Second Grid: Charts */}
      <Grid container spacing={{ xs: 0, sm: 2, md: 3 }}>
        <Grid xs={12} md={8}>
          <Revenue />
        </Grid>
        <Grid xs={12} md={4}>
          <WebsiteVisitors />
        </Grid>
      </Grid>

      {/* Additional Grid: Other Components */}
      <Grid container spacing={{ xs: 0, sm: 2, md: 3 }}>
        <Grid xs={12} lg={8}>
          <TopSellingProduct />
        </Grid>
        <Grid xs={12} lg={4}>
          <Stack
            direction={{ xs: 'column', sm: 'row', lg: 'column' }}
            gap={{ xs: 0, sm: 2, md: 3 }}
            height={1}
            width={1}
          >
            <NewCustomers />
            <BuyersProfile />
          </Stack>
        </Grid>
      </Grid>
    </Stack>
  );
};

export default Sales;
