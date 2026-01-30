export interface NavItem {
  title: string;
  path: string;
  icon?: string;
  active: boolean;
  collapsible: boolean;
  sublist?: NavItem[];
}

const navItems: NavItem[] = [
  {
    title: 'Dashboard',
    path: '/',
    icon: 'ion:home-sharp',
    active: true,
    collapsible: false,
  },
  {
    title: 'My Profile & Membership',
    path: '/profile-membership',
    icon: 'mdi:account-group',
    active: false,
    collapsible: true,
    sublist: [
      {
        title: 'Edit Profile',
        path: 'edit-profile',
        active: false,
        collapsible: false,
      },
      {
        title: 'Change Password',
        path: 'change-password',
        active: false,
        collapsible: false,
      },
      {
        title: 'Membership Renewal',
        path: 'membership-renewal',
        active: false,
        collapsible: false,
      },
      {
        title: 'My Membership',
        path: 'my-membership',
        active: false,
        collapsible: false,
      },
      {
        title: 'Membership Application',
        path: 'membership-application',
        active: false,
        collapsible: false,
      },
      {
        title: 'Membership Requests',
        path: 'membership-requests',
        active: false,
        collapsible: true,
        sublist: [
          {
            title: 'Letter of Good Standing',
            path: 'letter-of-good-standing',
            active: false,
            collapsible: false,
          },
          {
            title: 'Reprint Membership Certificate',
            path: 'reprint-membership-certificate',
            active: false,
            collapsible: false,
          },
        ],
      },
    ],
  },
  {
    title: 'Credentials & Recognition',
    path: '/credentials-recognition',
    icon: 'mdi:certificate',
    active: false,
    collapsible: true,
    sublist: [
      {
        title: 'Digital Badge',
        path: 'digital-badge',
        active: false,
        collapsible: false,
      },
      {
        title: 'My Certificates',
        path: 'my-certificates',
        active: false,
        collapsible: false,
      },
    ],
  },
  {
    title: 'CPE & Learning',
    path: '/cpe-learning',
    icon: 'mdi:school',
    active: false,
    collapsible: true,
    sublist: [
      {
        title: 'CPE Compliance',
        path: 'cpe-compliance',
        active: false,
        collapsible: false,
      },
      {
        title: 'My CPE Records',
        path: 'my-cpe-records',
        active: false,
        collapsible: false,
      },
      {
        title: 'Browse Courses & Events',
        path: 'browse-courses-events',
        active: false,
        collapsible: false,
      },
      {
        title: 'My Events',
        path: 'my-events',
        active: false,
        collapsible: true,
        sublist: [
          {
            title: 'Registrations',
            path: 'registrations',
            active: false,
            collapsible: false,
          },
          {
            title: 'AGM Registrations',
            path: 'agm-registrations',
            active: false,
            collapsible: false,
          },
        ],
      },
      {
        title: 'PQ Portal',
        path: 'pq-portal',
        active: false,
        collapsible: false,
      },
    ],
  },
  {
    title: 'Payments & Credits',
    path: '/payments-credits',
    icon: 'mdi:credit-card',
    active: false,
    collapsible: true,
    sublist: [
      {
        title: 'My Payments',
        path: 'my-payments',
        active: false,
        collapsible: false,
      },
      {
        title: 'My Vouchers',
        path: 'my-vouchers',
        active: false,
        collapsible: false,
      },
      {
        title: 'Prepaid Balance',
        path: 'prepaid-balance',
        active: false,
        collapsible: false,
      },
    ],
  },
  {
    title: 'Facilities & Services',
    path: '/facilities-services',
    icon: 'mdi:office-building',
    active: false,
    collapsible: true,
    sublist: [
      {
        title: 'Facilities Booking',
        path: 'facilities-booking',
        active: false,
        collapsible: false,
      },
      {
        title: 'My Facilities Booking',
        path: 'my-facilities-booking',
        active: false,
        collapsible: false,
      },
      {
        title: 'ISCAccountify',
        path: 'iscaccountify',
        active: false,
        collapsible: false,
      },
    ],
  },
  {
    title: 'Support & Community',
    path: '/support-community',
    icon: 'mdi:help-circle',
    active: false,
    collapsible: true,
    sublist: [
      {
        title: 'ISCA Cares (Donations)',
        path: 'isca-cares',
        active: false,
        collapsible: false,
      },
      {
        title: 'Contact Us',
        path: 'contact-us',
        active: false,
        collapsible: false,
      },
    ],
  },
];

export default navItems;
