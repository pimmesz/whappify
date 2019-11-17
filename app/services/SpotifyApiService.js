import React from 'react';
import StoreData from './StoreData';
import AuthService from './AuthService';
import SpotifyWebAPI from 'spotify-web-api-js';

class SpotifyApiService extends React.Component {
  static getValidSPObj = async () => {
    const tokenExpirationTime = await StoreData.getUserData('expirationTime');
    if (new Date().getTime() > tokenExpirationTime) {
        // access token has expired, so we need to use the refresh token
        await AuthService.refreshTokens();
    }
    const accessToken = await StoreData.getUserData('accessToken');
    var sp = new SpotifyWebAPI();
    await sp.setAccessToken(accessToken);
    return sp;
  }

  static getUserPlaylists = async () => {
    const sp = await this.getValidSPObj();
    const { id: userId } = await sp.getMe();
    const { items: playlists } = await sp.getUserPlaylists(userId, { limit: 50 });
    return playlists;
  };
}

export default SpotifyApiService;