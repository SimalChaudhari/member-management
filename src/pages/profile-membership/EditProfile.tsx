/**
 * ============================================================================
 * PROFILE & MEMBERSHIP MODULE
 * ============================================================================
 * 
 * This module contains all profile and membership related pages:
 * - EditProfile.tsx: Main profile editing page with dynamic form fields
 * - MyMembership.tsx: Membership details display page
 * - ChangePassword.tsx: Password change functionality
 * 
 * All components in this module are dynamically rendered based on API metadata.
 * No hardcoded content - everything comes from the API response structure.
 * 
 * Related Files:
 * - store/action/ProfileMetadataActions.tsx: Fetches form metadata
 * - store/action/AccountDataActions.tsx: Fetches account data values
 * - store/types/profileMetadata.ts: Type definitions for metadata and account data
 * - components/settings/DynamicFormField.tsx: Reusable form field component
 * ============================================================================
 */

import { ReactElement, useState, useEffect, useMemo } from 'react';
import { useAppDispatch, useAppSelector } from 'store/hooks';
import { fetchProfileMetadata } from 'store/action/ProfileMetadataActions';
import { fetchAccountData } from 'store/action/AccountDataActions';
import DynamicFormField from 'components/settings/DynamicFormField';
import DataTable, { Column } from 'components/table/DataTable';
import type { ProfileField, ContactSubSection, EmploymentHistoryRecord } from 'store/types/profileMetadata';

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
 * Edit Profile Page Component
 * 
 * This component dynamically renders form fields based on metadata fetched from API.
 * All tabs, sections, and fields are rendered dynamically based on the API response structure.
 * No hardcoded content - everything comes from the API metadata.
 * 
 * Features:
 * - Personal Details tab: Includes Personal Details, Residential Address, Mailing Address, 
 *   Phone/Email, Interests & Preferences, and Telemarketing Information
 * - Employment History tab: Displays employment records in tables (Current and Previous)
 * 
 * Data Flow:
 * 1. Fetches profile metadata from API (defines form structure)
 * 2. Fetches account data from API (populates form values)
 * 3. Maps account data to form values using apiName from metadata
 * 4. Renders dynamic form fields and tables based on metadata
 */
