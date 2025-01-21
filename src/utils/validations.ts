// Validation for file type and size
export const validateFile = (file: File | null): string => {
  if (!file) {
    return "Please select a file to upload";
  }

  if (file.size > 1 * 1024 * 1024) {
    return "File size should be less than 1 MB";
  }

  const validTypes = ["text/csv"];
  if (!validTypes.includes(file.type)) {
    return "Only CSV files are allowed";
  }

  return "";
};
