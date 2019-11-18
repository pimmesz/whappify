import React from 'react';
import { 
  StyleSheet, 
  Text, 
  View,
  Button
} from 'react-native';

import { Linking } from 'expo';

import AuthService from '../services/AuthService';
import SpotifyApiService from '../services/SpotifyApiService';
import StoreData from '../services/StoreData';

const styles = StyleSheet.create({
    wrapper: {
      flex: 1,
      backgroundColor: '#FFFCFB',
      display: 'flex',
      justifyContent: 'center', 
      alignItems: 'center'
    },
    headerImageWrapper: {
      position: 'absolute',
    },
    headerImage: {
      height: 278,
    },
    discoverHeader: {
      marginBottom: 160,
    },
  });


class Start extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      accessTokenAvailable: null,
    };
  }

  startLogin = async () => {
    const tokenExpirationTime = await StoreData.getUserData('expirationTime');
    if (!tokenExpirationTime || new Date().getTime() > tokenExpirationTime) {
      await AuthService.refreshTokens();
    } else {
      this.setState({ accessTokenAvailable: true });
    }

    const spotify = await SpotifyApiService.getUserPlaylists();
  }

  openWhatsapp = async () => {
    let url = 'https://api.whatsapp.com/app';
    // let url = 'whatsapp://send?phone=3464478983';
    Linking.openURL(url).then((data) => {
      console.log('WhatsApp Opened');
    }).catch((err) => {
      console.log(err);
      alert('Make sure Whatsapp installed on your device');
    });
  }

  render() {
    return (
      <View style={styles.wrapper}>
        <Button 
          title="Press me"
          onPress={() => this.startLogin()} 
        />
        <Button 
          title="Whatsapp"
          onPress={ this.openWhatsapp} 
        />
      </View>
    );
  }
};

export default Start;
