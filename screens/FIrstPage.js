{/* <NavigationContainer>
        <Tab.Navigator>
            <Tab.Group>

              <Tab.Screen
                      options={{
                        tabBarIcon: () => (
                          <Icon name = "list"  size= {20} />
                        )
                      }}
                      name="List"
                      component={ItemList} />

              <Tab.Screen
                      options={{
                        tabBarIcon: () => (
                          <Icon name = "heart" size= {20} />
                        )

                      }}
                      name="heart"
                      component={CartScreen} />

              <Tab.Screen
                      options={{
                        tabBarIcon: () => (
                          <Icon name = "cart-shopping" size= {20} />
                        )
                      }}
                      name="cart-shopping"
                      component={FavoriteItemListScreen} />
              <Tab.Screen
                      options={{
                        tabBarIcon: () => (
                          <Icon name = "user" size= {20} />
                        )
                      }}
                      name="user"
                      component={ItemDetailScreen} />


            </Tab.Group>
        </Tab.Navigator>
    </NavigationContainer> */}





import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import ItemList from '../screens/ItemList';
import CartScreen from '../screens/CartScreen';
import FavoriteItemListScreen from '../screens/FavoriteItemListScreen';
import Icon from 'react-native-vector-icons/FontAwesome';
import ItemDetailScreen from '../screens/ItemDetailScreen';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

const Stack = createNativeStackNavigator()
const Tab = createBottomTabNavigator()

export default function FirstPage() {

  return (

    <NavigationContainer>
        <Tab.Navigator>
            <Tab.Group>

              <Tab.Screen
                      options={{
                        tabBarIcon: () => (
                          <Icon name = "list"  size= {20} />
                        )
                      }}
                      name="List"
                      component={ItemList} />

              <Tab.Screen
                      options={{
                        tabBarIcon: () => (
                          <Icon name = "heart" size= {20} />
                        )

                      }}
                      name="heart"
                      component={CartScreen} />

              <Tab.Screen
                      options={{
                        tabBarIcon: () => (
                          <Icon name = "cart-shopping" size= {20} />
                        )
                      }}
                      name="cart-shopping"
                      component={FavoriteItemListScreen} />
              <Tab.Screen
                      options={{
                        tabBarIcon: () => (
                          <Icon name = "user" size= {20} />
                        )
                      }}
                      name="user"
                      component={ItemDetailScreen} />


            </Tab.Group>
        </Tab.Navigator>
    </NavigationContainer>
    
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  }
});