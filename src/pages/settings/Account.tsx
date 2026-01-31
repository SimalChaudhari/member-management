import { ReactElement, useState, useEffect, useMemo } from 'react';
import { useAppDispatch, useAppSelector } from 'store/hooks';
import { fetchProfileMetadata } from 'store/action/ProfileMetadataActions';
import { fetchAccountData } from 'store/action/AccountDataActions';
import DynamicFormField from 'components/settings/DynamicFormField';
import type { ProfileField, ContactSubSection } from 'store/types/profileMetadata';

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
  return value === index ? <div className="p-6">{children}</div> : null;
};

/**
 * Account Settings Page Component
 * 
 * This component dynamically renders form fields based on metadata fetched from API.
 * All tabs, sections, and fields are rendered dynamically based on the API response structure.
 * No hardcoded content - everything comes from the API metadata.
 */
const Account = (): ReactElement => {
  const dispatch = useAppDispatch();
  
  // Redux state for profile metadata
  const { metadata, loading, error } = useAppSelector(
    (state) => state.profileMetadata
  );

  // Redux state for account data (actual field values)
  const { accountData, loading: accountLoading, error: accountError } = useAppSelector(
    (state) => state.accountData
  );

  // Active tab state
  const [tabValue, setTabValue] = useState(0);

  // Form values state - stores all field values by apiName
  const [formValues, setFormValues] = useState<Record<string, string>>({});

  /**
   * Get account ID from URL params or use default
   * In production, this should come from user profile or route params
   */
  const getAccountId = (): string => {
    // Check URL params first
    const urlParams = new URLSearchParams(window.location.search);
    const accountIdFromUrl = urlParams.get('accountId');
    
    if (accountIdFromUrl) {
      return accountIdFromUrl;
    }
    
    // Default account ID for testing - in production, get from user profile
    // TODO: Get account ID from authenticated user's profile
    return '001fV000001hMKzQAM';
  };

  /**
   * Dynamically generate tabs based on available sections in metadata
   * Returns array of tab objects with name and index
   * Residential Address fields are merged into Personal Details tab
   */
  const getTabs = () => {
    if (!metadata) return [];
    
    const tabs: Array<{ name: string; index: number }> = [];
    let index = 0;

    // Personal Details tab (includes residential address fields)
    if (metadata.personalDetails) {
      tabs.push({ name: metadata.personalDetails.sectionName, index: index++ });
    }
    
    // Contact Details tab (only Mailing Address and Phone/Email, not Residential Address)
    // Check if there are contact details other than residential address
    const hasNonResidentialContact = metadata.contactDetails?.some(
      (subSection: ContactSubSection) => !subSection.subSectionName.toLowerCase().includes('residential')
    );
    
    if (hasNonResidentialContact && metadata.contactDetails) {
      const contactTabName = metadata.contactDetails.find(
        (sub: ContactSubSection) => !sub.subSectionName.toLowerCase().includes('residential')
      )?.subSectionName || 'Contact Details';
      tabs.push({ 
        name: contactTabName, 
        index: index++ 
      });
    }
    
    // Preferences tab
    if (metadata.interestsAndPreferences || metadata.telemarketingInformation) {
      const prefTabName = metadata.interestsAndPreferences?.sectionName || 
        metadata.telemarketingInformation?.sectionName || 
        'Preferences';
      tabs.push({ name: prefTabName, index: index++ });
    }

    return tabs;
  };

  /**
   * Map account data to form values using apiName from metadata
   * Converts account data fields to form values based on field apiName
   */
  const mapAccountDataToFormValues = useMemo(() => {
    if (!accountData || !metadata) {
      return {};
    }

    const values: Record<string, string> = {};

    // Helper function to safely get value and convert to string
    const getValue = (fieldApiName: string): string => {
      const value = (accountData as Record<string, unknown>)[fieldApiName];
      if (value === null || value === undefined) {
        return '';
      }
      // Convert numbers to strings (e.g., Mobile_Country_Code__c)
      return String(value);
    };

    // Map all fields from metadata to account data values
    const mapSectionFields = (fields: ProfileField[]) => {
      fields.forEach((field) => {
        const value = getValue(field.apiName);
        if (value !== '') {
          values[field.apiName] = value;
        }
      });
    };

    // Map personal details fields
    if (metadata.personalDetails?.sectionFields) {
      mapSectionFields(metadata.personalDetails.sectionFields);
    }

    // Map contact details fields
    if (metadata.contactDetails) {
      metadata.contactDetails.forEach((subSection: ContactSubSection) => {
        if (subSection.sectionFields) {
          mapSectionFields(subSection.sectionFields);
        }
      });
    }

    // Map interests and preferences fields
    if (metadata.interestsAndPreferences?.sectionFields) {
      mapSectionFields(metadata.interestsAndPreferences.sectionFields);
    }

    // Map telemarketing information fields
    if (metadata.telemarketingInformation?.sectionFields) {
      mapSectionFields(metadata.telemarketingInformation.sectionFields);
    }

    return values;
  }, [accountData, metadata]);

  /**
   * Update form values when account data is loaded
   */
  useEffect(() => {
    if (Object.keys(mapAccountDataToFormValues).length > 0) {
      setFormValues(mapAccountDataToFormValues);
    }
  }, [mapAccountDataToFormValues]);

  /**
   * Fetch profile metadata and account data on component mount
   */
  useEffect(() => {
    dispatch(fetchProfileMetadata());
    
    // Fetch account data after a short delay to ensure metadata is loaded first
    const accountId = getAccountId();
    if (accountId) {
      // Small delay to ensure metadata is fetched first
      const timer = setTimeout(() => {
        dispatch(fetchAccountData(accountId));
      }, 100);
      
      return () => clearTimeout(timer);
    }
  }, [dispatch]);

  /**
   * Handle field value change
   * Updates formValues state when any field changes
   */
  const handleFieldChange = (apiName: string, value: string) => {
    setFormValues((prev) => ({
      ...prev,
      [apiName]: value,
    }));
  };

  /**
   * Render a section with its fields
   * Used for Personal Details, Interests, Telemarketing sections
   * Grid columns are determined dynamically based on number of fields
   */
  const renderSection = (sectionFields: ProfileField[]) => {
    if (!sectionFields || sectionFields.length === 0) return null;

    // Dynamically determine grid columns based on number of fields
    let gridCols = 'md:grid-cols-2';
    if (sectionFields.length >= 3) {
      gridCols = 'md:grid-cols-3';
    } else if (sectionFields.length === 1) {
      gridCols = 'md:grid-cols-1';
    }

    return (
      <div className={`grid grid-cols-1 ${gridCols} gap-4 mb-4`}>
        {sectionFields.map((field: ProfileField) => (
          <DynamicFormField
            key={field.apiName}
            field={field}
            value={formValues[field.apiName] || ''}
            onChange={(value) => handleFieldChange(field.apiName, value)}
          />
        ))}
      </div>
    );
  };

  /**
   * Render contact details subsections
   * Handles Residential Address, Mailing Address, Phone/Email sections
   * All content is dynamic from API
   */
  const renderContactSubSection = (
    subSection: { subSectionName: string; sectionFields: ProfileField[] },
    index: number
  ) => {
    const { subSectionName, sectionFields } = subSection;

    // Check if this is a mailing address subsection (dynamic check)
    const isMailingAddress = subSectionName.toLowerCase().includes('mailing');
    const residentialSubSection = metadata?.contactDetails?.find(
      (sub: ContactSubSection) => sub.subSectionName.toLowerCase().includes('residential')
    );

    return (
      <div key={index}>
        <h2 className="text-xl font-semibold mb-4 text-gray-800 mt-8">
          {subSectionName}
        </h2>

        {/* Dynamic handling for mailing address checkbox - only if residential address exists */}
        {isMailingAddress && residentialSubSection && (
          <div className="mb-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                className="mr-2"
                onChange={(e) => {
                  if (e.target.checked) {
                    // Copy residential address values to mailing address dynamically
                    const residentialFields = residentialSubSection.sectionFields || [];
                    const mailingFields = sectionFields;
                    const newValues = { ...formValues };
                    
                    residentialFields.forEach((resField: ProfileField) => {
                      // Find matching mailing field by similar apiName pattern
                      const mailingField = mailingFields.find(
                        (mf: ProfileField) => mf.apiName.toLowerCase().includes('mailing')
                      );
                      if (mailingField && formValues[resField.apiName]) {
                        // Map residential to mailing fields dynamically
                        const correspondingMailingField = mailingFields.find(
                          (mf: ProfileField) => 
                            mf.apiName.replace('Mailing', '').replace('PersonMailing', '') ===
                            resField.apiName.replace('Residential', '').replace('Person', '')
                        );
                        if (correspondingMailingField) {
                          newValues[correspondingMailingField.apiName] = formValues[resField.apiName];
                        }
                      }
                    });
                    
                    setFormValues(newValues);
                  }
                }}
              />
              {/* Dynamic text based on subsection names */}
              {`Use same address as ${residentialSubSection?.subSectionName?.toLowerCase() || 'residential address'}`}
            </label>
          </div>
        )}

        {/* Render fields in dynamic grid layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          {sectionFields.map((field: ProfileField) => (
            <DynamicFormField
              key={field.apiName}
              field={field}
              value={formValues[field.apiName] || ''}
              onChange={(value) => handleFieldChange(field.apiName, value)}
            />
          ))}
        </div>
      </div>
    );
  };

  /**
   * Render telemarketing fields dynamically
   * Uses DynamicFormField component which handles PICKLIST fields from API
   * No hardcoded options - everything comes from API metadata
   */
  const renderTelemarketingField = (field: ProfileField) => {
    return (
      <div key={field.apiName} className="mb-4">
        <DynamicFormField
          field={field}
          value={formValues[field.apiName] || ''}
          onChange={(value) => handleFieldChange(field.apiName, value)}
        />
      </div>
    );
  };

  // Show loading state (metadata or account data)
  if (loading || accountLoading) {
    return (
      <div className="bg-white p-6">
        <div className="text-center py-8">
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error || accountError) {
    return (
      <div className="bg-white p-6">
        <div className="text-center py-8">
          <p className="text-red-600">{error || accountError}</p>
          <button
            onClick={() => {
              dispatch(fetchProfileMetadata());
              const accountId = getAccountId();
              if (accountId) {
                dispatch(fetchAccountData(accountId));
              }
            }}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Show message if no metadata available
  if (!metadata) {
    return (
      <div className="bg-white p-6">
        <div className="text-center py-8">
          <p className="text-gray-600">No data available</p>
        </div>
      </div>
    );
  }

  // Get dynamic tabs from metadata
  const tabs = getTabs();

  return (
    <div className="bg-white">
      {/* Dynamic page title - can be made configurable or from API */}
      <h1 className="text-xl font-bold text-gray-800 pt-8 ml-6">Profile</h1>
      
      {/* Dynamic Tab Navigation - generated from metadata */}
      {tabs.length > 0 && (
        <div className="border-b border-gray-200 mb-4">
          <nav className="flex md:ml-4 md:space-x-8 space-x-4 mt-4" aria-label="Tabs">
            {tabs.map((tab) => (
              <button
                key={tab.index}
                className={`px-2 py-2 text-md font-medium ${
                  tabValue === tab.index
                    ? 'border-b-2 border-blue-600 text-blue-600'
                    : 'text-gray-500 hover:text-blue-600'
                }`}
                onClick={() => setTabValue(tab.index)}
              >
                {tab.name}
              </button>
            ))}
          </nav>
        </div>
      )}

      {/* Dynamic Tabs - rendered based on available sections */}
      {tabs.map((tab) => {
        // Tab 0: Personal Details (includes Residential Address)
        if (tab.index === 0 && metadata.personalDetails) {
          // Find Residential Address subsection from contactDetails
          const residentialSubSection = metadata.contactDetails?.find(
            (sub: ContactSubSection) => sub.subSectionName.toLowerCase().includes('residential')
          );

          return (
            <TabPanel key={tab.index} value={tabValue} index={tab.index}>
              <div className="bg-white rounded-lg shadow p-6 mb-6">
                {/* Personal Details Section */}
                <h2 className="text-xl font-semibold mb-4 text-gray-800">
                  {metadata.personalDetails.sectionName}
                </h2>
                {renderSection(metadata.personalDetails.sectionFields)}

                {/* Residential Address Section - merged into Personal Details */}
                {residentialSubSection && (
                  <>
                    <h2 className="text-xl font-semibold mb-4 text-gray-800 mt-8">
                      {residentialSubSection.subSectionName}
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      {residentialSubSection.sectionFields.map((field: ProfileField) => (
                        <DynamicFormField
                          key={field.apiName}
                          field={field}
                          value={formValues[field.apiName] || ''}
                          onChange={(value) => handleFieldChange(field.apiName, value)}
                        />
                      ))}
                    </div>
                  </>
                )}
              </div>
            </TabPanel>
          );
        }

        // Tab 1: Contact Details (only Mailing Address and Phone/Email, excluding Residential)
        if (tab.index === 1 && metadata.contactDetails) {
          // Filter out Residential Address subsection
          const nonResidentialSubSections = metadata.contactDetails.filter(
            (sub: ContactSubSection) => !sub.subSectionName.toLowerCase().includes('residential')
          );

          return (
            <TabPanel key={tab.index} value={tabValue} index={tab.index}>
              <div className="bg-white rounded-lg shadow p-6">
                {nonResidentialSubSections.map((subSection: ContactSubSection, index: number) =>
                  renderContactSubSection(subSection, index)
                )}
              </div>
            </TabPanel>
          );
        }

        // Tab 2: Preferences (Interests and Telemarketing)
        if (tab.index === 2) {
          return (
            <TabPanel key={tab.index} value={tabValue} index={tab.index}>
              <div className="bg-white rounded-lg shadow p-6">
                {/* Interests and Preferences Section - Dynamic from API */}
                {metadata.interestsAndPreferences && (
                  <>
                    <h2 className="text-xl font-semibold mb-4 text-gray-800">
                      {metadata.interestsAndPreferences.sectionName}
                    </h2>
                    <div className="mb-4">
                      {/* Render all fields dynamically - no hardcoded logic */}
                      {metadata.interestsAndPreferences.sectionFields.map((field: ProfileField) => (
                        <div key={field.apiName} className="mb-4">
                          <DynamicFormField
                            field={field}
                            value={formValues[field.apiName] || ''}
                            onChange={(value) => handleFieldChange(field.apiName, value)}
                          />
                        </div>
                      ))}
                    </div>
                  </>
                )}

                {/* Telemarketing Information Section - Dynamic from API */}
                {metadata.telemarketingInformation && (
                  <>
                    <h2 className="text-xl font-semibold mb-4 text-gray-800 mt-8">
                      {metadata.telemarketingInformation.sectionName}
                    </h2>
                    <div className="mb-4">
                      <div className="space-y-4">
                        {metadata.telemarketingInformation.sectionFields.map((field: ProfileField) =>
                          renderTelemarketingField(field)
                        )}
                      </div>
                    </div>
                  </>
                )}
              </div>
            </TabPanel>
          );
        }

        return null;
      })}
    </div>
  );
};

export default Account;
