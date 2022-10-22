import React, { Component } from 'react';
import { TouchableOpacity, StyleSheet, Text, View, Image } from 'react-native';
import { AuthSession } from 'expo';
import { FontAwesome } from '@expo/vector-icons';
import axios from 'axios';

const CLIENT_ID = 'd687d90c2c94457bbe94714a1f148a9b';

export default class App extends Component {
  state = {
    userInfo: null,
    didError: false
  };

  handleSpotifyLogin = async () => {
    let redirectUrl = AuthSession.makeRedirectUri({
      path: 'redirect',
      useProxy: true,
    });
    let results = await AuthSession.startAsync({
      authUrl: `https://accounts.spotify.com/authorize?client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(redirectUrl)}&scope=user-read-email&response_type=token`
    });
    try{
      const userInfo = await axios.get(`https://api.spotify.com/v1/me`, {
        headers: {
          "Authorization": `Bearer ${results.params.access_token}`
      }
      });
      this.setState({ userInfo: userInfo.data });
    }
    catch ( error ) {
      console.log(results.type);
      this.setState({ didError: true });
    }
  };


  displayError = () => {
    return (
      <View style={styles.userInfo}>
        <Text style={styles.errorText}>
          There was an error, please try again.
        </Text>
      </View>
    );
  }

  displayResults = () => {
    { return this.state.userInfo ? (
      <View style={styles.userInfo}>
        <Image
          style={styles.profileImage}
          source={ this.state.userInfo.images[0] ? {'uri': this.state.userInfo.images[0].url } : null }

        />
        <View>
          <Text style={styles.userInfoText}>
            Username:
          </Text>
          <Text style={styles.userInfoText}>
            {this.state.userInfo.id}
          </Text>
          <Text style={styles.userInfoText}>
            Email:
          </Text>
          <Text style={styles.userInfoText}>
            {this.state.userInfo.email}
          </Text>
        </View>
      </View>
    ) : (
      <View style={styles.userInfo}>
        <Text style={styles.userInfoText}>
          Login to Spotify to see user data.
        </Text>
      </View>
    )}
  }

  render() {
    return (
      <View style={styles.container}>
        <FontAwesome
          name="spotify"
          color="#2FD566"
          size={128}
        />
        <TouchableOpacity
          style={styles.button}
          onPress={this.handleSpotifyLogin}
          disabled={this.state.userInfo ? true : false}
        >
          <Text style={styles.buttonText}>
            Login with Spotify
          </Text>
        </TouchableOpacity>
        {this.state.didError ?
          this.displayError() :
          this.displayResults()
        }
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    backgroundColor: '#000',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-evenly',
  },
  button: {
    backgroundColor: '#2FD566',
    padding: 20
  },
  buttonText: {
    color: '#000',
    fontSize: 20
  },
  userInfo: {
    height: 250,
    width: 200,
    alignItems: 'center',
  },
  userInfoText: {
    color: '#fff',
    fontSize: 18
  },
  errorText: {
    color: '#fff',
    fontSize: 18
  },
  profileImage: {
    height: 64,
    width: 64,
    marginBottom: 32
  }
});