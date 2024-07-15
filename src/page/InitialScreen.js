import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View, Dimensions, TouchableOpacity, Image, Platform } from 'react-native';

const Initial = ({ navigation }) => {
  const { width, height } = Dimensions.get('window');

  return (
    <View style={[styles.container, { width, height }]}>
      <Text style={styles.logo}>勇者を育てる会</Text>
      <View style={styles.headerContainer}>
        <Text style={styles.header}>曼荼羅クエスト</Text>
        <Text style={styles.headerSubInline}>へ</Text>
      </View>
      <Text style={styles.headerSub}>ようこそ！</Text>
      <Image
        style={styles.image}
        source={require('../../assets/cat.png')}
      />
      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={[styles.registerButton, { width: width * 0.8 }]} 
          onPress={() => navigation.navigate('AuthScreen', { isLogin: false })}
        >
          <Text style={styles.buttonText}>登録</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.loginButton]} 
          onPress={() => navigation.navigate('AuthScreen', { isLogin: true })}
        >
          <Text style={styles.loginButtonText}>ログインはこちら</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

// Define styles using StyleSheet
const styles = StyleSheet.create({
  container: {
    backgroundColor: '#2CB3AD', // Updated background color
    justifyContent: 'flex-start', 
    alignItems: 'flex-start', 
    paddingTop: '10%', // Increased padding to move content down
    paddingHorizontal: 20, 
  },
  logo: {
    fontSize: 18,
    fontWeight: '300', // Light font weight
    fontFamily: 'Helvetica',
    textAlign: 'center', // Center the logo text
    color: 'white', // Change text color to white
    alignSelf: 'center', // Center horizontally
    marginBottom: 10, // Added margin between logo and header
  },
  headerContainer: {
    flexDirection: 'row', // Allows inline placement of header and sub-header
    alignItems: 'flex-end', // Aligns text to the bottom
    marginBottom: 5, // Reduced margin between header and sub-header
  },
  header: {
    fontSize: 38,
    fontWeight: 'bold',
    fontFamily: 'Helvetica',
    textAlign: 'left',
    color: 'white', // Change text color to white
  },
  headerSubInline: {
    fontSize: 30,
    fontWeight: 'bold',
    fontFamily: 'Helvetica',
    textAlign: 'left',
    color: 'white', // Change text color to white
    paddingBottom: 3, // Aligns the text with the header
  },
  headerSub: {
    fontSize: 30,
    fontWeight: 'bold',
    fontFamily: 'Helvetica',
    textAlign: 'left',
    color: 'white', // Change text color to white
    marginTop: 10, // Added margin between headerSub and headerContainer
  },
  image: {
    width: '100%',
    height: undefined,
    aspectRatio: 1,
    marginTop: 20,
  },
  buttonContainer: {
    marginTop: 20,
    alignItems: 'center',
    alignSelf: 'center',
  },
  registerButton: {
    backgroundColor: '#522357', // Updated button color
    paddingVertical: 15,
    borderRadius: 24, // Increased roundness
    marginBottom: 10,
    alignItems: 'center',
    
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOpacity: 0.5,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  loginButton: {
    paddingVertical: 15,
    borderRadius: 12, // Retained previous roundness
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOpacity: 0.5,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 23,
    fontFamily: 'Helvetica',
    textAlign: 'center',
  },
  loginButtonText: {
    color: '#522357',
    fontSize: 20,
    fontFamily: 'Helvetica',
    fontWeight: '300', // Light font weight
    fontStyle: 'italic', // Oblique font style
    textAlign: 'center',
  },
});

export default Initial;
