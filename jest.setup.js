import 'react-native-gesture-handler/jestSetup';
import '@testing-library/jest-native/extend-expect';

// Mock react-native-reanimated
jest.mock('react-native-reanimated', () => {
  const Reanimated = require('react-native-reanimated/mock');
  Reanimated.default.call = () => {};
  return Reanimated;
});

// Mock react-native-mmkv
jest.mock('react-native-mmkv', () => ({
  MMKV: jest.fn(() => ({
    set: jest.fn(),
    getString: jest.fn(),
    getNumber: jest.fn(),
    getBoolean: jest.fn(),
    delete: jest.fn(),
    getAllKeys: jest.fn(() => []),
    clearAll: jest.fn(),
  })),
}));

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);

// Mock Expo modules
jest.mock('expo-constants', () => ({
  default: {
    expoConfig: {
      extra: {
        supabaseUrl: 'http://localhost:54321',
        supabaseAnonKey: 'test-key',
      },
    },
  },
}));

jest.mock('expo-router', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
  }),
  useLocalSearchParams: () => ({}),
  useSegments: () => [],
}));

// Mock Supabase
jest.mock('@supabase/supabase-js', () => ({
  createClient: jest.fn(() => ({
    auth: {
      signUp: jest.fn(),
      signInWithPassword: jest.fn(),
      signOut: jest.fn(),
      getSession: jest.fn(),
      onAuthStateChange: jest.fn(),
    },
    from: jest.fn(() => ({
      select: jest.fn().mockReturnThis(),
      insert: jest.fn().mockReturnThis(),
      update: jest.fn().mockReturnThis(),
      delete: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      order: jest.fn().mockReturnThis(),
      limit: jest.fn().mockReturnThis(),
    })),
  })),
}));

// Mock Charts
jest.mock('react-native-chart-kit', () => ({
  LineChart: 'LineChart',
  BarChart: 'BarChart',
  PieChart: 'PieChart',
}));

jest.mock('victory-native', () => ({
  VictoryChart: 'VictoryChart',
  VictoryLine: 'VictoryLine',
  VictoryBar: 'VictoryBar',
  VictoryArea: 'VictoryArea',
}));

// Mock native modules
jest.mock('react-native/Libraries/EventEmitter/NativeEventEmitter');

// Silence the warning: Animated: `useNativeDriver` is not supported
jest.mock('react-native/Libraries/Animated/NativeAnimatedHelper');

// Mock react-native-svg
jest.mock('react-native-svg', () => {
  const MockSvg = ({ children }) => children;
  return {
    Svg: MockSvg,
    Circle: MockSvg,
    Ellipse: MockSvg,
    G: MockSvg,
    Text: MockSvg,
    TSpan: MockSvg,
    TextPath: MockSvg,
    Path: MockSvg,
    Polygon: MockSvg,
    Polyline: MockSvg,
    Line: MockSvg,
    Rect: MockSvg,
    Use: MockSvg,
    Image: MockSvg,
    Symbol: MockSvg,
    Defs: MockSvg,
    LinearGradient: MockSvg,
    RadialGradient: MockSvg,
    Stop: MockSvg,
    ClipPath: MockSvg,
    Pattern: MockSvg,
    Mask: MockSvg,
  };
});

// Global test utilities
global.mockWorkout = {
  id: 'test-workout-1',
  userId: 'test-user-1',
  name: 'Test Workout',
  date: new Date('2025-01-15'),
  exercises: [],
  totalVolume: 0,
  averageRPE: 7,
  duration: 60,
};

global.mockExercise = {
  id: 'test-exercise-1',
  name: 'Bench Press',
  category: 'chest',
  primaryMuscles: ['pectoralis_major'],
  equipment: ['barbell', 'bench'],
  difficulty: 3,
};

global.mockUser = {
  id: 'test-user-1',
  email: 'test@example.com',
  experienceLevel: 'intermediate',
  goals: { strength: true, hypertrophy: true },
  weightUnit: 'kg',
};

// Clean up after each test
afterEach(() => {
  jest.clearAllMocks();
});