import { StatusBar } from 'expo-status-bar';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { FIREBASE_AUTH } from '../config/firebaseconfig';
import { useState } from 'react';

const LoginScreen = () => {

  const [user, setUser] = useState({
    email: '',
    password: '',
    error: ''
  });
  
  async function signIn() {

     if (user.email === '') {
      setUser({
        ...user,
        error: 'Enter valid Email address.'
      });
      return;
     } else if (user.password === '') {
      setUser({
        ...user,
        error: 'Enter valid Password.'
      });
      return;
     }

    try {
      await signInWithEmailAndPassword(FIREBASE_AUTH, user.email, user.password)
      .then((result) => {
        console.log("User Logged in: "+result.user);
      })
    } catch(e) {
      setUser({
        ...user,
        error: `Loggin Error: \n ${e}!`
      });
      return;
    }

    const userId = FIREBASE_AUTH.currentUser.uid
    console.log(`User ID: ${userId}`);
    
  }

  return (
    <View style={styles.container}>

        <Text style={styles.title}>Sign In</Text>
      
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

        {
          !!user.error && 
          <View style={{ marginBottom: 10 }}>
            <Text style={{ color: 'red', fontSize: 14 }}>{user.error}</Text>
          </View>

        }
        
        <TouchableOpacity 
          style={styles.loginBtn}
          onPress={signIn} >
          <Text style={styles.loginBtnText}>Sign In</Text>
        </TouchableOpacity>
      
    </View>
  );

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E0E0E0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    marginBottom: 40,
    fontSize: 34,
    fontWeight: 900,
    letterSpacing: 2,
    textAlign: 'center',
    color: '#4169E1',
    textShadowColor: '#A9A9A9',
    textShadowRadius: 2,
    textShadowOffset: { width: 2, height: 2 }, 
  },
  inputText: {
    width: '80%',
    borderColor: '#A9A9A9',
    height: 50,
    paddingLeft: 10,
    borderRadius: 25,
    borderWidth: 1,
    fontSize: 18,
    marginBottom: 25
  },
  loginBtn: {
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
  loginBtnText: {
    textAlign: 'center',
    fontSize: 22,
    fontWeight: 400,
    color: 'white',
    letterSpacing: 3
  }
  
});

export default LoginScreen