const EditProfile = (): ReactElement => {
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
   * Personal Details tab includes all sections (residential address, mailing address, phone/email, interests, telemarketing)
   */
  const getTabs = () => {
    if (!metadata) return [];
    
    const tabs: Array<{ name: string; index: number }> = [];
    let index = 0;

    // Personal Details tab (includes everything: residential address, mailing address, phone/email, interests, telemarketing)
    if (metadata.personalDetails) {
      tabs.push({ name: metadata.personalDetails.sectionName, index: index++ });
    }

    // Employment History tab
    if (metadata.employmentHistory) {
      tabs.push({ name: metadata.employmentHistory.sectionName, index: index++ });
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

    // Map employment history fields
    if (metadata.employmentHistory?.sectionFields) {
      mapSectionFields(metadata.employmentHistory.sectionFields);
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
   * Render telemarketing fields dynamically
   * Uses DynamicFormField component which handles PICKLIST fields from API
   * No hardcoded options - everything comes from API metadata
   * Fields are displayed inline (side-by-side) in a grid layout
   */
  const renderTelemarketingField = (field: ProfileField) => {
    return (
      <div key={field.apiName}>
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
      {/* Dynamic page title */}
      <h1 className="text-xl font-bold text-gray-800 pt-8 ml-6">Edit Profile</h1>
      
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
        // Personal Details tab (includes Residential Address, Mailing Address, Phone/Email, Interests & Preferences, Telemarketing)
        if (metadata.personalDetails && 
            (tab.name === metadata.personalDetails.sectionName || tab.index === 0)) {
          // Find Residential Address subsection from contactDetails
          const residentialSubSection = metadata.contactDetails?.find(
            (sub: ContactSubSection) => sub.subSectionName.toLowerCase().includes('residential')
          );

          // Find Mailing Address subsection from contactDetails
          const mailingSubSection = metadata.contactDetails?.find(
            (sub: ContactSubSection) => sub.subSectionName.toLowerCase().includes('mailing')
          );

          // Find Phone/Email subsection from contactDetails (exclude residential and mailing)
          const phoneEmailSubSections = metadata.contactDetails?.filter(
            (sub: ContactSubSection) => 
              !sub.subSectionName.toLowerCase().includes('residential') &&
              !sub.subSectionName.toLowerCase().includes('mailing')
          ) || [];

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

                {/* Mailing Address Section - merged into Personal Details */}
                {mailingSubSection && (
                  <>
                    <h2 className="text-xl font-semibold mb-4 text-gray-800 mt-8">
                      {mailingSubSection.subSectionName}
                    </h2>
                    {/* Dynamic handling for mailing address checkbox - only if residential address exists */}
                    {residentialSubSection && (
                      <div className="mb-4">
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            className="mr-2"
                            onChange={(e) => {
                              if (e.target.checked) {
                                // Copy residential address values to mailing address dynamically
                                const residentialFields = residentialSubSection.sectionFields || [];
                                const mailingFields = mailingSubSection.sectionFields;
                                const newValues = { ...formValues };
                                
                                residentialFields.forEach((resField: ProfileField) => {
                                  // Map residential to mailing fields dynamically
                                  const correspondingMailingField = mailingFields.find(
                                    (mf: ProfileField) => 
                                      mf.apiName.replace('Mailing', '').replace('PersonMailing', '') ===
                                      resField.apiName.replace('Residential', '').replace('Person', '')
                                  );
                                  if (correspondingMailingField) {
                                    newValues[correspondingMailingField.apiName] = formValues[resField.apiName];
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
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      {mailingSubSection.sectionFields.map((field: ProfileField) => (
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

                {/* Phone Number and Email Address Section - merged into Personal Details */}
                {phoneEmailSubSections.length > 0 && phoneEmailSubSections.map((subSection: ContactSubSection, index: number) => (
                  <div key={index}>
                    <h2 className="text-xl font-semibold mb-4 text-gray-800 mt-8">
                      {subSection.subSectionName}
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      {subSection.sectionFields.map((field: ProfileField) => (
                        <DynamicFormField
                          key={field.apiName}
                          field={field}
                          value={formValues[field.apiName] || ''}
                          onChange={(value) => handleFieldChange(field.apiName, value)}
                        />
                      ))}
                    </div>
                  </div>
                ))}

                {/* Interests and Preferences Section - merged into Personal Details */}
                {metadata.interestsAndPreferences && (
                  <>
                    <h2 className="text-xl font-semibold mb-4 text-gray-800 mt-8">
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

                {/* Telemarketing Information Section - merged into Personal Details */}
                {metadata.telemarketingInformation && (
                  <>
                    <h2 className="text-xl font-semibold mb-4 text-gray-800 mt-8">
                      {metadata.telemarketingInformation.sectionName}
                    </h2>
                    <div className="mb-4">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {metadata.telemarketingInformation.sectionFields.map((field: ProfileField) =>
                          renderTelemarketingField(field)
                        )}
                      </div>  
                    </div>
                  </>
                )}

                {/* Cancel and Submit Buttons */}
                <div className="flex justify-end gap-4 mt-8 pt-6 border-t border-gray-200">
                  <button
                    type="button"
                    className="px-6 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    Submit
                  </button>
                </div>
              </div>
            </TabPanel>
          );
        }

        // Employment History tab
        if (metadata.employmentHistory && 
            (tab.name === metadata.employmentHistory.sectionName || 
             tab.name.toLowerCase().includes('employment') ||
             tab.name.toLowerCase().includes('history'))) {
          
          // Get employment history records from account data
          const employmentRecords = accountData?.Employment_History__r?.records || [];
          const currentEmploymentRecords = employmentRecords.filter(
            (record: EmploymentHistoryRecord) => record.Is_Current_Employment__c === true
          );
          const previousEmploymentRecords = employmentRecords.filter(
            (record: EmploymentHistoryRecord) => record.Is_Current_Employment__c !== true
          );

          // Get Current Employment Status field (if exists in metadata)
          const currentEmploymentStatusField = metadata.employmentHistory.sectionFields.find(
            (field: ProfileField) => field.apiName.toLowerCase().includes('current') && 
            field.apiName.toLowerCase().includes('status')
          );

          // Table columns based on metadata fields (exclude some fields, focus on main ones)
          const tableFields = metadata.employmentHistory.sectionFields.filter(
            (field: ProfileField) => 
              !field.apiName.toLowerCase().includes('current') &&
              !field.apiName.toLowerCase().includes('status') &&
              !field.apiName.toLowerCase().includes('responsibilities') &&
              !field.apiName.toLowerCase().includes('experience') &&
              !field.apiName.toLowerCase().includes('other') &&
              field.fieldType !== 'DATE' && // Exclude date fields
              !field.apiName.toLowerCase().includes('date') // Exclude any field with 'date' in name
          );

          // Prepare columns for DataTable component
          const currentEmploymentColumns: Column<EmploymentHistoryRecord>[] = [
            {
              key: 'Id',
              header: 'No.',
              sortable: false,
              width: '60px',
              render: (_value, _row, index) => (index !== undefined ? index + 1 : ''),
            },
            ...tableFields.map((field: ProfileField) => ({
              key: field.apiName as keyof EmploymentHistoryRecord,
              header: field.label,
              sortable: true,
            })),
            {
              key: 'Id' as keyof EmploymentHistoryRecord,
              header: 'Action',
              sortable: false,
              width: '120px',
              render: () => (
                <div className="flex gap-2">
                  <button className="text-blue-600 hover:text-blue-800">Edit</button>
                  <span>|</span>
                  <button className="text-red-600 hover:text-red-800">Delete</button>
                </div>
              ),
            },
          ];

          const previousEmploymentColumns: Column<EmploymentHistoryRecord>[] = [
            {
              key: 'Id',
              header: 'No.',
              sortable: false,
              width: '60px',
              render: (_value, _row, index) => (index !== undefined ? index + 1 : ''),
            },
            ...tableFields.map((field: ProfileField) => ({
              key: field.apiName as keyof EmploymentHistoryRecord,
              header: field.label,
              sortable: true,
            })),
            {
              key: 'Id' as keyof EmploymentHistoryRecord,
              header: 'Action',
              sortable: false,
              width: '120px',
              render: () => (
                <div className="flex gap-2">
                  <button className="text-blue-600 hover:text-blue-800">Edit</button>
                  <span>|</span>
                  <button className="text-red-600 hover:text-red-800">Delete</button>
                </div>
              ),
            },
          ];

          return (
            <TabPanel key={tab.index} value={tabValue} index={tab.index}>
              <div className="bg-white rounded-lg shadow p-6">
                {/* Current Employment Status */}
                {currentEmploymentStatusField && (
                  <div className="mb-6">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      {currentEmploymentStatusField.label}
                    </label>
                    <DynamicFormField
                      field={currentEmploymentStatusField}
                      value={formValues[currentEmploymentStatusField.apiName] || ''}
                      onChange={(value) => handleFieldChange(currentEmploymentStatusField.apiName, value)}
                    />
                    <div className="flex justify-end mt-4">
                      <button
                        type="button"
                        className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                      >
                        Save
                      </button>
                    </div>
                  </div>
                )}

                {/* Current Employment Section */}
                <div className="mb-8">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold text-gray-800">Current Employment</h2>
                  </div>
                  
                  <div className="mb-4 flex items-end justify-between gap-4">
                    <div className="w-auto min-w-[300px]">
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Select Primary Employment
                      </label>
                      <select className="w-full border border-gray-300 rounded px-3 py-2">
                        <option value="">Select</option>
                        {currentEmploymentRecords.map((record: EmploymentHistoryRecord) => (
                          <option key={record.Id} value={record.Id}>
                            {record.Employer_Name__c || record.Other_Organisation_Name__c || 'Unnamed'}
                          </option>
                        ))}
                      </select>
                    </div>
                    <button
                      type="button"
                      className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 whitespace-nowrap"
                    >
                      + New
                    </button>
                  </div>

                  {/* Current Employment Table */}
                  <DataTable<EmploymentHistoryRecord>
                    data={currentEmploymentRecords}
                    columns={currentEmploymentColumns}
                    emptyMessage="No data available"
                    showSearch={false}
                    showHeader={false}
                    defaultPageSize={10}
                  />
                </div>

                {/* Previous Work Experience Section */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold text-gray-800">Previous Work Experience</h2>
                    <button
                      type="button"
                      className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                    >
                      + New
                    </button>
                  </div>

                  {/* Previous Work Experience Table */}
                  <DataTable<EmploymentHistoryRecord>
                    data={previousEmploymentRecords}
                    columns={previousEmploymentColumns}
                    emptyMessage="No data available"
                    showSearch={false}
                    showHeader={false}
                    defaultPageSize={10}
                  />
                </div>
              </div>
            </TabPanel>
          );
        }

        return null;
      })}
    </div>
  );
};

export default EditProfile;
