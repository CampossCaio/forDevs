import React, {useState, useEffect} from 'react';
import api from '../services/api';
import AsyncStorage from '@react-native-community/async-storage';

import {
  Text,
  View,
  Image,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';

import logo from '../assets/logo.png';

export default function Login({navigation}) {
  const [user, setUser] = useState('');

  /**
   * Verifica se o usuário está salvo no asyncestorage, caso esteja irá manda-lo direto para a página Main
   */
  useEffect(() => {
    AsyncStorage.getItem('user').then(user => {
      if (user) {
        navigation.navigate('Main', user);
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handlerLogin() {
    console.log(user);
    const response = await api.post('/devs', {username: user});

    const {_id} = response.data;

    // Salvando id do usuário logado
    await AsyncStorage.setItem('user', _id);
    navigation.navigate('Main', {user: _id});
  }

  return (
    // KeyboardavoidingView é configurado apenas para o ios
    <KeyboardAvoidingView
      behavior="padding"
      enabled={Platform.OS === 'ios'}
      style={styles.container}>
      <Image style={styles.image} source={logo} />
      <TextInput
        placeholder="Digite seu usuário do github"
        style={styles.input}
        placeholderTextColor="#999"
        value={user}
        onChangeText={setUser}
      />
      <TouchableOpacity onPress={handlerLogin} style={styles.button}>
        <Text style={styles.textButon}>Enviar</Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#CC2EFA',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
  },
  image: {
    height: 35,
    resizeMode: 'contain',
  },
  input: {
    height: 46,
    alignSelf: 'stretch',
    backgroundColor: '#f5f5f5',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    marginTop: 20,
    paddingHorizontal: 15,
  },
  button: {
    height: 46,
    alignSelf: 'stretch',
    backgroundColor: '#BF00FF',
    borderRadius: 4,
    marginTop: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },

  textButon: {
    fontWeight: 'bold',
    color: '#fff',
    fontSize: 16,
  },
});
