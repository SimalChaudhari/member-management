/**
 * ============================================================================
 * PROFILE & MEMBERSHIP MODULE - My Membership Page
 * ============================================================================
 * 
 * This component displays membership details fetched from the membership API.
 * Organized into 3 tabs: Membership Summary, Membership eCard, and Membership History
 * 
 * Related Files:
 * - store/action/MembershipActions.tsx: Fetches membership details and history
 * - store/types/membership.ts: Type definitions for membership data
 * - store/reducer/MembershipReducer.tsx: Manages membership state
 * - config/appColors.ts: Centralized color configuration
 * ============================================================================
 */

import { ReactElement, useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from 'store/hooks';
import { fetchMembershipDetail } from 'store/action/MembershipActions';
import { appColors } from 'config/appColors';

/**
 * Tab Panel Component
 * Renders content only when the tab is active
 */
const TabPanel = ({
  children,
  value,
  index,
}: {
  children?: React.ReactNode;
  value: number;
  index: number;
}) => {
  return value === index ? <div>{children}</div> : null;
};

/**
 * My Membership Page Component
 * Displays membership details including membership number, status, validity, QR code, etc.
 * Organized into 3 tabs: Membership Summary, Membership eCard, and Membership History
 */
const MyMembership = (): ReactElement => {
  const dispatch = useAppDispatch();
  const [tabValue, setTabValue] = useState(0);

  // Redux state for membership data
  const { membershipData, loading, error } = useAppSelector(
    (state) => state.membership
  );

  // Get user ID from auth profile
  const { profile } = useAppSelector((state) => state.auth);

  /**
   * Get User ID from profile or use default for testing
   */
  const getUserId = (): string => {
    // Try to get from auth profile first
    if (profile?.user_id) {
      return profile.user_id;
    }
    
    // Check URL params
    const urlParams = new URLSearchParams(window.location.search);
    const userIdFromUrl = urlParams.get('userId');
    
    if (userIdFromUrl) {
      return userIdFromUrl;
    }
    
    // Default user ID for testing - in production, this should always come from profile
    // TODO: Ensure user_id is available in auth profile
    return '005fV000000iqHdQAI';
  };

  /**
   * Fetch membership details on component mount
   */
  useEffect(() => {
    const userId = getUserId();
    dispatch(fetchMembershipDetail(userId));
  }, [dispatch]);

  // Note: Membership History table will be added later
  // Removed useEffect for fetching history data as it's not available yet

  // Define tabs
  const tabs = [
    { name: 'Membership Summary', index: 0 },
    { name: 'Membership eCard', index: 1 },
    { name: 'Membership History', index: 2 },
  ];

  // Note: Membership History table functionality will be added later
  // Removed column building and table data logic as it's not available yet

  if (loading) {
    return (
      <div style={{ backgroundColor: appColors.background.page }}>
        <h1
          className="text-xl font-bold pt-8 ml-6 mb-6"
          style={{ color: appColors.text.primary }}
        >
          My Membership
        </h1>
        <div className="rounded-lg shadow p-6 mb-6 ml-6 mr-6" style={{ backgroundColor: appColors.background.card }}>
          <div className="flex items-center justify-center py-12">
            <div style={{ color: appColors.text.secondary }}>Loading membership details...</div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ backgroundColor: appColors.background.page }}>
        <h1
          className="text-xl font-bold pt-8 ml-6 mb-6"
          style={{ color: appColors.text.primary }}
        >
          My Membership
        </h1>
        <div className="rounded-lg shadow p-6 mb-6 ml-6 mr-6" style={{ backgroundColor: appColors.background.card }}>
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-800 text-sm">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!membershipData) {
    return (
      <div style={{ backgroundColor: appColors.background.page }}>
        <h1
          className="text-xl font-bold pt-8 ml-6 mb-6"
          style={{ color: appColors.text.primary }}
        >
          My Membership
        </h1>
        <div className="rounded-lg shadow p-6 mb-6 ml-6 mr-6" style={{ backgroundColor: appColors.background.card }}>
          <div className="flex items-center justify-center py-12">
            <div style={{ color: appColors.text.secondary }}>No membership data available</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: appColors.background.page }}>
      <h1
        className="text-xl font-bold pt-8 ml-6 mb-6"
        style={{ color: appColors.text.primary }}
      >
        My Membership
      </h1>
      
      {/* Tab Navigation */}
      <div className="mb-4" style={{ borderBottom: `1px solid ${appColors.border.default}` }}>
        <nav className="flex md:ml-4 md:space-x-8 space-x-4 mt-4" aria-label="Tabs">
          {tabs.map((tab) => (
            <button
              key={tab.index}
              className={`px-2 py-2 text-md font-medium ${
                tabValue === tab.index ? 'border-b-2' : ''
              }`}
              style={
                tabValue === tab.index
                  ? {
                      borderBottomColor: appColors.tabs.active,
                      color: appColors.tabs.active,
                    }
                  : {
                      color: appColors.tabs.inactive,
                    }
              }
              onMouseEnter={(e) => {
                if (tabValue !== tab.index) {
                  e.currentTarget.style.color = appColors.tabs.hover;
                }
              }}
              onMouseLeave={(e) => {
                if (tabValue !== tab.index) {
                  e.currentTarget.style.color = appColors.tabs.inactive;
                }
              }}
              onClick={() => setTabValue(tab.index)}
            >
              {tab.name}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="ml-6 mr-6">
        {/* Membership Summary Tab */}
        <TabPanel value={tabValue} index={0}>
          <div className="rounded-lg shadow mb-6" style={{ backgroundColor: appColors.background.card }}>
            {/* Header with sidebar matching blue background */}
            <div
              className="px-6 py-4 rounded-t-lg"
              style={{
                backgroundColor: appColors.header.background,
                color: appColors.header.text,
              }}
            >
              <h2 className="text-lg font-semibold">Membership Summary</h2>
            </div>
            
            {/* Content */}
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Left Column */}
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <label className="text-sm font-semibold" style={{ color: appColors.text.label }}>
                      Membership Status
                    </label>
                    <p
                      className="text-sm"
                      style={{
                        color:
                          membershipData.membershipStatus === 'Renewed'
                            ? appColors.status.success
                            : appColors.text.primary,
                        fontWeight: membershipData.membershipStatus === 'Renewed' ? '600' : '400',
                      }}
                    >
                      {membershipData.membershipStatus}
                    </p>
                  </div>

                  <div className="flex justify-between">
                    <label className="text-sm font-semibold" style={{ color: appColors.text.label }}>
                      Membership Validity
                    </label>
                    <p className="text-sm" style={{ color: appColors.text.primary }}>
                      {membershipData.membershipValidity}
                    </p>
                  </div>

                  <div className="flex justify-between">
                    <label className="text-sm font-semibold" style={{ color: appColors.text.label }}>
                      Membership Class/Type
                    </label>
                    <p className="text-sm" style={{ color: appColors.text.primary }}>
                      {membershipData.membershipClassType}
                    </p>
                  </div>

                  <div className="flex justify-between">
                    <label className="text-sm font-semibold" style={{ color: appColors.text.label }}>
                      Membership ID
                    </label>
                    <p className="text-sm" style={{ color: appColors.text.primary }}>
                      {membershipData.membershipNumber}
                    </p>
                  </div>
                </div>

                {/* Right Column */}
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <label className="text-sm font-semibold" style={{ color: appColors.text.label }}>
                      Specialised Credential
                    </label>
                    <p className="text-sm" style={{ color: appColors.text.primary }}>
                      {membershipData.specialisedCredential}
                    </p>
                  </div>

                  <div className="flex justify-between">
                    <label className="text-sm font-semibold" style={{ color: appColors.text.label }}>
                      Credential ID
                    </label>
                    <p className="text-sm" style={{ color: appColors.text.primary }}>
                      {membershipData.credentialID}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </TabPanel>

        {/* Membership eCard Tab */}
        <TabPanel value={tabValue} index={1}>
          <div className="rounded-lg shadow mb-6" style={{ backgroundColor: appColors.background.card }}>
            {/* Header with sidebar matching blue background */}
            <div
              className="px-6 py-4 rounded-t-lg"
              style={{
                backgroundColor: appColors.header.background,
                color: appColors.header.text,
              }}
            >
              <h2 className="text-lg font-semibold">Membership eCard</h2>
            </div>
            
            {/* Content */}
            <div className="p-6">
              <p style={{ color: appColors.text.primary }}>
                Click{' '}
                <a
                  href={membershipData.qrURL || '#'}
                  download
                  className="underline"
                  style={{ color: appColors.links.default }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = appColors.links.hover;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = appColors.links.default;
                  }}
                >
                  here
                </a>
                {' '}to download your Membership eCard.
              </p>
            </div>
          </div>
        </TabPanel>

        {/* Membership History Tab */}
        <TabPanel value={tabValue} index={2}>
          <div className="rounded-lg shadow mb-6" style={{ backgroundColor: appColors.background.card }}>
            {/* Header with sidebar matching blue background */}
            <div
              className="px-6 py-4 rounded-t-lg"
              style={{
                backgroundColor: appColors.header.background,
                color: appColors.header.text,
              }}
            >
              <h2 className="text-lg font-semibold">Membership History</h2>
            </div>
            
            {/* Content - Table will be added later */}
            <div className="p-6">
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <p style={{ color: appColors.text.secondary, fontSize: '0.95rem' }}>
                    Membership History table will be available soon.
                  </p>
                  <p style={{ color: appColors.text.muted, fontSize: '0.875rem', marginTop: '0.5rem' }}>
                    This feature is currently under development.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </TabPanel>
      </div>
    </div>
  );
};

export default MyMembership;
