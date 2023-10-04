/**
 * format date string to year.month.day
 * @param {string} dateString
 * @returns {string} year.month.day
 */
export function formatDate(dateString) {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  return `${year}.${month}.${day}`;
}
