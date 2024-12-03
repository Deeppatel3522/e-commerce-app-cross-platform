import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { Button, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import ItemList from '../screens/ItemList';
import CartScreen from '../screens/CartScreen';
import FavoriteItemListScreen from '../screens/FavoriteItemListScreen';
import Icon from 'react-native-vector-icons/FontAwesome';
import ItemDetailScreen from '../screens/ItemDetailScreen';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import FirstPage from '../screens/FIrstPage';
import { FIREBASE_AUTH } from '../config/firebaseconfig';
import { signOut } from 'firebase/auth';

const Stack = createNativeStackNavigator()
const Tab = createBottomTabNavigator()

export default function App() {

  const ViewCartOption = (navigation) => (

    <Icon  
          style = {{marginRight: 5}}
          name = "cart-arrow-down"
          color= 'gray'
          size = {28}
          onPress={() => navigation.navigate('Cart')}
    />

    // <TouchableOpacity
    //   onPress={() => navigation.navigate('Cart')}
    //   style={styles.headerBtn} >
    //     <Text style={styles.headerBtnText}>Cart</Text>
    //   </TouchableOpacity>
  );

  const UserProfileOption = ({navigation}) => (

    <Icon  
          style = {{marginRight: 5}}
          name = "heart"
          color= 'gray'
          size = {28}
          onPress={() => navigation.navigate('Favorite')}
    />
    // <TouchableOpacity
    //   onPress={() => {navigation.navigate('Favorite')}}
    //   style={styles.headerBtn} >
    //     <Text style={styles.headerBtnText}>User</Text>
    //   </TouchableOpacity>
  );


  const LogOutOption = () => (

    // <Icon  
    //       style = {styles.deleteItemBtn}
    //       name = "right-from-bracket"
    //       color= 'red'
    //       size = {26}
    //       onPress={()=> {signOut(FIREBASE_AUTH)}}
    // />
    <TouchableOpacity
      onPress={()=> {signOut(FIREBASE_AUTH)}}
      style={[styles.headerBtn, {backgroundColor: '#FF0000'}]} >
        <Text style={styles.headerBtnText}>Log Out</Text>
      </TouchableOpacity>
  );


  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName='List'>
        <Stack.Group>

        <Stack.Screen
          name="List"
          component={ItemList}
          options={({ navigation }) => ({
            headerRight: () => (
              <View style={{ flexDirection: 'row', gap: 10 , alignItems: 'center'}}>
                {ViewCartOption(navigation)} 
                <UserProfileOption navigation={navigation} />
                {LogOutOption()} 
              </View>
            ),
          })}
        />

          <Stack.Screen 
            name="Detail"
            component={ItemDetailScreen}
            options={({ navigation }) => ({
              headerRight: () => (
                <View style={{ flexDirection: 'row', gap: 10 }}>
                  {ViewCartOption(navigation)} 
                  {LogOutOption()} 
                </View>
              ),
            })}
          />

          <Stack.Screen 
            name="Favorite"
            component={FavoriteItemListScreen}
          />

          <Stack.Screen 
            name="Cart"
            component={CartScreen}
            options={({ navigation }) => ({
              headerRight: () => (
                <View style={{ flexDirection: 'row', gap: 10 }}>
                  {LogOutOption()} 
                </View>
              ),
            })}
          />

        </Stack.Group>
      </Stack.Navigator>
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
  headerBtn: {
    backgroundColor: '#007BFF', 
    width: 85,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    marginRight: 10,  
    marginVertical: 5     
  }, 
  headerBtnText: {
    color: 'white', 
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600'
  }
});