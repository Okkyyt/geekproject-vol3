import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

import Page1 from "../components/MakeProject/pages/Page1";
import Page2 from "../components/MakeProject/pages/Page2";
import Page3 from "../components/MakeProject/pages/Page3";

const Stack = createStackNavigator();

function MakeProjectScreen() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Home" component={Page1} />
      <Stack.Screen name="Page2" component={Page2} />
      <Stack.Screen name="Page3" component={Page3} />
    </Stack.Navigator>
  );
}

export default MakeProjectScreen;