import React from 'react';
import {AsyncStorage} from 'react-native';

class StoreData extends React.Component {
  static setUserData = async (key, value) => {
    try {
      await AsyncStorage.setItem(key, value.toString());
    } catch (error) {
      console.log(error);
    }
  }

  static getUserData = async (key) => {
    try {
      const value = await AsyncStorage.getItem(key);
      if (value !== null) {
        return value;
      }
    } catch (error) {
      console.log(error);
    }
  }
}

export default StoreData;