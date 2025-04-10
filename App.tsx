import React from 'react';
import { Provider } from 'react-redux';
import PostStore from './src/screens/Home/Global/PostStore'; // Import PostStore
import AppNavigator from './src/navigation/NavigationContainer';

export default function App() {
  return (
    <Provider store={PostStore}>
      <AppNavigator />
    </Provider>
  );
}
