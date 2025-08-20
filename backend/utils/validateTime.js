// utils/validateTime.js
const isValidTime = (time) => {
  if (!time) return false;
  const regex = /^([01]\d|2[0-3]):([0-5]\d)$/; // HH:mm (00:00 - 23:59)
  return regex.test(time);
};

module.exports = { isValidTime };
