import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { db, FIREBASE_AUTH } from '../config/firebaseconfig';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { collection, doc, setDoc } from 'firebase/firestore';

export default function SignUpScreen() {

  const [user, setUser] = useState({
    name: '',
    email: '',
    password: '',
  })


  async function signUp() {
    if(user.email === '' || user.password === '' || user.name === '') {
      setUser({
        ...user
      });
      console.log("Invalid details");
      return;
    }

    try {
      await createUserWithEmailAndPassword(FIREBASE_AUTH, user.email, user.password)
      .then((result) => {
        console.log("User Created: "+result.user.email);
      })

      const userId = FIREBASE_AUTH.currentUser.uid
      console.log(`User ID: ${userId}`);

      try {
        const userRef = doc(db, 'userDB', userId)
        const userDetails = {
            name: user.name,
            favorites: [],
            orders: []

        }
        await setDoc(userRef, userDetails)
        console.log("Document added!!");

      } catch (e) {
          console.log('Error adding user details: ', e)
          return;
      }

    } catch(e) {
      setUser({
        ...user
      });
      return;
    }

    
    

  }

  return (
    <View style={styles.container}>
      <View style={styles.subContainer} >

      <Text style = {{fontSize: 30, letterSpacing:3, fontWeight: '600', marginBottom: 20}}>Create Account</Text>
      <TextInput 
          style={styles.inputText}
          placeholder='Enter Name'
          keyboardType='default'
          autoCapitalize='words'
          autoCorrect={false}
          value={user.name}
          onChangeText={(text) => setUser({ ...user, name: text })} />

        
        <TextInput 
          style={styles.inputText}
          placeholder='Enter Email'
          keyboardType='email-address'
          autoCapitalize="none"
          autoCorrect={false}
          value={user.email}
          onChangeText={(text) => setUser({ ...user, email: text })} />


        <TextInput
          style={styles.inputText}
          placeholder='Enter Password'
          secureTextEntry={true}
          autoCorrect={false}
          autoCapitalize='none'
          value={user.password}
          onChangeText={(text) => setUser({ ...user, password: text })} />
        
        <TouchableOpacity 
          style={ [styles.btn, {backgroundColor: 'white', borderColor: '#DCDCDC'}] }
          onPress={signUp} >

            <Text style={[styles.btnText, { color: '#4169E1'}]} >Create Account</Text>

        </TouchableOpacity>

      </View>
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
  subContainer: {
    flex: 1,
    justifyContent: 'center',
    width: '90%',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#F8F8FF',
    borderColor: 'white',
    borderWidth: 1,
    borderRadius: 25
  },
  inputText: {
    width: '80%',
    height: 50,
    borderColor: '#8A2BE2',
    paddingLeft: 10,
    borderRadius: 50,
    borderWidth: 1,
    fontSize: 18,
    marginBottom: 20
  },
  btn: {
    width: '80%',
    backgroundColor: '#4169E1',
    borderColor: '#8A2BE2',
    borderWidth: 0.5,
    padding: 20,
    marginVertical: 20,
    borderRadius: 50,
    shadowColor: '#000', // Shadow color
    shadowOffset: { width: 0, height: 0 }, 
    shadowRadius: 50, 
    elevation: 10, 
  },
  btnText: {
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '400',
    color: 'white',
    letterSpacing: 3
  }
  
});
