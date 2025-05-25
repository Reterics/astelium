/**
 * Utility functions for form validation
 */

/**
 * Validates an email address
 * @param email - The email address to validate
 * @returns An object with isValid and message properties
 */
export const validateEmail = (
  email: string
): {isValid: boolean; message: string} => {
  if (!email || email.trim() === '') {
    return {isValid: false, message: 'Email is required'};
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return {isValid: false, message: 'Please enter a valid email address'};
  }

  return {isValid: true, message: ''};
};

/**
 * Validates a phone number
 * @param phone - The phone number to validate
 * @returns An object with isValid and message properties
 */
export const validatePhone = (
  phone: string
): {isValid: boolean; message: string} => {
  if (!phone || phone.trim() === '') {
    return {isValid: true, message: ''}; // Phone is optional
  }

  // Allow digits, spaces, parentheses, dashes, and plus sign
  const phoneRegex =
    /^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,4}[-\s.]?[0-9]{1,9}$/;
  if (!phoneRegex.test(phone)) {
    return {isValid: false, message: 'Please enter a valid phone number'};
  }

  return {isValid: true, message: ''};
};

/**
 * Validates a name
 * @param name - The name to validate
 * @returns An object with isValid and message properties
 */
export const validateName = (
  name: string
): {isValid: boolean; message: string} => {
  if (!name || name.trim() === '') {
    return {isValid: false, message: 'Name is required'};
  }

  if (name.trim().length < 2) {
    return {isValid: false, message: 'Name must be at least 2 characters'};
  }

  return {isValid: true, message: ''};
};
