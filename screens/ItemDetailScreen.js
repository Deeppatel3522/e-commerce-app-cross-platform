import { StatusBar } from 'expo-status-bar';
import { Alert, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { db, FIREBASE_AUTH } from '../config/firebaseconfig';
import { signOut } from 'firebase/auth';
import { userAuthentication } from '../config/userAuthentication';
import { useEffect, useState } from 'react';
import { addDoc, collection, doc, getDoc, setDoc } from 'firebase/firestore';

export default function ItemDetailScreen( {navigation, route} ) {

  const { user } = userAuthentication();
  const {itemToDisplay} = route.params
  const sizes = ['S', 'M', 'L', 'XL']
  const [selectedSize, setSelectedSize] = useState('S')
  
  const [data , setData] = useState({
    name: '',
    cart: []
  })
  const [cartList, setCartList] = useState([])
  const [loading, setLoading] = useState(true);

useEffect(() => {
  if (user?.uid) {
    fetchData();
  } else {
    setLoading(true); // Keep loading until the user is available
  }
}, [user]);

useEffect(() => {
  setCartList(data.cart || []);
}, [data]);
 
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
          console.log('User Data: ', JSON.stringify(data));
          setCartList(data.cart)
      }
  } catch (error) {
      console.error('Error fetching document:', error);
  } finally {
    setLoading(false)
  }
};

const addToCart = async (productToAdd) => {
  console.log(`addToCart : ${productToAdd.title}`);
        /*
        cart structure:
            {
                id: productID,
                product: {productObj},
                quantity: 1,
                size: selectedSize
            }
        */
        const tempCart = [...cartList]
        const matchingIndex = tempCart.findIndex(item => item.cartId === productToAdd.id)

        //if id matches, object will be returned; otherwise -1 will be returned
        if (matchingIndex !== -1){
            tempCart[matchingIndex].quantity += 1
        }else{
            tempCart.push({
                cartId: productToAdd.id,
                product: productToAdd,
                quantity: 1,
            })
        }

        Alert.alert("Added!", `${productToAdd.title} added to cart`)
        console.log(`product added to cart. \n cart : ${JSON.stringify(tempCart)}`);
        console.log(`Cart items: ${tempCart.length}`);
        
        //update the cart with changes
        setCartList(tempCart)

        // update the cart in DB
        try {
          await updateCartToDB(tempCart);
          console.log("Cart successfully updated in Firestore!");
        } catch (err) {
          console.log("Error updating cart to Firestore: ", err);
        }
}

const updateCartToDB = async (cartListToUpdate) => {
  try {
    const collectionRefe = doc(db, 'userDB', user?.uid)
    await setDoc(collectionRefe, {cart: cartListToUpdate}, {merge: true})
    fetchData()
  } catch (err) {
    console.log("ERROR: Adding cart to DB: ", err);
  }
}

  return (

    <View style={styles.container}>

      <Image 
        source={{uri: itemToDisplay.image !== "" ? itemToDisplay.image : "https://m.media-amazon.com/images/M/MV5BNTU1MzgyMDMtMzBlZS00YzczLThmYWEtMjU3YmFlOWEyMjE1XkEyXkFqcGc@._V1_.jpg"}}
        style = {styles.coverImg}
      />
      
      <View style={ styles.contentContainer}> 
        <Text style={styles.title} numberOfLines={2} ellipsizeMode='tail'>{itemToDisplay.title}</Text>
        <Text style={styles.price}>${itemToDisplay.price}</Text>
      </View>

      <View style={ styles.detailContainer}> 
        <Text style={styles.categoryLabel}>{itemToDisplay.category}</Text>
        <Text style={styles.descriptionLabel} numberOfLines={4} ellipsizeMode='tail'>{itemToDisplay.description}</Text>
      </View>

      <View style={ styles.ratingContainer}> 
        <Text style={styles.rate}>Rating: {itemToDisplay.rating.rate}</Text>
        <Text style={styles.rateCount}>({itemToDisplay.rating.count})</Text>
      </View>

      <TouchableOpacity 
        style={styles.addToCartBtn}
        onPress={() => {addToCart(itemToDisplay)}} >
          <Text style={styles.addToCartBtnText}>Add To Cart</Text>
        </TouchableOpacity>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  coverImg: {
    marginTop: 10,
    width: '100%',
    height: 410,
    resizeMode: 'contain'
  }, 
  contentContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 20,
    marginVertical: 20
  },
  title: {
    width: '60%',
    fontSize: 20,
    color: '#444444',
    fontWeight: 500,
  },
  price: {
    fontSize: 20,
    color: '#4D4C4C',
    fontWeight: 600,
  }, 
  detailContainer: {
    marginHorizontal: 20,
    marginTop: 10,
  },
  categoryLabel: {
    textTransform: 'capitalize',
    fontSize: 18,
    color: '#4D4C4C',
    fontWeight: 500,
    marginBottom: 5
    
  },
  descriptionLabel: {
    fontSize: 18,
    fontWeight: 400,

  },
  ratingContainer: {
    marginHorizontal: 20,
    marginVertical: 20,
    flexDirection: 'row',
    gap:0
  },
  rate: {
    fontSize: 18,
    color: '#4D4C4C',
    fontWeight: 500,
    marginRight: 5
  }, 
  rateCount: {
    fontSize: 18,
    color: '#4D4C4C',
    fontWeight: 500,
  },
  addToCartBtn: {
    marginHorizontal: 20,
    marginVertical: 20,
    width: '90%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4169E1',
    borderColor: '#8A2BE2',
    borderWidth: 0.5,
    padding: 20,
    borderRadius: 50,
    shadowColor: '#000', // Shadow color
    shadowOffset: { width: 0, height: 0 }, 
    shadowRadius: 50, 
    elevation: 10, 
  }, 
  addToCartBtnText: {
    textAlign: 'center',
    fontSize: 22,
    fontWeight: 400,
    color: 'white',
    letterSpacing: 3
  } , 
  







  buttonStyle: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '80%',
    backgroundColor: 'chocolate',
    borderRadius: 10,
    height: 40
  },
  buttonText: {
    fontSize: 20,
    fontWeight: '500',
    color: 'white'
  }
});



















































// <View style={styles.container}>
    //   {loading ? (
    //     <Text>loading....</Text>
    //   ) : (
    //     <>
    //   <Text> Item Details SCREEN</Text>
    //   <Text> Total Cart Items: {cartList.length}</Text>
    //   <Text> Total Cart Items: {data.cart.length}</Text>
    //   <Text>{itemToDisplay.title}</Text>
      

    //   <TouchableOpacity 
    //       style={styles.buttonStyle}
    //       onPress={() => {addToCart(itemToDisplay)}} >
    //       <Text style={styles.buttonText}>Add To Cart</Text>
    //     </TouchableOpacity>

    //   <TouchableOpacity 
    //       style={styles.buttonStyle}
    //       onPress={()=> {navigation.navigate('Cart')}} >
    //       <Text style={styles.buttonText}>CART</Text>
    //     </TouchableOpacity>

    //   <TouchableOpacity 
    //       style={styles.buttonStyle}
    //       onPress={()=> {navigation.navigate('Favorite')}} >
    //       <Text style={styles.buttonText}>FAVORITE</Text>
    //     </TouchableOpacity>
    //     </>
    //   )
    //   }

    // </View>