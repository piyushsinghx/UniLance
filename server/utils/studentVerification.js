const isAcademicEmail = (email = '') => {
  const normalized = email.trim().toLowerCase();

  if (!normalized) {
    return false;
  }

  return (
    normalized.endsWith('.edu') ||
    normalized.endsWith('.edu.in') ||
    normalized.endsWith('.ac.in') ||
    /\.ac\.[a-z]{2,}$/i.test(normalized)
  );
};

module.exports = { isAcademicEmail };
