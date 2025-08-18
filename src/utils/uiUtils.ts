/**
 * UI-related utility functions
 */

/**
 * Creates a click outside handler for dropdowns and modals
 * @param ref - React ref to the element
 * @param callback - Function to call when clicking outside
 * @returns Event listener function
 */
export const createClickOutsideHandler = (
  ref: React.RefObject<HTMLElement | null>,
  callback: () => void
) => {
  return (event: MouseEvent) => {
    if (ref.current && !ref.current.contains(event.target as Node)) {
      callback();
    }
  };
};

/**
 * Adds click outside event listener to document
 * @param handler - The click outside handler function
 * @returns Cleanup function to remove the event listener
 */
export const addClickOutsideListener = (handler: (event: MouseEvent) => void) => {
  document.addEventListener("mousedown", handler);
  return () => document.removeEventListener("mousedown", handler);
};

/**
 * Checks if a user has admin privileges
 * @param role - User role string
 * @returns Boolean indicating if user is admin
 */
export const isAdmin = (role: string): boolean => {
  return role === "admin" || role === "super-admin";
};

/**
 * Scrolls to top of page with smooth animation
 */
export const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
}; 