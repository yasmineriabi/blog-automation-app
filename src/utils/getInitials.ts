import useAuthStore from '@/store/auth';

/**
 * Gets initials from the current logged-in user
 * @returns A string containing the user's initials with role
 */
export function getCurrentUserInitials(): string {
  const { user } = useAuthStore.getState();
  
  if (!user) return '';
  
  // Extract initials from username (first letter of each word)
  const usernameInitials = user.username
    .split(' ')
    .map(word => word.charAt(0).toUpperCase())
    .join('');
  
  // Add the first letter of the role
  const roleInitial = user.role.charAt(0).toUpperCase();
  return `${usernameInitials}${roleInitial}`;
}

/**
 * Extracts initials from a username and role (for manual use)
 * @param username - The user's username
 * @param role - The user's role (optional)
 * @returns A string containing the initials
 */
export function getInitials(username: string, role?: string): string {
  if (!username) return '';
  
  // Extract initials from username (first letter of each word)
  const usernameInitials = username
    .split(' ')
    .map(word => word.charAt(0).toUpperCase())
    .join('');
  
  // If role is provided, add the first letter of the role
  if (role) {
    const roleInitial = role.charAt(0).toUpperCase();
    return `${usernameInitials}${roleInitial}`;
  }
  
  return usernameInitials;
}

/**
 * Alternative function that takes a full name and extracts initials
 * @param fullName - The user's full name
 * @param role - The user's role (optional)
 * @returns A string containing the initials
 */
export function getInitialsFromName(fullName: string, role?: string): string {
  if (!fullName) return '';
  
  // Extract initials from full name (first letter of each word)
  const nameInitials = fullName
    .split(' ')
    .map(word => word.charAt(0).toUpperCase())
    .join('');
  
  // If role is provided, add the first letter of the role
  if (role) {
    const roleInitial = role.charAt(0).toUpperCase();
    return `${nameInitials}${roleInitial}`;
  }
  
  return nameInitials;
}

/**
 * Get initials for display in avatar/profile components
 * @param username - The user's username
 * @param role - The user's role (optional)
 * @param maxLength - Maximum length of initials (default: 2)
 * @returns A string containing the initials, limited to maxLength
 */
export function getDisplayInitials(username: string, role?: string, maxLength: number = 2): string {
  const initials = getInitials(username, role);
  return initials.slice(0, maxLength);
}

/**
 * Get display initials for the current logged-in user
 * @param maxLength - Maximum length of initials (default: 2)
 * @returns A string containing the user's initials, limited to maxLength
 */
export function getCurrentUserDisplayInitials(maxLength: number = 2): string {
  const initials = getCurrentUserInitials();
  return initials.slice(0, maxLength);
}
