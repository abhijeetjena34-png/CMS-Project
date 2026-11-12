const publicUrl =
  import.meta.env.VITE_PUBLIC_URL ||
  (import.meta.env.DEV ? 'http://localhost:5173' : '');

if (!publicUrl) {
  throw new Error('VITE_PUBLIC_URL must be configured for production.');
}

export default publicUrl;
