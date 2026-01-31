import axiosInstance from 'config/axios';
import type { AppDispatch } from 'store/Store';
import type { ProfileMetadataResponse } from 'store/types/profileMetadata';
import {
  PROFILE_METADATA_FETCH_START,
  PROFILE_METADATA_FETCH_SUCCESS,
  PROFILE_METADATA_FETCH_ERROR,
} from 'store/types/profileMetadata';

/**
 * Fetch profile metadata from API
 * This metadata defines the structure and fields for the profile form
 */
export const fetchProfileMetadata =
  () =>
  async (dispatch: AppDispatch): Promise<boolean> => {
    dispatch({ type: PROFILE_METADATA_FETCH_START });

    try {
      const response = await axiosInstance.get<ProfileMetadataResponse[]>(
        '/services/apexrest/mobileAPI/v1/myProfileMetaData'
      );
      
      // API returns an array, we take the first element
      const metadata = Array.isArray(response.data) && response.data.length > 0 
        ? response.data[0] 
        : null;

      if (!metadata) {
        throw new Error('No metadata received from API');
      }

      dispatch({ 
        type: PROFILE_METADATA_FETCH_SUCCESS, 
        payload: metadata 
      });
      
      return true;
    } catch (error) {
      const message =
        error && typeof error === 'object' && 'message' in error
          ? String((error as Error).message)
          : 'Failed to load profile metadata';
      
      dispatch({ 
        type: PROFILE_METADATA_FETCH_ERROR, 
        payload: message 
      });
      
      return false;
    }
  };
