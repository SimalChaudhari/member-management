/**
 * ============================================================================
 * PROFILE & MEMBERSHIP MODULE - Change Password Page
 * ============================================================================
 * 
 * This component allows users to change their account password with comprehensive
 * validation and password requirements.
 * 
 * Features:
 * - Password validation (8-15 characters, uppercase, lowercase, numbers, special chars)
 * - Real-time password requirement feedback
 * - Password visibility toggle
 * - API integration for password change
 * 
 * Related Files:
 * - store/action/ChangePasswordActions.tsx: Password change API integration
 * - store/types/auth.ts: User profile types
 * ============================================================================
 */

import { ReactElement, useState } from 'react';
import { useAppSelector } from 'store/hooks';
import { changePasswordAPI } from 'store/action/ChangePasswordActions';

/**
 * Change Password Page Component
 * Allows users to change their account password with validation
 */
const ChangePassword = (): ReactElement => {
  // Get user ID from auth profile
  const { profile } = useAppSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    newPassword: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState({
    newPassword: '',
    confirmPassword: '',
  });

  const [showPasswords, setShowPasswords] = useState({
    newPassword: false,
    confirmPassword: false,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

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
   * Validate password requirements
   */
  const validatePassword = (password: string): string[] => {
    const requirements: string[] = [];

    if (password.length < 8 || password.length > 15) {
      requirements.push('Password must be between 8 and 15 characters long');
    }

    if (!/[A-Z]/.test(password)) {
      requirements.push('Password must include uppercase letters');
    }

    if (!/[a-z]/.test(password)) {
      requirements.push('Password must include lowercase letters');
    }

    if (!/[0-9]/.test(password)) {
      requirements.push('Password must include numbers');
    }

    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
      requirements.push('Password must include special characters');
    }

    return requirements;
  };

  /**
   * Handle input change
   */
  const handleChange = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Clear error when user starts typing
    setErrors((prev) => ({
      ...prev,
      [field]: '',
    }));
  };

  /**
   * Validate form
   */
  const validateForm = (): boolean => {
    const newErrors = {
      newPassword: '',
      confirmPassword: '',
    };

    let isValid = true;

    // Validate new password
    if (!formData.newPassword.trim()) {
      newErrors.newPassword = 'New password is required';
      isValid = false;
    } else {
      const passwordRequirements = validatePassword(formData.newPassword);
      if (passwordRequirements.length > 0) {
        newErrors.newPassword = passwordRequirements[0];
        isValid = false;
      }
    }

    // Validate confirm password
    if (!formData.confirmPassword.trim()) {
      newErrors.confirmPassword = 'Please confirm your new password';
      isValid = false;
    } else if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  /**
   * Handle form submission
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setSuccessMessage('');
    setErrors({
      newPassword: '',
      confirmPassword: '',
    });

    try {
      const userId = getUserId();
      
      // Call change password API
      await changePasswordAPI(userId, formData.newPassword);

      // Reset form on success
      setFormData({
        newPassword: '',
        confirmPassword: '',
      });

      // Show success message
      setSuccessMessage('Password changed successfully!');
      
      // Clear success message after 5 seconds
      setTimeout(() => {
        setSuccessMessage('');
      }, 5000);
    } catch (error) {
      // Handle error
      let errorMessage = 'Failed to change password. Please try again.';
      
      if (error && typeof error === 'object') {
        // Check for Salesforce API error response
        if ('response' in error && error.response) {
          const response = error.response as {
            data?: unknown;
            status?: number;
          };
          
          if (response.data && typeof response.data === 'object') {
            const errorData = response.data as Record<string, unknown>;
            if (Array.isArray(errorData)) {
              const firstError = errorData[0] as Record<string, unknown>;
              errorMessage = (firstError.message as string) || errorMessage;
            } else if ('message' in errorData) {
              errorMessage = String(errorData.message);
            } else if ('error' in errorData) {
              errorMessage = String(errorData.error);
            }
          } else if (response.status === 400) {
            errorMessage = 'Invalid password. Please check the requirements.';
          } else if (response.status === 401) {
            errorMessage = 'Unauthorized. Please login again.';
          } else if (response.status === 403) {
            errorMessage = 'You do not have permission to change password.';
          }
        } else if ('message' in error) {
          errorMessage = String((error as Error).message);
        }
      }
      
      setErrors((prev) => ({
        ...prev,
        newPassword: errorMessage,
      }));
    } finally {
      setIsSubmitting(false);
    }
  };

  /**
   * Check password requirements and return status
   */
  const getPasswordRequirements = () => {
    const password = formData.newPassword;
    if (!password) {
      return {
        length: false,
        uppercase: false,
        lowercase: false,
        number: false,
        special: false,
      };
    }

    return {
      length: password.length >= 8 && password.length <= 15,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /[0-9]/.test(password),
      special: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password),
    };
  };

  const passwordRequirements = getPasswordRequirements();

  return (
    <div className="bg-white">
      <h1 className="text-xl font-bold text-gray-800 pt-8 ml-6">Change Password</h1>
      
      {/* Single Card with Form and Instructions */}
      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 mb-6 mt-3">
          {/* Success Message */}
          {successMessage && (
            <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-green-800 text-sm">{successMessage}</p>
            </div>
          )}

          {/* Form Fields */}
          {/* New Password Field */}
            <div className="mb-4">
              <label htmlFor="newPassword" className="block text-gray-700 mb-1">
                New Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type={showPasswords.newPassword ? 'text' : 'password'}
                  id="newPassword"
                  value={formData.newPassword}
                  onChange={(e) => handleChange('newPassword', e.target.value)}
                  className={`w-full border rounded px-3 py-2 pr-10 ${
                    errors.newPassword ? 'border-red-500' : 'border-gray-300'
                  } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  placeholder="Enter your new password"
                />
                <button
                  type="button"
                  onClick={() =>
                    setShowPasswords((prev) => ({
                      ...prev,
                      newPassword: !prev.newPassword,
                    }))
                  }
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPasswords.newPassword ? (
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                      />
                    </svg>
                  ) : (
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                  )}
                </button>
              </div>
              {errors.newPassword && (
                <p className="text-red-500 text-sm mt-1">{errors.newPassword}</p>
              )}
            </div>

            {/* Confirm Password Field */}
            <div className="mb-4">
              <label htmlFor="confirmPassword" className="block text-gray-700 mb-1">
                Confirm Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type={showPasswords.confirmPassword ? 'text' : 'password'}
                  id="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={(e) => handleChange('confirmPassword', e.target.value)}
                  className={`w-full border rounded px-3 py-2 pr-10 ${
                    errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                  } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  placeholder="Confirm your new password"
                />
                <button
                  type="button"
                  onClick={() =>
                    setShowPasswords((prev) => ({
                      ...prev,
                      confirmPassword: !prev.confirmPassword,
                    }))
                  }
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPasswords.confirmPassword ? (
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                      />
                    </svg>
                  ) : (
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>
              )}
            </div>

          {/* Submit Buttons */}
          <div className="flex justify-end gap-4 mt-6">
            <button
              type="button"
              onClick={() => {
                setFormData({
                  newPassword: '',
                  confirmPassword: '',
                });
                setErrors({
                  newPassword: '',
                  confirmPassword: '',
                });
                setSuccessMessage('');
              }}
              className="px-6 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Changing Password...' : 'Change Password'}
            </button>
          </div>

          {/* Instructions Below Buttons - Inline Layout */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left Side - Password Requirements */}
              <div>
                <h2 className="text-lg font-semibold text-gray-800 mb-4">
                  Password Requirements
                </h2>
                <p className="text-sm text-gray-700 mb-4 leading-relaxed">
                  Your account password must be between 8 and 15 characters long. They must include:
                </p>
                <ul className="space-y-3 text-sm text-gray-700">
                  <li className="flex items-start">
                    <span
                      className={`mr-3 mt-0.5 text-lg font-bold ${
                        passwordRequirements.length && passwordRequirements.uppercase && passwordRequirements.lowercase
                          ? 'text-green-600'
                          : 'text-gray-400'
                      }`}
                    >
                      {passwordRequirements.length && passwordRequirements.uppercase && passwordRequirements.lowercase
                        ? '✓'
                        : '○'}
                    </span>
                    <span className="flex-1 leading-relaxed">Uppercase and lowercase letters</span>
                  </li>
                  <li className="flex items-start">
                    <span
                      className={`mr-3 mt-0.5 text-lg font-bold ${
                        passwordRequirements.special ? 'text-green-600' : 'text-gray-400'
                      }`}
                    >
                      {passwordRequirements.special ? '✓' : '○'}
                    </span>
                    <span className="flex-1 leading-relaxed">Special characters</span>
                  </li>
                  <li className="flex items-start">
                    <span
                      className={`mr-3 mt-0.5 text-lg font-bold ${
                        passwordRequirements.number ? 'text-green-600' : 'text-gray-400'
                      }`}
                    >
                      {passwordRequirements.number ? '✓' : '○'}
                    </span>
                    <span className="flex-1 leading-relaxed">Numbers</span>
                  </li>
                </ul>
              </div>

              {/* Right Side - Keep in mind that */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Keep in mind that:</h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-start">
                    <span className="mr-2 text-blue-600 mt-0.5">•</span>
                    <span className="leading-relaxed">You will not be able to reuse the last 3 passwords</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2 text-blue-600 mt-0.5">•</span>
                    <span className="leading-relaxed">Your password cannot contain your email address</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2 text-blue-600 mt-0.5">•</span>
                    <span className="leading-relaxed">
                      As a best practice, we recommend that you change your password on a regular
                      basis.
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </form>
    </div>
  );
};

export default ChangePassword;
