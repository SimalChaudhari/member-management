/**
 * Membership Types
 * Defines the structure of the API response from /membershipDetail endpoint
 */

// Membership Detail API Response
export type MembershipDetailResponse = {
  specialisedCredential: string;
  qrURL: string;
  pqId: string | null;
  pointsCategory: string;
  name: string;
  membershipValidity: string;
  membershipType: string;
  membershipStatus: string;
  membershipNumber: string;
  membershipClassType: string;
  isSCAQ: boolean;
  isAccountify: boolean;
  id: string;
  credentialID: string;
  caEntryRoute: string | null;
  balancePoints: string;
  accountType: string;
  accountifyURL: string;
};

// Redux state for membership data
export type MembershipState = {
  membershipData: MembershipDetailResponse | null;
  loading: boolean;
  error: string | null;
};

// Action types
export const MEMBERSHIP_FETCH_START = 'MEMBERSHIP_FETCH_START';
export const MEMBERSHIP_FETCH_SUCCESS = 'MEMBERSHIP_FETCH_SUCCESS';
export const MEMBERSHIP_FETCH_ERROR = 'MEMBERSHIP_FETCH_ERROR';

// Action creators types
export type MembershipAction =
  | { type: typeof MEMBERSHIP_FETCH_START }
  | { type: typeof MEMBERSHIP_FETCH_SUCCESS; payload: MembershipDetailResponse }
  | { type: typeof MEMBERSHIP_FETCH_ERROR; payload: string };
