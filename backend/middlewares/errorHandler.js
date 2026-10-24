export function errorHandler(err, req, res, next) {
  if (res.headersSent) return next(err);
  let status = Number(err.status) || 500;
  let message = status < 500 || err.expose ? err.message : 'Something went wrong. Please try again.';
  if (err.code === 11000) {
    status = 409;
    message = 'This URL or account already exists. Choose a different one.';
  }
  if (err.code === 'LIMIT_FILE_SIZE') {
    status = 413;
    message = 'Choose an image smaller than 4 MB.';
  }
  if (err.name === 'ValidationError') {
    status = 400;
    message = 'Check the fields and try again.';
  }
  if (status >= 500) console.error('Request failed:', req.method, req.path, err.name);
  res.status(status).set('Cache-Control', 'no-store').json({
    error: message
  });
}
