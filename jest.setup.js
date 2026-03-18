import { jest } from '@jest/globals';

// Mock react-native modules that cause issues
jest.mock('react-native', () => ({
  Platform: {
    OS: 'android',
    select: jest.fn(),
  },
  NativeModules: {},
  requireNativeComponent: jest.fn(),
  StyleSheet: {
    create: (styles) => styles,
  },
  View: 'View',
  Text: 'Text',
  TouchableOpacity: 'TouchableOpacity',
  TextInput: 'TextInput',
  ScrollView: 'ScrollView',
  Switch: 'Switch',
  Button: 'Button',
  FlatList: 'FlatList',
  Alert: {
    alert: jest.fn(),
  },
}));

jest.mock('react-native-background-actions', () => ({
  start: jest.fn(),
  stop: jest.fn(),
  isRunning: jest.fn(() => false),
}));

jest.mock('react-native-android-sms-listener', () => ({
  addListener: jest.fn(() => ({ remove: jest.fn() })),
}));

jest.mock('react-native-permissions', () => ({
  request: jest.fn(() => Promise.resolve('granted')),
  PERMISSIONS: {
    ANDROID: {
      RECEIVE_SMS: 'android.permission.RECEIVE_SMS',
    },
  },
  RESULTS: {
    GRANTED: 'granted',
  },
}));

jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
}));

jest.mock('@react-navigation/native', () => ({
  NavigationContainer: ({ children }) => children,
  useNavigation: () => ({}),
  useRoute: () => ({}),
}));

jest.mock('@react-navigation/stack', () => ({
  createStackNavigator: () => ({
    Navigator: ({ children }) => children,
    Screen: ({ component }) => component,
  }),
}));