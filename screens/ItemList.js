import { StatusBar } from 'expo-status-bar';
import { FlatList, FlatListComponent, Modal, StyleSheet, Image, Text, TouchableOpacity, View, Alert, ScrollView, TextInput } from 'react-native';
import { db, FIREBASE_AUTH } from '../config/firebaseconfig';
import { signOut } from 'firebase/auth';
import { userAuthentication } from '../config/userAuthentication';
import { useEffect, useState } from 'react';
import { addDoc, collection, doc, getDoc, getDocs, setDoc } from 'firebase/firestore';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import axios from 'axios';
import Icon from 'react-native-vector-icons/FontAwesome';
import { NavigationContainer } from '@react-navigation/native';
import CartScreen from './CartScreen';
import FavoriteItemListScreen from './FavoriteItemListScreen';
import ItemDetailScreen from './ItemDetailScreen';

// API links
//  https://fakestoreapi.com/products

export default function ItemList( {navigation} ) {

  const { user } = userAuthentication();
  const [productList, setProductList] = useState([])
  const [favoriteList, setFavoriteList] = useState([])
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [loading, setLoading] = useState(true)

  const [categories, setCategories] = useState([
    "all",
    "electronics",
    "jewelery",
    "men's clothing",
    "women's clothing"])

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

useEffect(( () => {
  fetchProducts(selectedCategory);
  // fetchCategories();
}), [selectedCategory])

useEffect(() => {
  setFavoriteList(data.favorites || [])
}, [data])


const tab = createBottomTabNavigator()

// fetch user Data
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

// fetch products from API
const fetchProducts = async (category) => {

  let APIlink = ''
  if (category === "all") {
    APIlink = "https://fakestoreapi.com/products"
  } else {
    APIlink = `https://fakestoreapi.com/products/category/${category}`
  }

  console.log("Fetching Products for: ", category);
  try {
    const response = await axios.get(APIlink);
    setProductList(response.data);
  } catch (error) {
    console.log("Error fetching products", error);
  }
};
const fetchCategories = async () => {
  console.log("Fetching Categories...");
  const result = []
  try {
    const response = await axios.get("https://fakestoreapi.com/products/categories");
    result = response.data.map((category, index) => ({
                id: index + 1,
                category_name: category
              })) 
    setCategories(result)  
  } catch (error) {
    console.log("Error fetching products", error);
  }
};

// fetch products form Database
const fetchProductsFromDB = async () => {

  try {
    const collectionRefe = collection(db, "productDB");
    const collectionSnap = await getDocs(collectionRefe)

    const result = []

    collectionSnap.forEach( (doc) => {
      const productToAdd = {
        id: doc.id,
        ...doc.data()
      }
      result.push(productToAdd)
    })

    setProductList(result)
  } catch (err) {
    console.log("ERROR: Fetching products: ", err);
  }

}

const addProductsToDB = async () => {
  try {
    const collectionRefe = collection(db, 'productDB')

    productList.forEach( async (product) => {
      await addDoc(collectionRefe, product)

    })

  } catch (err) {
    console.log("ERROR: Adding produts to DB: ", err);
    
  }
} 

const addItemInFavoriteList = async (item) => {
  const isItemInFavorites = favoriteList.some(favorite => favorite.title === item.title);

  if (isItemInFavorites) {
    console.log(`${item.title} is already in the favorite list.`);
    Alert.alert('⚠️ Favorite', 'Already in favorite list.')
    return; // Exit the function if item already exists
  }

  favoriteList.push(item)
  try {
    const collectionRefe = doc(db, 'userDB', user?.uid)
    await setDoc( collectionRefe, {favorites: favoriteList}, {merge: true})
    fetchData()
    Alert.alert('✅ Favorite', 'Item added to favoriteList')

  } catch (err) {
    console.log("ERROR: Adding produts to DB: ", err);
    
  }
  for(const i in favoriteList) {
    console.log(`${favoriteList[i].title}\n`);
  }
}

const Item = ({item}) => (
  <TouchableOpacity onPress={ () => {handldeItemPress(item)}}>

    <View style = {styles.itemContainer}>
    
      <Image 
        source={{uri: item.image !== "" ? item.image : "https://m.media-amazon.com/images/M/MV5BNTU1MzgyMDMtMzBlZS00YzczLThmYWEtMjU3YmFlOWEyMjE1XkEyXkFqcGc@._V1_.jpg"}}
        style = {styles.itemImg}
      />

      <View style = {styles.itemDetailsContainer}>
        <Text style = {styles.titleLable} 
              numberOfLines={2} 
              ellipsizeMode='tail'>{item.title}</Text>

        <Text style = {styles.priceLable}>${item.price}</Text>

      </View>


      <View style= {styles.likeBtnContainer}>
        <Icon  
        style = {styles.likeBtn}
        name = "heart"
        color= 'red'
        size = {26}
        onPress={() => {addItemInFavoriteList(item)}}
        // onPress={() => {Alert.alert('Favorite', `${item.title} added to Favorite list (Just a Message).`)}}  // BTN is not working for now
        />
      </View>

    </View>

  </TouchableOpacity>
);

const Category = ({item, selectedCategory, setSelectedCategory}) => {
  return (
    <TouchableOpacity 
      onPress={() => setSelectedCategory(item)}>
        <Text style={[styles.categoryName, selectedCategory === item && {color: '#FFFFFF', backgroundColor: 'gray'}]}>{item}</Text>
    </TouchableOpacity>

  )
}

const handleEmptyList = () => (
  <View style= {{flex: 1, justifyContent: "center", alignItems: "center", height: "100%"}}>
    <Text style = {{fontSize: 26, color: "gray", marginTop: 15 }}>No items</Text>
  </View>
)

const handldeItemPress = (item) => {
  navigation.navigate('Detail', {itemToDisplay: item})
};



  return (
    <View style={styles.container}>

        <FlatList
          style={styles.categoryList}
          keyExtractor={ item => item.id}
          data={categories}
          horizontal={true}
          renderItem={({ item}) => <Category item={item} selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory} />}
          ListEmptyComponent={handleEmptyList}
        />    
        

      <FlatList
          style={{}}
          keyExtractor={ item => item.id}
          data={productList}
          numColumns={2}
          renderItem={({ item }) => <Item item = {item}/>}
          ListEmptyComponent={handleEmptyList}
        
      />

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: '#FDF0F3',
    backgroundColor: '#E0E0E0',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column'
  },
  buttonStyle: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '80%',
    backgroundColor: 'chocolate',
    borderRadius: 10,
    height: 50,
    marginVertical: 10
  },
  itemContainer: {
    flex: 1,
    position: 'relative',
    gap: 10,
    backgroundColor: '#FFFBFC',
    width: 167,
    padding: 5,
    marginVertical: 15,
    marginHorizontal: 15,
    borderRadius: 20,
  },
  itemImg: {
    width: '90%',
    height: 256,
    resizeMode: 'contain',
    marginVertical: 10,
    marginLeft: 10
  },
  itemDetailsContainer: {
    marginLeft: 10
  },
  titleLable: {
    fontSize: 18,
    color: '#444444',
    fontWeight: 600,
    width: '90%',
    marginBottom: 5
  },
  priceLable: {
    fontSize: 18,
    color: '#9C9C9C',
    fontWeight: 600,
    width: '90%',
    marginBottom: 5
  },
  ratingContainer: {
    flexDirection: 'row'
  },
  likeBtnContainer: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    top: 15,
    right: 15
  },
  buttonText: {
    fontSize: 20,
    fontWeight: '500',
    color: 'white'
  },
  categoryList: {
    marginTop: 10,
  },
  categoryName: {
    fontSize: 16,
    fontWeight: 600,
    backgroundColor: '#C0C0C0',
    color: 'black',
    paddingHorizontal: 20,
    paddingVertical: 10,
    textAlign: 'center',
    marginHorizontal: 10,
    marginVertical: 5,
    borderRadius: 10
  }
  
});

