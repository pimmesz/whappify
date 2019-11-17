import React from 'react';
import { 
  StyleSheet, 
  View
} from 'react-native';

import Start from './app/components/Start';

export default function App() {
  return (
    <View style={styles.container}>
      <Start />
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
