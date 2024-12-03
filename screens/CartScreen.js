import { StatusBar } from 'expo-status-bar';
import { Alert, FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { db, FIREBASE_AUTH } from '../config/firebaseconfig';
import { signOut } from 'firebase/auth';
import { userAuthentication } from '../config/userAuthentication';
import { useEffect, useState } from 'react';
import { addDoc, arrayRemove, collection, doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';

export default function CartScreen({ navigation} ) {

    // VARIABLES
    const { user } = userAuthentication();
    const [loading, setLoading] = useState(true)
    const [cartList, setCartList] = useState([])
    const [subTotal, setSubTotal] = useState(0)
    const [tax, setTax] = useState(0)
    const [total, setTotal] = useState(0)
    const [data , setData] = useState({
      name: '',
      cart: []
    })

    // USE EFFECTS
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

    useEffect(() => {
      billCalculate()
      // updateCartToDB(cartList)
      // fetchData()
    }, [cartList])

    useEffect(() => {
      setTax(subTotal * 0.13)
    }, [subTotal])

    useEffect(() => {
      setTotal((subTotal + tax))
    }, [tax])

 
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
              // console.log('Document data:', docSnap.data());
              console.log('Document data fetched....:');
              setData(docSnap.data())
          }
      } catch (error) {
          console.error('Error fetching document:', error);
      }
    };

    const billCalculate = () => {
      let sum = 0

      cartList.forEach(item => {
        sum += (item.product.price * item.quantity)
    })

      setSubTotal(sum)
    }

    const saveOrderToDB = async () => {
      try {
        console.log("Saving order to DB...", user?.uid);
        const order = {
          data: Date(),
          cartItems: cartList,

        }
        const collectionRefe = collection( doc(db, 'userDB', user?.uid,) ,'orderHistory')
        await addDoc(collectionRefe, order)

        try {
          const collectionRefe = doc(db, 'userDB', user?.uid)
          await setDoc(collectionRefe, {cart: []}, {merge: true})
          fetchData()
        } catch (err) {
          console.log("ERROR: Adding cart to DB: ", err);
        }
    
      } catch (err) {
        console.log("ERROR: Adding order history to DB: ", err);
        
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

    const Item = ({item}) => (
      <TouchableOpacity onPress={ () => {handldeItemPress(item)}}>
    
        <View style = {styles.itemContainer}>
        
          <Image 
            source={{uri: item.product.image !== "" ? item.product.image : "https://m.media-amazon.com/images/M/MV5BNTU1MzgyMDMtMzBlZS00YzczLThmYWEtMjU3YmFlOWEyMjE1XkEyXkFqcGc@._V1_.jpg"}}
            style = {styles.itemImg}
          />
    
          <View style = {styles.itemDetailsContainer}>
            <Text style = {styles.titleLable} numberOfLines={2} ellipsizeMode='tail'>{item.product.title}</Text>
            <Text style = {styles.qtyLable}> Qty: {item.quantity}</Text>
            <Text style = {styles.priceLable}> Price: ${item.product.price}</Text>
            <Text style = {styles.totalLable}> Total: {(item.quantity * item.product.price)}</Text>
    
          </View>
    
          <Icon  
          style = {styles.deleteItemBtn}
          name = "trash"
          color= 'white'
          size = {26}
          onPress={() => {handldeDeletePress(item.cartId)}}
          />
    
        </View>
      </TouchableOpacity>
    );
    
    const handleEmptyList = () => (
      <View style= {{flex: 1, justifyContent: "center", alignItems: "center", height: "100%"}}>
        <Text style = {{fontSize: 26, color: "gray", marginTop: 15 }}>No items</Text>
      </View>
    )
    
    const handldeItemPress = (item) => {
      navigation.navigate('Detail', {itemToDisplay: item.product})
    };
    const handldeDeletePress = async (cartId) => {
      const itemIndex = cartList.find((item) => item.cartId === cartId);

      if (itemIndex) {
        try {
          const collectionRefe = doc(db, 'userDB', user?.uid)
          await updateDoc(collectionRefe, {
            cart: arrayRemove(itemIndex),
          })
          fetchData()
          Alert.alert('Deleted', 'Item removed from cart.')
        } catch (err) {
          console.log("ERROR: Adding cart to DB: ", err);
        }
        // fetchData()
      }
    }

    return (
      <View style={styles.container}>
        
        <FlatList
            style = {{flex: 0.6,
                      backgroundColor: '#252525', 
                      backgroundColor: '#E0E0E0', 
                      paddingTop: 5}}
            keyExtractor={ item => item.id}
            data={cartList}
            renderItem={({ item }) => <Item item = {item}/>}
            ListEmptyComponent={handleEmptyList}
          
        />

        <View style = {{flex: 0.4, width: '100%', marginTop: 20,}}>
          <View style={styles.priceAndTitle} >
            <Text style={{fontSize: 18, marginBottom: 7,fontWeight: 600, color: '#757575', textAlign: 'left'}}> SubTotal:</Text>
            <Text style={{fontSize: 18, marginBottom: 7,fontWeight: 600, color: '#757575', textAlign: 'right'}}>${parseFloat(subTotal).toFixed(2)}</Text>
          </View>

          <View style={styles.priceAndTitle} >
            <Text style={{fontSize: 18, marginBottom: 7,fontWeight: 500, color: '#757575', textAlign: 'left'}}> Tax:</Text>
            <Text style={{fontSize: 18, marginBottom: 7,fontWeight: 500, color: '#757575', textAlign: 'right'}}>${parseFloat(tax).toFixed(2)}</Text>
          </View>
          <View style={{width: '90%', backgroundColor: '#757575', height: 1, marginLeft: 23, marginVertical: 10}}></View>
          <View style={styles.priceAndTitle} >
            <Text style={{fontSize: 22, marginBottom: 7,fontWeight: 700, color: '#757575', textAlign: 'left'}}> Total:</Text>
            <Text style={{fontSize: 22, marginBottom: 7,fontWeight: 700, color: '#009900', textAlign: 'right'}}>${parseFloat(total).toFixed(2)}</Text>
          </View>
          

          <TouchableOpacity 
              style={styles.chekoutBtn}
              onPress={saveOrderToDB} 
          >
              <Text style={styles.chekoutBtnText}>Checkout</Text>
          </TouchableOpacity>
          </View>
      </View>
    );
}

    const styles = StyleSheet.create({
      container: {
        position: 'relative',
        flex: 1,
        backgroundColor: '#F5F5F5',
        // backgroundColor: '#181818',
        alignItems: 'center',
        // justifyContent: 'center',
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
      qtyLable: {
        fontSize: 18,
        color: '#9C9C9C',
      },
      priceLable: {
        fontSize: 18,
        color: '#9C9C9C',
      },
      totalLable: {
        fontSize: 18,
        color: '#444444',
        fontWeight: 600
      },
      deleteItemBtn: {
        top: 30,
        right: 30,
        color: 'red',
        position: 'absolute'
      },
      priceAndTitle: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginHorizontal: 20
      },
      chekoutBtn: {
        position: 'absolute',
        bottom: 10,
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
      chekoutBtnText: {
        textAlign: 'center',
        fontSize: 22,
        fontWeight: 400,
        color: 'white',
        letterSpacing: 3
      }
    });
