import React from 'react';
import { AuthSession } from 'expo'
import { encode as btoa } from 'base-64';
import { REDIRECTURI, CLIENTID, CLIENTSECRET } from 'react-native-dotenv'
import StoreData from './StoreData'

class AuthService extends React.Component {
  static getAuthorizationCode = async () => {
    const scopesArr = ['user-modify-playback-state','user-read-currently-playing','user-read-playback-state','user-library-modify',
                   'user-library-read','playlist-read-private','playlist-read-collaborative','playlist-modify-public',
                   'playlist-modify-private','user-read-recently-played','user-top-read'];
    const scopes = scopesArr.join(' ');

    try {
      const redirectUrl = AuthSession.getRedirectUrl(); //this will be something like https://auth.expo.io/@your-username/your-app-slug
      const result = await AuthSession.startAsync({
        authUrl:
          'https://accounts.spotify.com/authorize' +
          '?response_type=code' +
          '&client_id=' +
          CLIENTID +
          (scopes ? '&scope=' + encodeURIComponent(scopes) : '') +
          '&redirect_uri=' +
          encodeURIComponent(redirectUrl),
      });
      return result.params.code
    } catch (err) {
      console.error(err)
    }
  }

  static getTokens = async () => {
    try {
      const authorizationCode = await this.getAuthorizationCode() //we wrote this function above
      const credsB64 = btoa(`${CLIENTID}:${CLIENTSECRET}`);
      const response = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
          Authorization: `Basic ${credsB64}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `grant_type=authorization_code&code=${authorizationCode}&redirect_uri=${
          REDIRECTURI
        }`,
      });
      const responseJson = await response.json();
      // destructure the response and rename the properties to be in camelCase to satisfy my linter ;)
      const {
        access_token: accessToken,
        refresh_token: refreshToken,
        expires_in: expiresIn,
      } = responseJson;

      
      const expirationTime = new Date().getTime() + expiresIn * 1000;
      await StoreData.setUserData('accessToken', accessToken);
      await StoreData.setUserData('refreshToken', refreshToken);
      await StoreData.setUserData('expirationTime', expirationTime);
    } catch (err) {
      console.error(err);
    }
  }

  static refreshTokens = async () => {
    try {
      const credsB64 = btoa(`${CLIENTID}:${CLIENTSECRET}`);
      const refreshToken = await StoreData.getUserData('refreshToken');
      const response = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
          Authorization: `Basic ${credsB64}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `grant_type=refresh_token&refresh_token=${refreshToken}`,
      });
      const responseJson = await response.json();
      if (responseJson.error) {
        await this.getTokens();
      } else {
        const {
          access_token: newAccessToken,
          refresh_token: newRefreshToken,
          expires_in: expiresIn,
        } = responseJson;
  
        const expirationTime = new Date().getTime() + expiresIn * 1000;
        await StoreData.setUserData('accessToken', newAccessToken);
        if (newRefreshToken) {
          await StoreData.setUserData('refreshToken', newRefreshToken);
        }
        await StoreData.setUserData('expirationTime', expirationTime);
      }
    } catch (err) {
      console.error(err)
    }
  }
}

export default AuthService;