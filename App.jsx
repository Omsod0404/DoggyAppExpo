import React, {useEffect, useState} from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, SafeAreaView, StatusBar} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';

const colorsPalette = {
  color1:  '#402b30',
  color2: '#faddb4',
  color3: '#f4c790',
  color4: '#f2977e',
  color5: '#ba6868',
};

export default function App() {

  const [dogData, setDogData] = useState(null);
  const [error, setError] = useState(null);
  const [imageLoaded, setImageLoaded] = useState(null);
  const [isImageLoaded, setIsImageLoaded] = useState(false);

  const fetchRandomDogData = async () => {
    try{
      const res = await fetch('https://dog.ceo/api/breeds/image/random');
      const data = await res.json();
      setDogData(data);
      setImageLoaded(null);
      setIsImageLoaded(false);
    } catch (error) {
      console.error(error.message);
      setError(error);
    }
  };

  const handleImagePickerPress = async () => {
    try {
      const res = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: false,
        aspect: [1,1],
        quality: 1,
      })
      if (!res.canceled) {
        setImageLoaded(res.assets[0].uri);
        setIsImageLoaded(true);
        setDogData(null);
      }
    } catch (error) {
      console.error(error.message);
      setError(error);
    }
  };

  const handleRemoveImagePress = async (imageURI) => {
    try {
      await AsyncStorage.removeItem(imageURI);
      setImageLoaded(null);
      setIsImageLoaded(false);
    } catch (error) {
      console.error(error.message);
      setError(error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle={'light-content'} backgroundColor={colorsPalette.color1}/>
      <View style={styles.header}>
        <Image source={require('./assets/img/icon/perro.png')} style={styles.headerImage}/>
        <Text style={styles.headerText}>DoggyApp</Text>
      </View>
      <View style={styles.imageArea}>
      {error && (
        <>
          <Text>{error}</Text>
        </>
      )}
      {dogData && (
        <>
          <Image source={{uri: dogData.message}} style={styles.dogImage}/>
        </>
      )}
      {imageLoaded && (
        <>
        <Image source={{uri: imageLoaded}} style={styles.dogImage}/>
        </>
      )}
      </View>
      <TouchableOpacity style={styles.button} onPress={fetchRandomDogData}>
          <Text style={styles.buttonText}>Get random doggy</Text>
          <Image source={require('./assets/img/icon/dados.png')} style={styles.buttonIcon}/>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={handleImagePickerPress}>
          <Text style={styles.buttonText}>Upload image</Text>
          <Image source={require('./assets/img/icon/subir.png')} style={styles.buttonIcon}/>
      </TouchableOpacity>
      {isImageLoaded && (
        <>
        <TouchableOpacity style={styles.button} onPress={() => handleRemoveImagePress(imageLoaded)}>
          <Text style={styles.buttonText}>Delete image</Text>
          <Image source={require('./assets/img/icon/borrar.png')} style={styles.buttonIcon}/>
        </TouchableOpacity>
        </>
      )}
    </SafeAreaView>
    
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colorsPalette.color2,
    alignItems: 'center',
  },
  header:{
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colorsPalette.color1,
    width: '100%',
    height: 75
  },
  headerImage:{
    height: 50,
    width: 50,
    marginRight: 10
  },
  headerText: {
    fontSize: 40,
    color: 'white',
  },
  imageArea:{
    borderRadius: 25,
    height: '50%',
    width: '80%',
    borderWidth: 5,
    borderColor: 'black',
    margin: 30,
    backgroundColor: 'white'
  },
  button: {
    backgroundColor: 'white',
    width: '80%',
    height: 50,
    borderRadius: 25,
    borderWidth: 5,
    borderColor: colorsPalette.fontColor,
    alignContent: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    display: 'flex',
    flexDirection: 'row',
    marginBottom: 30
  },
  buttonText: {
    fontSize: 25,
    textAlign: 'center',
    marginRight: 20
  },
  buttonIcon:{
    height: 35,
    width: 35
  },
  dogImage:{
    height: '100%',
    width: '100%',
    resizeMode: 'contain',
    borderRadius: 25
  }
});

//PARA MANEJAR EL ALMACENAMIENTO Y BORRAR LA IMAGEN NO FUNCIONA COMO DEBERIA, PERO LA CARGA DE LA IMAGEN
//CON EXPO IMAGE PICKER FUNCIONA