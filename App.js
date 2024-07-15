import { StatusBar } from 'expo-status-bar';
import 'react-native-gesture-handler';
import React from 'react';
import { StyleSheet, Text, View,Button} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MandalaChartEdit from './src/components/Project/MandaraChartEdit';

// Import the pages
import ChatScreen from './src/page/ChatScreen';
import ServerCreate from './src/page/ServerCreate';
import GroupScreen from './src/page/GroupScreen';
import Initial from './src/page/InitialScreen';
import Mandara from './src/page/MandaraScreen';
import MyPage from './src/page/MyPage';
import ServerSearch from './src/page/ServerSearch';
import ServerAdd from './src/page/ServerAdd';
import AuthScreen from './src/page/AuthScreen';;
import MakeProjectScreen from "./src/screens/MakeProjectScreen";
import ProjectScreen from "./src/screens/ProjectScreen";
import UserProfileEdit from './src/page/UserProfielEdit';
import IntroductionPage from './src/page/Introduction';
import MandalaChartExplanation from './src/page/MandaraChartExplanation';


const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const FooterTabs = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      tabBarIcon: ({ focused, color, size }) => {
        let iconName;
        if (route.name === 'ProjectScreen') {
          iconName = focused ? 'home' : 'home-outline';
        } else if (route.name === 'MyPage') {
          iconName = focused ? 'person' : 'person-outline';
        } else if (route.name === 'GroupScreen') {
          iconName = focused ? 'people' : 'people-outline';
        }
        return <Icon name={iconName} size={size} color={color} />;
      },
    })}
    tabBarOptions={{
      activeTintColor: 'tomato',
      inactiveTintColor: 'gray',
    }}
  >
    <Tab.Screen name="ProjectScreen" component={ProjectScreen} />
    <Tab.Screen name="MyPage" component={MyPage} />
    <Tab.Screen name="GroupScreen" component={GroupScreen} />
  </Tab.Navigator>
);
const MainStack = () => (
  <Stack.Navigator>
    <Stack.Screen name="FooterTabs" component={FooterTabs} options={{ headerShown: false }} />
    <Stack.Screen name="ChatScreen" component={ChatScreen} options={{ title: 'チャットページ' }} />
    <Stack.Screen name="ServerCreate" component={ServerCreate} options={{ headerShown: false }} />
    <Stack.Screen name="GroupScreen" component={GroupScreen} options={{ title: 'グループページ' }} />
    <Stack.Screen name="MandaraChart" component={MandaraChart} options={{ title: '曼荼羅作成' }} />
    <Stack.Screen name="ServerSearch" component={ServerSearch} options={{ title: 'サーバー検索' }} />
    <Stack.Screen name="ServerAdd" component={ServerAdd} options={{ title: 'サーバー追加' }} />
    <Stack.Screen name="MakeProject" component={MakeProjectScreen} options={{ title: "目標の作成" }} />
    <Stack.Screen name="ShowTask" component={ShowTaskScreen} options={{ title: "Todo管理画面" }} />
    <Stack.Screen name="UserProfileEdit" component={UserProfileEdit} options={{ title: 'プロフィール��集' }} />
  </Stack.Navigator>
);

const HomeScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Button title="チャットページへ" onPress={() => navigation.navigate('ChatScreen')} />
      <Button title="サーバー作成ページへ" onPress={() => navigation.navigate('ServerCreate')} />
      <Button title="グループページへ" onPress={() => navigation.navigate('GroupScreen')} />
      <Button title="初期画面" onPress={() => navigation.navigate('Initial')}/>
      <Button title="曼荼羅作成" onPress={() => navigation.navigate('Mandara')} />
      <Button title="マイページ" onPress={() => navigation.navigate('MyPage')}/>
      <Button title="サーバー検索" onPress={() => navigation.navigate('ServerSearch')}/>
      <Button title="ログイン・サインイン" onPress={() => navigation.navigate('AuthScreen')}/>
      <Button title="サーバー追加" onPress={() => navigation.navigate('ServerAdd')}/>
      <Button title="目標の作成" onPress={() => navigation.navigate("MakeProject")} />
      <Button title="プロジェクトの表示" onPress={() => navigation.navigate("ProjectScreen")} />
    </View>
  );
}

export default function App() {
  return (
      <NavigationContainer>
      <Stack.Navigator initialRouteName={"Initial"}>
        <Stack.Screen
          name="ChatScreen"
          component={ChatScreen}
          options={{ title: '' }}
        />
        <Stack.Screen
          name="ServerCreate"
          component={ServerCreate}
          options={{title: '',headerShown: false }}
        />
        <Stack.Screen
          name="GroupScreen"
          component={GroupScreen}
          options={{ title: '', headerShown: false }}
        />
        <Stack.Screen
        name="Initial"
        component={Initial}
        options={{ headerShown: false }}
        />
        <Stack.Screen
        name="Mandara"
        component={Mandara}
        options={{ title: '' }}
        />
        <Stack.Screen
        name="MyPage"
        component={MyPage}
        options={{ headerShown: false }}
        />
        <Stack.Screen
        name="ServerSearch"
        component={ServerSearch}
        options={{ title: '' }}
        />
        <Stack.Screen
        name="ServerAdd"
        component={ServerAdd}
        options={{ title: '' }}
        />
        <Stack.Screen
        name="AuthScreen"
        component={AuthScreen}
        options={{ headerShown: false }}
        />
        <Stack.Screen
          name="MakeProject"
          component={MakeProjectScreen}
          options={{ headerShown: false  }}
        />
        <Stack.Screen
          name="ProjectScreen"
          component={ProjectScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
        name="UserProfileEdit"
        component={UserProfileEdit}
        options={{ headerShown: false }}
        />
        <Stack.Screen
        name="Introduction"
        component={IntroductionPage}
        options={{headerShown: false }}
        />
        <Stack.Screen
        name="MandalaChartEdit"
        component={MandalaChartEdit}
        options={{headerShown: false }}
        />
        <Stack.Screen
        name="Mandara_intro"
        component={MandalaChartExplanation}
        options={{headerShown: false }}
        />
      </Stack.Navigator>
      <StatusBar style="auto" />
    </NavigationContainer>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});