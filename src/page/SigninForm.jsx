import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { doc, setDoc } from 'firebase/firestore';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth, db,Timestamp } from '../views/firebaseConfig.js';

const SigninForm = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');

  const handleSignUp = () => {
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        updateProfile(auth.currentUser, {
          displayName: username,
        })
          .then(() => {
            console.log('User profile updated');
            const userRef = doc(db, 'users', user.uid);
            setDoc(userRef, { username: username,createdAt: Timestamp.now()})
              .then(() => {
                console.log('User document created');
                navigation.navigate('Introduction');
              })
              .catch((error) => {
                console.error('Error creating user document: ', error);
              });
          })
          .catch((error) => {
            console.error('Error updating profile: ', error);
          });
        console.log('User created: ', user);
      })
      .catch((error) => {
        setError(error.message);
      });
  };

  return (
    <View style={styles.formContainer}>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Username"
          placeholderTextColor="#8e8e8e"
          value={username}
          onChangeText={(text) => setUsername(text)}
        />
      </View>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#8e8e8e"
          value={email}
          onChangeText={(text) => setEmail(text)}
        />
      </View>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#8e8e8e"
          value={password}
          onChangeText={(text) => setPassword(text)}
          secureTextEntry
        />
      </View>
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <TouchableOpacity style={styles.button} onPress={handleSignUp}>
        <Text style={styles.buttonText}>Sign Up</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  formContainer: {
    width: '100%',
  },
  inputContainer: {
    width: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 25,
    marginBottom: 20,
    paddingHorizontal: 15,
  },
  input: {
    height: 50,
    color: '#fff',
  },
  button: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 25,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    elevation: 3,
  },
  buttonText: {
    color: '#4c669f',
    fontSize: 18,
    fontWeight: 'bold',
  },
  error: {
    color: '#ff0000',
    marginBottom: 12,
  },
});

export default SigninForm;