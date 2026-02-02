/**
 * Validates a file for allowed types and maximum size.
 * Rules:
 * - Max Size: 5MB
 * - Allowed Types: .jpg, .jpeg, .png, .pdf
 *
 * @param {File} file - The file object to validate.
 * @returns {{ isValid: boolean, error: string | null }} - Validation result.
 */
export const validateFile = (file, maxSizeMB = 5) => {
  if (!file) {
    return { isValid: false, error: "No file selected." };
  }

  const MAX_SIZE_BYTES = maxSizeMB * 1024 * 1024;
  const ALLOWED_TYPES = [
    "image/jpeg",
    "image/png",
    "application/pdf",
    "image/jpg", // Some browsers might use this generic type, though usually covered by jpeg
  ];

  // Extension check as a fallback/secondary check
  const ALLOWED_EXTENSIONS = ["jpg", "jpeg", "png", "pdf"];
  const fileExtension = file.name.split(".").pop().toLowerCase();

  // 1. Check File Size
  if (file.size > MAX_SIZE_BYTES) {
    return {
      isValid: false,
      error: `File size exceeds ${maxSizeMB}MB limit.`,
    };
  }

  // 2. Check File Type (MIME type + Extension)
  if (
    !ALLOWED_TYPES.includes(file.type) &&
    !ALLOWED_EXTENSIONS.includes(fileExtension)
  ) {
    return {
      isValid: false,
      error: "Invalid file type. Only .jpg, .jpeg, .png, and .pdf are allowed.",
    };
  }

  return { isValid: true, error: null };
};
