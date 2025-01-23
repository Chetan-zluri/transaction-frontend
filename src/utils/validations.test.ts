import { validateFile } from "./validations";

describe("validateFile", () => {
  it("should return an error message when no file is selected", () => {
    const result = validateFile(null);
    expect(result).toBe("Please select a file to upload");
  });

  it("should return an error message when the file is empty", () => {
    const emptyFile = new File([], "empty.csv", { type: "text/csv" });
    const result = validateFile(emptyFile);
    expect(result).toBe("Error uploading file: File is empty");
  });

  it("should return an error message when the file size is greater than 1 MB", () => {
    const largeFile = new File(["a".repeat(1.5 * 1024 * 1024)], "large.csv", {
      type: "text/csv",
    });
    const result = validateFile(largeFile);
    expect(result).toBe("File size should be less than 1 MB");
  });

  it("should return an error message when the file type is not CSV", () => {
    const invalidTypeFile = new File(["content"], "invalid.txt", {
      type: "text/plain",
    });
    const result = validateFile(invalidTypeFile);
    expect(result).toBe("Only CSV files are allowed");
  });

  it("should return an empty string when the file is valid", () => {
    const validFile = new File(["content"], "valid.csv", { type: "text/csv" });
    const result = validateFile(validFile);
    expect(result).toBe("");
  });
});
