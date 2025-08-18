/**
 * Blog-related utility functions
 */

/**
 * Generates a content preview from the first sentence of blog content
 * @param content - The full blog content
 * @returns A truncated preview of the content
 */
export const getContentPreview = (content: string): string => {
  const firstSentence = content.split(".")[0];
  return firstSentence.length > 100 ? firstSentence.substring(0, 100) + "..." : firstSentence + "...";
};

/**
 * Formats a date string or MongoDB date object into a readable format
 * @param dateString - Date string or MongoDB date object
 * @returns Formatted date string
 */
export const formatDate = (dateString: string | { $date: string } | null | undefined): string => {
  try {
    // Handle different date formats that might come from the backend
    let date;
    
    if (typeof dateString === 'string') {
      // If it's already a valid date string, use it directly
      date = new Date(dateString);
    } else if (dateString && typeof dateString === 'object' && '$date' in dateString) {
      // Handle MongoDB date format
      date = new Date(dateString.$date);
    } else {
      // Fallback to current date if invalid
      date = new Date();
    }
    
    // Check if the date is valid
    if (isNaN(date.getTime())) {
      return 'Date not available';
    }
    
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch (error) {
    console.error('Error formatting date:', error, 'Date string:', dateString);
    return 'Date not available';
  }
};

/**
 * Generates a consistent color scheme for domain badges based on domain name
 * @param domain - The domain name
 * @returns Object containing background, text, and shadow color classes
 */
export const getDomainColor = (domain: string) => {
  // Array of pastel gradient color schemes - Blue, Green, Violet palette
  const colorSchemes = [
    { bg: "bg-gradient-to-r from-blue-200 to-blue-300", text: "text-blue-800", shadow: "shadow-blue-200/30" },
    { bg: "bg-gradient-to-r from-blue-100 to-blue-200", text: "text-blue-700", shadow: "shadow-blue-100/30" },
    { bg: "bg-gradient-to-r from-sky-200 to-sky-300", text: "text-sky-800", shadow: "shadow-sky-200/30" },
    { bg: "bg-gradient-to-r from-cyan-200 to-cyan-300", text: "text-cyan-800", shadow: "shadow-cyan-200/30" },
    { bg: "bg-gradient-to-r from-teal-200 to-teal-300", text: "text-teal-800", shadow: "shadow-teal-200/30" },
    { bg: "bg-gradient-to-r from-emerald-200 to-emerald-300", text: "text-emerald-800", shadow: "shadow-emerald-200/30" },
    { bg: "bg-gradient-to-r from-green-200 to-green-300", text: "text-green-800", shadow: "shadow-green-200/30" },
    { bg: "bg-gradient-to-r from-lime-200 to-lime-300", text: "text-lime-800", shadow: "shadow-lime-200/30" },
    { bg: "bg-gradient-to-r from-indigo-200 to-indigo-300", text: "text-indigo-800", shadow: "shadow-indigo-200/30" },
    { bg: "bg-gradient-to-r from-violet-200 to-violet-300", text: "text-violet-800", shadow: "shadow-violet-200/30" },
    { bg: "bg-gradient-to-r from-purple-200 to-purple-300", text: "text-purple-800", shadow: "shadow-purple-200/30" },
    { bg: "bg-gradient-to-r from-fuchsia-200 to-fuchsia-300", text: "text-fuchsia-800", shadow: "shadow-fuchsia-200/30" },
    { bg: "bg-gradient-to-r from-blue-100 to-cyan-200", text: "text-blue-700", shadow: "shadow-blue-100/30" },
    { bg: "bg-gradient-to-r from-emerald-100 to-teal-200", text: "text-emerald-700", shadow: "shadow-emerald-100/30" },
    { bg: "bg-gradient-to-r from-violet-100 to-purple-200", text: "text-violet-700", shadow: "shadow-violet-100/30" },
    { bg: "bg-gradient-to-r from-cyan-100 to-blue-200", text: "text-cyan-700", shadow: "shadow-cyan-100/30" },
  ];

  // Generate a consistent hash from the domain name
  let hash = 0;
  for (let i = 0; i < domain.length; i++) {
    const char = domain.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }

  // Use the hash to select a color scheme
  const colorIndex = Math.abs(hash) % colorSchemes.length;
  return colorSchemes[colorIndex];
};

/**
 * Extracts unique domains from a list of blogs (case-insensitive)
 * @param blogs - Array of blog objects
 * @returns Array of unique domain names with original case preserved
 */
export const getUniqueDomains = (blogs: Array<{ domain: string }>): string[] => {
  // Create a map to store the first occurrence of each domain (preserving original case)
  const domainMap = new Map<string, string>();
  blogs.forEach(blog => {
    const lowerDomain = blog.domain.toLowerCase();
    if (!domainMap.has(lowerDomain)) {
      domainMap.set(lowerDomain, blog.domain); // Store original case
    }
  });
  
  return Array.from(domainMap.values()).sort();
}; 