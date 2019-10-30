import React from 'react';
import { 
  StyleSheet, 
  Text, 
  View,
  Button
} from 'react-native';

import AuthService from './app/services/AuthService';

// TODO
// 1) Implement code below

// async componentDidMount() {
//   const tokenExpirationTime = await getUserData('expirationTime');
//   if (!tokenExpirationTime || new Date().getTime() > tokenExpirationTime) {
//     await refreshTokens();
//   } else {
//     this.setState({ accessTokenAvailable: true });
//   }
// }

export default function App() {
  return (
    <View style={styles.container}>
      <Text>Open up App.js xx to start working on your app!</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
