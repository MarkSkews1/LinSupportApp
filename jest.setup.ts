import '@testing-library/jest-dom';

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter() {
    return {
      push: jest.fn(),
      replace: jest.fn(),
      prefetch: jest.fn(),
      back: jest.fn(),
      pathname: '/',
      query: {},
      asPath: '/',
    };
  },
  useSearchParams() {
    return {
      get: jest.fn(),
    };
  },
  usePathname() {
    return '/';
  },
  useParams() {
    return {};
  },
}));

// Mock environment variables
process.env.MONGODB_URI = 'mongodb://localhost:27017/test';
process.env.KINDE_CLIENT_ID = 'test-client-id';
process.env.KINDE_CLIENT_SECRET = 'test-client-secret';
process.env.KINDE_ISSUER_URL = 'https://test.kinde.com';

