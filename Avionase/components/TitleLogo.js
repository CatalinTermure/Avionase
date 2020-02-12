import React, { Component } from 'react';
import { Image, View } from 'react-native';

class TitleLogo extends Component {
    render() {
      return(
        <View style={this.props.style}>
          <Image source={require('../assets/Logo.png')} style={{ height: '60%', width: '60%' }} resizeMode='stretch' />
        </View>
      );    
    }
}

export { TitleLogo };