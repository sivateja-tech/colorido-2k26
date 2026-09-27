function isValidEmail(email) {
  if (!email || typeof email !== 'string') return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

function isValidPhone(phone) {
  if (!phone || typeof phone !== 'string') return false;
  const cleaned = phone.replace(/[\s\-()]/g, '');
  return /^[+]?[0-9]{10,13}$/.test(cleaned);
}

function validateRegistration(body) {
  const errors = [];
  const { fullName, email, phone, college, department, year, eventId, participantType, teamName } = body;

  if (!fullName || typeof fullName !== 'string' || fullName.trim().length < 2) errors.push('Full Name must be at least 2 characters.');
  if (!isValidEmail(email)) errors.push('A valid email address is required.');
  if (!isValidPhone(phone)) errors.push('A valid 10-digit phone number is required.');
  if (!college || typeof college !== 'string' || college.trim().length < 2) errors.push('College name is required.');
  if (!department || typeof department !== 'string') errors.push('Department is required.');
  if (!year || typeof year !== 'string') errors.push('Year of study is required.');
  if (!eventId || typeof eventId !== 'string') errors.push('Event selection is required.');
  if (participantType === 'TEAM' && (!teamName || teamName.trim().length < 2)) errors.push('Team Name is required for team registrations.');

  return { isValid: errors.length === 0, errors };
}

function validateContact(body) {
  const errors = [];
  const { name, email, subject, message } = body;
  if (!name || name.trim().length < 2) errors.push('Name is required.');
  if (!isValidEmail(email)) errors.push('A valid email address is required.');
  if (!subject || subject.trim().length < 3) errors.push('Subject is required.');
  if (!message || message.trim().length < 10) errors.push('Message must be at least 10 characters.');
  return { isValid: errors.length === 0, errors };
}

function validateAdminLogin(body) {
  const errors = [];
  const { email, password } = body;
  if (!isValidEmail(email)) errors.push('Valid admin email is required.');
  if (!password || typeof password !== 'string') errors.push('Password is required.');
  return { isValid: errors.length === 0, errors };
}

function validateEvent(body) {
  const errors = [];
  const { title, category, type, shortDescription, fullDescription, venue, demoDate, demoTime } = body;
  if (!title || title.trim().length < 2) errors.push('Event title is required.');
  if (!category || !['SPORTS', 'CULTURAL'].includes(category.toUpperCase())) errors.push('Category must be SPORTS or CULTURAL.');
  if (!type || type.trim().length < 2) errors.push('Event type is required.');
  if (!shortDescription) errors.push('Short description is required.');
  if (!fullDescription) errors.push('Full description is required.');
  if (!venue) errors.push('Venue is required.');
  if (!demoDate) errors.push('Demo date is required.');
  if (!demoTime) errors.push('Demo time is required.');
  return { isValid: errors.length === 0, errors };
}

module.exports = { isValidEmail, isValidPhone, validateRegistration, validateContact, validateAdminLogin, validateEvent };
