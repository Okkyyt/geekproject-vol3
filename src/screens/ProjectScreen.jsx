import React, { useState, useEffect } from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { Provider as PaperProvider } from "react-native-paper";
import { StyleSheet, View, Text, Platform } from "react-native"; // Import StyleSheet and View


import ProjectPage from "../components/Project/ProjectPage";
import CustomDrawerContent from "../components/Project/CustomDrawerContent";
import MakeProjectScreen from "./MakeProjectScreen";
import Read from "../views/CRUD/Read";

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

function DrawerNavigator() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const getData = async () => {
    try {
      const result = await Read();
      setData(result);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    console.log("Updated data:", data);
    getData();
  }, [data.length]);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Loading...</Text>
      </View>
    );
  }

  if (data.length === 0) {
    return <MakeProjectScreen />;
  }

  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawerContent {...props} data={data} />}
      screenOptions={{ headerShown: false }}
    >
      {data.map((item, index) => (
        <Drawer.Screen
          key={index}
          name={`Project_${index}`}
          component={ProjectPage}
          initialParams={{ item: item }}
        />
      ))}
    </Drawer.Navigator>
  );
}

export default function ProjectScreen() {
  return (
    <PaperProvider>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen
          name="Drawer"
          component={DrawerNavigator}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </PaperProvider>
  );
}

// Define styles using StyleSheet
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2CB3AD', // Set the background color to match the initial page
    fontFamily: 'Helvetica', // Apply Helvetica font family
  },
  button: {
    backgroundColor: '#522357',
    paddingVertical: 20, // Increase padding to make the button larger
    borderRadius: 24,
    marginBottom: 10,
    alignItems: 'center',
    justifyContent: 'center',
    width: '80%', // Set the button width
    alignSelf: 'center',
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
    fontFamily: 'Helvetica', // Apply Helvetica font family
    textAlign: 'center',
  },
});