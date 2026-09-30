function notFoundHandler(req, res, next) {
  res.status(404).json({
    success: false,
    message: `Resource not found: ${req.method} ${req.originalUrl}`
  });
}

function errorHandler(err, req, res, next) {
  // Always log full error details on the server for debugging
  console.error('[API Error Details]:', {
    method: req.method,
    url: req.originalUrl,
    code: err.code,
    name: err.name,
    message: err.message,
    stack: err.stack
  });

  // 1. Prisma Unique Constraint Violation
  if (err.code === 'P2002') {
    const targets = Array.isArray(err.meta?.target) ? err.meta.target.join(', ') : 'detail';
    return res.status(409).json({
      success: false,
      message: `An account or record with this ${targets} already exists. Please sign in or use different details.`,
      error: 'DuplicateEntry'
    });
  }

  // 2. Prisma Record Not Found
  if (err.code === 'P2025') {
    return res.status(404).json({
      success: false,
      message: 'The requested resource or record was not found.',
      error: 'NotFound'
    });
  }

  // 3. Prisma Foreign Key Constraint
  if (err.code === 'P2003') {
    return res.status(400).json({
      success: false,
      message: 'The operation references an invalid or non-existent related record.',
      error: 'ForeignKeyViolation'
    });
  }

  // 4. Prisma Connection / Unreachable Errors
  if (err.code && /^P10[0-9]{2}$/.test(err.code)) {
    return res.status(503).json({
      success: false,
      message: 'The database server is currently unreachable. Please try again in a few moments.',
      error: 'DatabaseUnavailable'
    });
  }

  // 5. Any other Prisma ORM / Schema / Query Errors
  const isPrismaError = (err.name && err.name.includes('Prisma')) || (err.code && err.code.startsWith('P'));
  if (isPrismaError) {
    return res.status(500).json({
      success: false,
      message: 'A database service operation could not be completed. Please refresh and try again shortly.',
      error: 'DatabaseError'
    });
  }

  // 6. JWT Authentication Errors
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({ success: false, message: 'Invalid authorization token. Please sign in again.' });
  }

  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({ success: false, message: 'Authorization session has expired. Please sign in again.' });
  }

  // 7. Sensitive / SQL technical error leak prevention
  const rawMsg = err.message || '';
  const containsSensitiveKeywords = /prisma|sql|select|insert|update|delete|column|relation|database|secret|password|tokenhash/i.test(rawMsg);

  const statusCode = res.statusCode !== 200 ? res.statusCode : 500;
  const safeMessage = containsSensitiveKeywords
    ? 'An unexpected server error occurred. Please try again in a few moments.'
    : (rawMsg || 'An unexpected internal server error occurred.');

  res.status(statusCode).json({
    success: false,
    message: safeMessage
  });
}

module.exports = { notFoundHandler, errorHandler };
