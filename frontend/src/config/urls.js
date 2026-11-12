const adminUrl =
  import.meta.env.VITE_ADMIN_URL ||
  (import.meta.env.DEV ? 'http://localhost:5174' : '');

if (!adminUrl) {
  throw new Error('VITE_ADMIN_URL must be configured for production.');
}

export default adminUrl;
