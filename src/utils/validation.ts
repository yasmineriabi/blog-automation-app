export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function doPasswordsMatch(password: string, confirmPassword: string): boolean {
  return password === confirmPassword;
} 