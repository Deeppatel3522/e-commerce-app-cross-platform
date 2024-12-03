import { StatusBar } from 'expo-status-bar';
import { Alert, FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { db, FIREBASE_AUTH } from '../config/firebaseconfig';
import { signOut } from 'firebase/auth';
import { userAuthentication } from '../config/userAuthentication';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useEffect, useState } from 'react';
import { arrayRemove, doc, getDoc, updateDoc } from 'firebase/firestore';

export default function FavoriteItemListScreen( {navigation} ) {

  const { user } = userAuthentication();
  const [loading, setLoading] = useState(true)
  const [favoriteList, setFavoriteList] = useState([])
  const [data , setData] = useState({
    name: '',
    favorites: [],
    cart: []
  })

  useEffect(() => {
    if (user?.uid) {
       fetchData();
     } else {
       setLoading(true); // Keep loading until the user is available
     } 
   }, [user]);

useEffect(() => {
  setFavoriteList(data.favorites || [])
}, [data])


// const tab = createBottomTabNavigator()

  
const fetchData = async () => {
  console.log('Data fetching...');

  if (!user?.uid) {
    console.error('User ID is not available.');
    return;
  }

  try {
      const docRef = doc(db, 'userDB', user?.uid);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
          console.log('No such document!');
      } else {
          console.log('Document data:', docSnap.data());
          setData(docSnap.data())
      }
  } catch (error) {
      console.error('Error fetching document:', error);
  }
};

const handldeDeletePress = async (item) => {
  const itemRemove = favoriteList.find((item) => item.id === item.id);
  if (itemRemove) {
    try {
      const collectionRefe = doc(db, 'userDB', user?.uid)
      await updateDoc(collectionRefe, {
        favorites: arrayRemove(item),
      })
      fetchData()
      Alert.alert('Deleted', 'Item removed from Favorite List.')
      // Alert.alert('Favorite', 'Item removed From favoritelist.\n(Just a message)')
    } catch (err) {
      console.log("ERROR: Deleting product form favorite list db: ", err);
    }
    // fetchData()
  }
}

const handldeItemPress = (item) => {
  navigation.navigate('Detail', {itemToDisplay: item})
};

const handleEmptyList = () => (
  <View style= {{flex: 1, justifyContent: "center", alignItems: "center", height: "100%"}}>
    <Text style = {{fontSize: 26, color: "gray", marginTop: 15 }}>No items</Text>
  </View>
)

const Item = ({item}) => (
  <TouchableOpacity onPress={ () => {handldeItemPress(item)}}>

    <View style = {styles.itemContainer}>
    
      <Image 
        source={{uri: item.image !== "" ? item.image : "https://m.media-amazon.com/images/M/MV5BNTU1MzgyMDMtMzBlZS00YzczLThmYWEtMjU3YmFlOWEyMjE1XkEyXkFqcGc@._V1_.jpg"}}
        style = {styles.itemImg}
      />

      <View style = {styles.itemDetailsContainer}>
        <Text style = {styles.titleLable} numberOfLines={2} ellipsizeMode='tail'>{item.title}</Text>
        <Text style = {styles.priceLable}> Price: ${item.price}</Text>

      </View>

      <Icon  
      style = {styles.deleteItemBtn}
      name = "trash"
      color= 'white'
      size = {26}
      onPress={() => {handldeDeletePress(item)}}
      />

    </View>
  </TouchableOpacity>
);

  return (
    <View style={styles.container}>
      <FlatList
            style = {{flex: 1, backgroundColor: '#E0E0E0', paddingTop: 5}}
            keyExtractor={ item => item.id}
            data={favoriteList}
            renderItem={({ item }) => <Item item = {item}/>}
            ListEmptyComponent={handleEmptyList}
            // ListEmptyComponent={handleEmptyList}
          
        />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemContainer: {
    position: 'relative',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
    backgroundColor: '#FFFFFF',
    width: '95%',
    padding: 5,
    marginVertical: 5,
    marginHorizontal: 10,
    paddingTop: 10,
    borderRadius: 20
  },
  itemImg: {
    width: '30%',
    height: 125,
    resizeMode: 'contain',
    borderRadius: 7,
    marginLeft: 5
  },
  itemDetailsContainer: {
    width: '65%',
  },
  titleLable: {
    fontSize: 18,
    color: '#444444',
    fontWeight: 600,
    width: '75%',
    marginBottom: 5
  },
  priceLable: {
    fontSize: 18,
    color: '#9C9C9C',
  },
  deleteItemBtn: {
    top: 30,
    right: 30,
    color: 'red',
    position: 'absolute'
  },
});
