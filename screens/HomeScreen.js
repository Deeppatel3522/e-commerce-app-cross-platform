import { StatusBar } from 'expo-status-bar';
import { Alert, StyleSheet, Text, TouchableOpacity, Image, View } from 'react-native';

export default function HomeScreen( {navigation}) {
  return (
    <View style={styles.container}>
      <View style={styles.subContainer}>

        <Image 
          source={{uri: 'https://dinadeykun.com/wp-content/uploads/2021/09/product-photography-1.jpg'}}
          style={styles.img}
          resizemode='contain'
        />
        <Text style={styles.headingText}>Let's get started</Text>
        <Text style={styles.content}>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s. </Text>
        
        <TouchableOpacity 
        style={styles.btn}
        onPress={() => navigation.navigate('SignUp')}
        >
          <Text style={styles.btnText} >Create Account</Text>
        </TouchableOpacity>

        <TouchableOpacity 
        style={ [styles.btn, {backgroundColor: 'white', borderColor: '#DCDCDC'}] }
        onPress={() => navigation.navigate('Login')}
        >
          <Text style={[styles.btnText, { color: '#4169E1'}]} >Login</Text>
        </TouchableOpacity>

      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: '5%',
    backgroundColor: '#E0E0E0',
    alignItems: 'center',
    justifyContent: 'center',
  }, 
  subContainer: {
    flex: 1,
    justifyContent: 'center',
    width: '90%',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#FFFBFC',
    borderColor: 'white',
    borderWidth: 1,
    borderRadius: 25
  },
  img: {
    width: 150,
    height: 250,
    borderRadius: 10,
    marginBottom: 20,
    borderColor: 'white',
    borderWidth: 0.5,
    shadowColor: '#000', // Shadow color
    shadowOffset: { width: 0, height: 0 }, 
    shadowOpacity: 0.5,
    shadowRadius: 50, 
    elevation: 10, 
  },
  headingText: {
    color: '#121212',
    fontSize: 30,
    letterSpacing:3,
    fontWeight: 'bold',
    marginBottom: 10
  },
  content: {
    width: '75%',
    textAlign: 'center',
    fontSize: 18,
    color: '#696969',
    marginBottom: 10
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
