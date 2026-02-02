/**
 * ============================================================================
 * APPLICATION COLOR CONFIGURATION
 * ============================================================================
 * 
 * This file contains all color constants used throughout the application.
 * This centralized approach makes it easy to maintain consistent colors
 * and update them globally when needed.
 * 
 * 📝 HOW TO USE:
 * 
 *   1. Import the colors:
 *      import { appColors } from 'config/appColors';
 * 
 *   2. Use in inline styles:
 *      style={{ backgroundColor: appColors.header.background }}
 * 
 *   3. Use in className (with Tailwind):
 *      className="text-white" // Use Tailwind classes when possible
 *      style={{ color: appColors.text.primary }} // Use appColors for dynamic colors
 * 
 * 🎨 HOW TO CHANGE COLORS:
 * 
 *   Simply update the values below. Changes will apply across all pages
 *   that use these color constants.
 * 
 *   Example: To change the primary blue color everywhere:
 *     primary: { main: '#YOUR_NEW_COLOR' }
 * 
 * 📋 COLOR ORGANIZATION:
 * 
 *   - primary: Main brand colors (matches sidebar)
 *   - header: Header section colors
 *   - tabs: Tab navigation colors
 *   - links: Link colors with hover states
 *   - text: Text colors for readability
 *   - status: Status indicator colors (success, error, etc.)
 *   - background: Background colors for different sections
 *   - border: Border colors
 * 
 * ============================================================================
 */

/**
 * Application Color Palette
 * All colors used throughout the application
 */
export const appColors = {
  /**
   * Primary Brand Colors
   * These match the sidebar color scheme for consistency
   */
  primary: {
    main: '#265EAC',           // Main brand blue - matches sidebar
    hover: '#1e4a87',          // Darker blue for hover/interactive states
    light: '#3d7bc4',          // Lighter blue for subtle accents
    dark: '#1a4a7a',           // Darkest blue for contrast
  },

  /**
   * Header Section Colors
   * Used for section headers, card headers, etc.
   */
  header: {
    background: '#265EAC',      // Header background (matches primary.main)
    text: '#FFFFFF',            // Header text color (white for contrast)
    subtitle: '#E5E7EB',        // Subtitle text color (light gray)
  },

  /**
   * Tab Navigation Colors
   * Used for tab navigation components
   */
  tabs: {
    active: '#265EAC',          // Active tab color
    inactive: '#6B7280',         // Inactive tab color (gray-500)
    border: '#265EAC',          // Active tab border/underline color
    hover: '#265EAC',           // Tab hover color
    background: '#FFFFFF',       // Tab background
  },

  /**
   * Link Colors
   * Used for all links and clickable text
   */
  links: {
    default: '#265EAC',         // Default link color
    hover: '#1e4a87',           // Link hover color (darker)
    visited: '#265EAC',         // Visited link color
    active: '#1a4a7a',          // Active link color
  },

  /**
   * Text Colors
   * Ensures good readability and contrast
   */
  text: {
    primary: '#1F2937',         // Primary text (gray-800) - high contrast for main content
    secondary: '#4B5563',       // Secondary text (gray-600) - for less important content
    label: '#374151',           // Label text (gray-700) - for form labels
    muted: '#9CA3AF',           // Muted text (gray-400) - for hints/placeholders
    disabled: '#D1D5DB',        // Disabled text (gray-300) - for disabled elements
    inverse: '#FFFFFF',         // Inverse text (white) - for dark backgrounds
  },

  /**
   * Status Colors
   * Used for status indicators, badges, alerts
   */
  status: {
    success: '#10B981',         // Success/Green - for positive states (e.g., "Renewed", "Active")
    warning: '#F59E0B',         // Warning/Orange - for caution states
    error: '#EF4444',           // Error/Red - for error states
    info: '#265EAC',            // Info/Blue - for informational states (matches primary)
  },

  /**
   * Background Colors
   * Used for different sections and containers
   */
  background: {
    page: '#FFFFFF',            // Page background (white)
    card: '#FFFFFF',            // Card background (white)
    section: '#F9FAFB',         // Section background (gray-50) - for subtle sections
    sidebar: '#265EAC',         // Sidebar background (matches primary)
    overlay: 'rgba(0, 0, 0, 0.5)', // Overlay background for modals
  },

  /**
   * Border Colors
   * Used for borders and dividers
   */
  border: {
    default: '#E5E7EB',         // Default border (gray-200)
    light: '#F3F4F6',           // Light border (gray-100) - subtle borders
    dark: '#D1D5DB',            // Dark border (gray-300) - stronger borders
    focus: '#265EAC',           // Focus border (primary color) - for focused inputs
  },
} as const;

/**
 * Helper function to get color value by path
 * 
 * @param path - Dot-separated path to color (e.g., 'primary.main', 'header.background')
 * @returns Color value as string
 * 
 * @example
 *   getAppColor('primary.main') // Returns '#265EAC'
 *   getAppColor('text.primary') // Returns '#1F2937'
 */
export const getAppColor = (path: string): string => {
  const keys = path.split('.');
  let value: any = appColors;
  
  for (const key of keys) {
    value = value[key];
    if (value === undefined) {
      console.warn(`[appColors] Color path "${path}" not found. Using fallback color.`);
      return appColors.primary.main; // Fallback to primary color
    }
  }
  
  return value;
};

/**
 * Legacy export for backward compatibility
 * @deprecated Use appColors instead
 */
export const membershipColors = appColors;

/**
 * Legacy helper function for backward compatibility
 * @deprecated Use getAppColor instead
 */
export const getMembershipColor = getAppColor;

export default appColors;
