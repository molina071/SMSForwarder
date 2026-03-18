const ReactNative = {
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
  Alert: {
    alert: jest.fn(),
  },
  Button: 'Button',
  FlatList: 'FlatList',
  // Add other RN components as needed
};

module.exports = ReactNative;