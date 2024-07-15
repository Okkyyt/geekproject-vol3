import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import {Ionicons } from '@expo/vector-icons';

const Fotter = () => {
  const navigation = useNavigation();
  const route = useRoute();

  const screens = [
    { name: 'MyPage', icon: 'person' },
    { name: 'GroupScreen', icon: 'people' },
    { name: 'ProjectScreen', icon: 'home' },
  ];

  return (
    <View style={styles.footer}>
      {screens.map((screen) => (
        <TouchableOpacity
          key={screen.name}
          style={styles.iconContainer}
          onPress={() => navigation.navigate(screen.name)}
        >
          <Ionicons
            name={screen.icon}
            size={24}
            color={route.name === screen.name ? '#4CAF50' : '#666'}
          />
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: 'white',
    height: 60,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  iconContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Fotter;

