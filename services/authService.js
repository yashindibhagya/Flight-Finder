/**
 * UI-only build: Authentication APIs are not available.
 * These exports are placeholders to avoid import errors if referenced.
 */

/**
 * Register a new user
 * @param {string} email - User email
 * @param {string} password - User password
 * @param {string} name - User's full name
 * @returns {Promise<Object>} User object
 */
export const registerUser = async () => {
  throw new Error("Auth is disabled in UI-only build");
};

/**
 * Sign in an existing user
 * @param {string} email - User email
 * @param {string} password - User password
 * @returns {Promise<Object>} User object
 */
export const loginUser = async () => {
  throw new Error("Auth is disabled in UI-only build");
};

/**
 * Sign out the current user
 * @returns {Promise<void>}
 */
export const logoutUser = async () => { };

/**
 * Update user profile
 * @param {Object} user - Firebase user object
 * @param {Object} profileData - Profile data to update
 * @returns {Promise<void>}
 */
export const updateUserProfile = async () => { };

/**
 * Update user password
 * @param {Object} user - Firebase user object
 * @param {string} newPassword - New password
 * @returns {Promise<void>}
 */
export const changePassword = async () => { };

/**
 * Send password reset email
 * @param {string} email - User email
 * @returns {Promise<void>}
 */
export const resetPassword = async () => { };

/**
 * Get user details from Firestore
 * @param {string} uid - User ID
 * @returns {Promise<Object|null>} User details or null if not found
 */
export const getUserDetails = async () => null;

/**
 * Listen for authentication state changes
 * @param {Function} callback - Callback function that receives the user object
 * @returns {Function} Unsubscribe function
 */
export const onAuthStateChange = () => () => { };

export default {
  registerUser,
  loginUser,
  logoutUser,
  updateUserProfile,
  changePassword,
  resetPassword,
  getUserDetails,
  onAuthStateChange
};