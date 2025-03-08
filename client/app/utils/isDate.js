export default function hasDatePassed(dateString) {
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Reset time for accurate comparison

  // Define regex for supported formats (YYYY-MM-DD, DD/MM/YYYY, MM/DD/YYYY) with separators "-", "/", "."
  const datePatterns = [
    /^(\d{4})[-/.](\d{2})[-/.](\d{2})$/, // YYYY-MM-DD
    /^(\d{2})[-/.](\d{2})[-/.](\d{4})$/, // DD/MM/YYYY or MM/DD/YYYY (handled later)
  ];

  let inputDate = null;

  for (const pattern of datePatterns) {
    const match = dateString.match(pattern);
    if (match) {
      if (match.length === 4) {
        if (pattern === datePatterns[0]) {
          // Format: YYYY-MM-DD
          inputDate = new Date(`${match[1]}-${match[2]}-${match[3]}`);
        } else {
          // Format: DD/MM/YYYY or MM/DD/YYYY (ambiguity)
          const day = parseInt(match[1], 10);
          const month = parseInt(match[2], 10);
          const year = parseInt(match[3], 10);

          // If the day is greater than 12, it's definitely DD/MM/YYYY
          if (day > 12) {
            inputDate = new Date(`${year}-${month}-${day}`);
          } else {
            // Otherwise, we assume MM/DD/YYYY (default US format)
            inputDate = new Date(`${year}-${day}-${month}`);
          }
        }
      }
      break; // Stop checking once a valid format is found
    }
  }

  if (!inputDate || isNaN(inputDate.getTime())) {
    return false; // Invalid date format
  }

  inputDate.setHours(0, 0, 0, 0); // Reset time for accurate comparison
  return inputDate < today; // Returns true if date has passed
}
