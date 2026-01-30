import { Box, Container } from '@mui/material';
import { ReactElement, useState } from 'react';

const TabPanel = ({
  children,
  value,
  index,
}: {
  children?: React.ReactNode;
  value: number;
  index: number;
}) => {
  return value === index ? (
    <div className="p-6">{children}</div>
  ) : null;
};

const Account = (): ReactElement => {
  const [tabValue, setTabValue] = useState(0);

  return (
    
    <div className="bg-white">
      <h1 className="text-xl font-bold text-gray-800 pt-8 ml-6">Edit Profile</h1>
      <div className="border-b border-gray-200 mb-4">
        <nav className="flex md:ml-4 md:space-x-8 space-x-4 mt-4" aria-label="Tabs">
          <button
            className={`px-2 py-2 text-md font-medium ${
              tabValue === 0
                ? 'border-b-2 border-blue-600 text-blue-600'
                : 'text-gray-500 hover:text-blue-600'
            }`}
            onClick={() => setTabValue(0)}
          >
            Personal Details
          </button>
          <button
            className={`text-md font-medium ${
              tabValue === 1
                ? 'border-b-2 border-blue-600 text-blue-600'
                : 'text-gray-500 hover:text-blue-600'
            }`}
            onClick={() => setTabValue(1)}
          >
            Contact Details
          </button>
          <button
            className={`text-md font-medium ${
              tabValue === 2
                ? 'border-b-2 border-blue-600 text-blue-600'
                : 'text-gray-500 hover:text-blue-600'
            }`}
            onClick={() => setTabValue(2)}
          >
            Preferences
          </button>
        </nav>
      </div>

      <TabPanel value={tabValue} index={0}>
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-gray-700 mb-1">Salutation *</label>
              <select className="w-full border border-gray-300 rounded px-3 py-2">
                <option value="">Select</option>
                <option value="Mr">Mr</option>
                <option value="Mrs">Mrs</option>
                <option value="Ms">Ms</option>
                <option value="Dr">Dr</option>
                <option value="Prof">Prof</option>
              </select>
            </div>
            <div>
              <label className="block text-gray-700 mb-1">First Name *</label>
              <input className="w-full border border-gray-300 rounded px-3 py-2" />
            </div>
            <div>
              <label className="block text-gray-700 mb-1">Last Name *</label>
              <input className="w-full border border-gray-300 rounded px-3 py-2" />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-gray-700 mb-1">
              Full Name (as per NRIC/FIN/Passport) *
            </label>
            <input className="w-full border border-gray-300 rounded px-3 py-2" />
          </div>
          <div>
            <label className="block text-gray-700 mb-1">
              How would you like to be addressed? *
            </label>
            <input className="w-full border border-gray-300 rounded px-3 py-2" />
          </div>
          </div>
         
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <label className="block text-gray-700 mb-1">Alias</label>
            <input className="w-full border border-gray-300 rounded px-3 py-2" />
          </div>
            <div>
              <label className="block text-gray-700 mb-1">ID Type *</label>
              <select className="w-full border border-gray-300 rounded px-3 py-2">
                <option value="">Select</option>
                <option value="NRIC">NRIC</option>
                <option value="FIN">FIN</option>
                <option value="Passport">Passport</option>
              </select>
            </div>
            <div>
              <label className="block text-gray-700 mb-1">ID Number *</label>
              <input className="w-full border border-gray-300 rounded px-3 py-2" />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-gray-700 mb-1">Nationality *</label>
              <select className="w-full border border-gray-300 rounded px-3 py-2">
                <option value="">Select</option>
                <option value="SG">Singapore</option>
                <option value="MY">Malaysia</option>
                <option value="IN">India</option>
                <option value="CN">China</option>
                <option value="OT">Other</option>
              </select>
            </div>
            <div>
              <label className="block text-gray-700 mb-1">Citizenship *</label>
              <select className="w-full border border-gray-300 rounded px-3 py-2">
                <option value="">Select</option>
                <option value="SG">Singapore</option>
                <option value="MY">Malaysia</option>
                <option value="IN">India</option>
                <option value="CN">China</option>
                <option value="OT">Other</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-gray-700 mb-1">Date of Birth *</label>
              <input
                type="date"
                className="w-full border border-gray-300 rounded px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-1">Gender *</label>
              <select className="w-full border border-gray-300 rounded px-3 py-2">
                <option value="">Select</option>
                <option value="M">Male</option>
                <option value="F">Female</option>
                <option value="O">Other</option>
              </select>
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-1">Marital Status *</label>
            <select className="w-full border border-gray-300 rounded px-3 py-2">
              <option value="">Select</option>
              <option value="S">Single</option>
              <option value="M">Married</option>
              <option value="D">Divorced</option>
              <option value="W">Widowed</option>
            </select>
          </div>
        </div>
      </TabPanel>

      <TabPanel value={tabValue} index={1}>
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">
            Residential Address
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-gray-700 mb-1">Country *</label>
              <select className="w-full border border-gray-300 rounded px-3 py-2">
                <option value="">Select</option>
                <option value="SG">Singapore</option>
                <option value="MY">Malaysia</option>
                <option value="IN">India</option>
                <option value="CN">China</option>
                <option value="OT">Other</option>
              </select>
            </div>
            <div>
              <label className="block text-gray-700 mb-1">Postal Code *</label>
              <input className="w-full border border-gray-300 rounded px-3 py-2" />
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-1">Unit No. (e.g. #01-01)</label>
            <input className="w-full border border-gray-300 rounded px-3 py-2" />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-1">Residential Address Line 1 *</label>
            <input className="w-full border border-gray-300 rounded px-3 py-2" />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-1">Residential Address Line 2</label>
            <input className="w-full border border-gray-300 rounded px-3 py-2" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-gray-700 mb-1">City *</label>
              <input className="w-full border border-gray-300 rounded px-3 py-2" />
            </div>
            <div>
              <label className="block text-gray-700 mb-1">State *</label>
              <input className="w-full border border-gray-300 rounded px-3 py-2" />
            </div>
          </div>

          <h2 className="text-xl font-semibold mb-4 text-gray-800 mt-8">
            Mailing Address
          </h2>
          <div className="mb-4">
            <label className="flex items-center">
              <input type="checkbox" className="mr-2" />
              My mailing address is the same as my residential address provided above.
            </label>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-gray-700 mb-1">Country *</label>
              <select className="w-full border border-gray-300 rounded px-3 py-2">
                <option value="">Select</option>
                <option value="SG">Singapore</option>
                <option value="MY">Malaysia</option>
                <option value="IN">India</option>
                <option value="CN">China</option>
                <option value="OT">Other</option>
              </select>
            </div>
            <div>
              <label className="block text-gray-700 mb-1">Postal Code *</label>
              <input className="w-full border border-gray-300 rounded px-3 py-2" />
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-1">Unit No. (e.g. #01-01)</label>
            <input className="w-full border border-gray-300 rounded px-3 py-2" />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-1">Mailing Address Line 1 *</label>
            <input className="w-full border border-gray-300 rounded px-3 py-2" />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-1">Mailing Address Line 2</label>
            <input className="w-full border border-gray-300 rounded px-3 py-2" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-gray-700 mb-1">City *</label>
              <input className="w-full border border-gray-300 rounded px-3 py-2" />
            </div>
            <div>
              <label className="block text-gray-700 mb-1">State *</label>
              <input className="w-full border border-gray-300 rounded px-3 py-2" />
            </div>
          </div>

          <h2 className="text-xl font-semibold mb-4 text-gray-800 mt-8">
            Phone Number and Email Address
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-gray-700 mb-1">Country Code *</label>
              <select className="w-full border border-gray-300 rounded px-3 py-2">
                <option value="">Select</option>
                <option value="+65">+65 (Singapore)</option>
                <option value="+60">+60 (Malaysia)</option>
                <option value="+91">+91 (India)</option>
                <option value="+86">+86 (China)</option>
              </select>
            </div>
            <div>
              <label className="block text-gray-700 mb-1">Mobile No. *</label>
              <input className="w-full border border-gray-300 rounded px-3 py-2" />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-gray-700 mb-1">Country Code</label>
              <select className="w-full border border-gray-300 rounded px-3 py-2">
                <option value="">Select</option>
                <option value="+65">+65 (Singapore)</option>
                <option value="+60">+60 (Malaysia)</option>
                <option value="+91">+91 (India)</option>
                <option value="+86">+86 (China)</option>
              </select>
            </div>
            <div>
              <label className="block text-gray-700 mb-1">Other No.</label>
              <input className="w-full border border-gray-300 rounded px-3 py-2" />
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-1">Email Address</label>
            <input
              type="email"
              className="w-full border border-gray-300 rounded px-3 py-2"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-1">Work/Secondary Email Address</label>
            <input
              type="email"
              className="w-full border border-gray-300 rounded px-3 py-2"
            />
          </div>
        </div>
      </TabPanel>

      <TabPanel value={tabValue} index={2}>
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">
            ISCA Member Directory
          </h2>
          <div className="mb-4">
            <p className="text-gray-600 mb-4">
              The ISCA Member Directory publishes active ISCA members only and does not publish individual contact details. Members who do not renew their membership before it expires or have opted out will not be shown in the directory.
            </p>
            <label className="flex items-center">
              <input type="checkbox" className="mr-2" />
              Opt-out from member directory
            </label>
          </div>

          <h2 className="text-xl font-semibold mb-4 text-gray-800 mt-8">
            Interests and Preferences
          </h2>
          <div className="mb-4">
            <p className="text-gray-600 mb-4">
              Receive communications from us on services and activities that are relevant to you. Please select the relevant checkboxes.
            </p>
            <div className="space-y-4">
              <div>
                <h3 className="font-medium mb-2">Technical Excellence</h3>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2" />
                    Audit & Assurance
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2" />
                    Business Valuation
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2" />
                    Corporate Finance
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2" />
                    Financial Reporting
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2" />
                    Financial Forensics
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2" />
                    Corporate Governance and Risk Management
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2" />
                    Insolvency, Restructuring & Liquidation
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2" />
                    Management Accounting
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2" />
                    Project Financing
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2" />
                    Sustainability Reporting
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2" />
                    Taxation
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2" />
                    Business Law & Corporate Secretarial
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2" />
                    Governance & Risk Management
                  </label>
                </div>
              </div>

              <div>
                <h3 className="font-medium mb-2">Future Finance (Emerging Trends/Technology)</h3>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2" />
                    Agile Finance (Big Data Analysis, Blockchain, Cyber Security, FinTech)
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2" />
                    Digital Awareness
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2" />
                    Green Finance
                  </label>
                </div>
              </div>

              <div>
                <h3 className="font-medium mb-2">Business Acumen</h3>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2" />
                    Business Innovation
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2" />
                    Business Partnering
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2" />
                    Sustainable Business Strategy
                  </label>
                </div>
              </div>

              <div>
                <h3 className="font-medium mb-2">Professional Values and Ethics</h3>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2" />
                    Professional Values and Ethics
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2" />
                    Anti-Money Laundering and Countering the Financing of Terrorism
                  </label>
                </div>
              </div>

              <div>
                <h3 className="font-medium mb-2">Leadership & Personal Empowerment</h3>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2" />
                    Leadership & Personal Empowerment
                  </label>
                </div>
              </div>

              <div>
                <h3 className="font-medium mb-2">Bulletins and Newsletters</h3>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2" />
                    Practitioners' Bulletin
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2" />
                    Business & Finance Bulletin
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2" />
                    Monthly Chartered Accountants Lab
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2" />
                    Special ISCA offerings and events
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2" />
                    Participate in ISCA's research and surveys
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2" />
                    ISCAccountify Bulletin
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2" />
                    Financial Forensic Focus
                  </label>
                </div>
              </div>
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 mb-1">Communication on Renewal Notice *</label>
            <select className="w-full border border-gray-300 rounded px-3 py-2">
              <option value="">Select</option>
              <option value="email">Email</option>
              <option value="post">Post</option>
              <option value="both">Both</option>
            </select>
          </div>

          <h2 className="text-xl font-semibold mb-4 text-gray-800 mt-8">
            Telemarketing Information
          </h2>
          <div className="mb-4">
            <p className="text-gray-600 mb-4">
              The Institute of Singapore Chartered Accountants ("ISCA") will adhere to the Do Not Call (DNC) provisions of Singapore's Personal Data Protection Act 2012 for the conduct of marketing activities to our members and the public. The ISCA will also adhere to General Data Protection Regulation 2016/679 and similar European and UK data protection and data security laws (the "Data Protection Laws") regarding marketing activities for ISCA members residing in Europe.
            </p>
            <div className="space-y-4">
              <div>
                <label className="block text-gray-700 mb-1">Voice Call *</label>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input type="radio" name="voiceCall" className="mr-2" />
                    Consent
                  </label>
                  <label className="flex items-center">
                    <input type="radio" name="voiceCall" className="mr-2" />
                    Do Not Consent
                  </label>
                </div>
              </div>
              <div>
                <label className="block text-gray-700 mb-1">Text Message (SMS) *</label>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input type="radio" name="sms" className="mr-2" />
                    Consent
                  </label>
                  <label className="flex items-center">
                    <input type="radio" name="sms" className="mr-2" />
                    Do Not Consent
                  </label>
                </div>
              </div>
              <div>
                <label className="block text-gray-700 mb-1">Fax Message *</label>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input type="radio" name="fax" className="mr-2" />
                    Consent
                  </label>
                  <label className="flex items-center">
                    <input type="radio" name="fax" className="mr-2" />
                    Do Not Consent
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
      </TabPanel>
    </div>
   
  );
};

export default Account;