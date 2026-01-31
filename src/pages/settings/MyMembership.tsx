import { ReactElement, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from 'store/hooks';
import { fetchMembershipDetail } from 'store/action/MembershipActions';

/**
 * My Membership Page Component
 * Displays membership details including membership number, status, validity, QR code, etc.
 */
const MyMembership = (): ReactElement => {
  const dispatch = useAppDispatch();

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

  if (loading) {
    return (
      <div className="bg-white">
        <h1 className="text-xl font-bold text-gray-800 pt-8 ml-6 mb-6">My Membership</h1>
        <div className="bg-white rounded-lg shadow p-6 mb-6 ml-6 mr-6">
          <div className="flex items-center justify-center py-12">
            <div className="text-gray-500">Loading membership details...</div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white">
        <h1 className="text-xl font-bold text-gray-800 pt-8 ml-6 mb-6">My Membership</h1>
        <div className="bg-white rounded-lg shadow p-6 mb-6 ml-6 mr-6">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-800 text-sm">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!membershipData) {
    return (
      <div className="bg-white">
        <h1 className="text-xl font-bold text-gray-800 pt-8 ml-6 mb-6">My Membership</h1>
        <div className="bg-white rounded-lg shadow p-6 mb-6 ml-6 mr-6">
          <div className="flex items-center justify-center py-12">
            <div className="text-gray-500">No membership data available</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white">
      <h1 className="text-xl font-bold text-gray-800 pt-8 ml-6 mb-6">My Membership</h1>
      
      <div className="bg-white rounded-lg shadow p-6 mb-6 ml-6 mr-6">
        {/* Header Section with Name and Membership Number */}
        <div className="mb-6 pb-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">{membershipData.name}</h2>
          <p className="text-gray-600">
            <span className="font-semibold">Membership Number:</span> {membershipData.membershipNumber}
          </p>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Left Column - Membership Details */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Membership Status
              </label>
              <p className="text-gray-800">{membershipData.membershipStatus}</p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Membership Validity
              </label>
              <p className="text-gray-800">{membershipData.membershipValidity}</p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Membership Class Type
              </label>
              <p className="text-gray-800">{membershipData.membershipClassType}</p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Membership Type
              </label>
              <p className="text-gray-800">{membershipData.membershipType || 'N/A'}</p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Account Type
              </label>
              <p className="text-gray-800">{membershipData.accountType}</p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Points Category
              </label>
              <p className="text-gray-800">{membershipData.pointsCategory}</p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Balance Points
              </label>
              <p className="text-gray-800">{membershipData.balancePoints}</p>
            </div>
          </div>

          {/* Right Column - Credentials and Additional Info */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Specialised Credential
              </label>
              <p className="text-gray-800">{membershipData.specialisedCredential}</p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Credential ID
              </label>
              <p className="text-gray-800">{membershipData.credentialID}</p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                CA Entry Route
              </label>
              <p className="text-gray-800">{membershipData.caEntryRoute || 'N/A'}</p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                PQ ID
              </label>
              <p className="text-gray-800">{membershipData.pqId || 'N/A'}</p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                ISCAQ
              </label>
              <p className="text-gray-800">{membershipData.isSCAQ ? 'Yes' : 'No'}</p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Accountify
              </label>
              <p className="text-gray-800">{membershipData.isAccountify ? 'Yes' : 'No'}</p>
            </div>

            {membershipData.accountifyURL && (
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Accountify URL
                </label>
                <a
                  href={membershipData.accountifyURL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 underline"
                >
                  View Accountify
                </a>
              </div>
            )}
          </div>
        </div>

        {/* QR Code Section */}
        {membershipData.qrURL && (
          <div className="mt-6 pt-6 border-t border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Membership QR Code</h3>
            <div className="flex justify-center">
              <img
                src={membershipData.qrURL}
                alt="Membership QR Code"
                className="border border-gray-300 rounded-lg p-2"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyMembership;
