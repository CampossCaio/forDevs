/* eslint-disable prettier/prettier */
import React, {useEffect, useState} from 'react';

import {
  Text,
  View,
  Image,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import logo from '../assets/logo.png';
import like from '../assets/like.png';
import dislike from '../assets/dislike.png';
import api from '../services/api';
import AsyncStorage from '@react-native-community/async-storage';

export default function Main({navigation}) {
  const id = navigation.getParam('user');
  const [users, setUsers] = useState([]);

  // È chamada sempre que o componente é carregado na tela
  useEffect(() => {
    async function loadUsers() {
      const response = await api.get('/devs', {
        headers: {
          user: id,
        },
      });

      setUsers(response.data);
    }

    loadUsers();
  }, [id]);

  async function handleLike() {
    const [user, ...rest] = users;
    await api.post(`/devs/${user._id}/likes`, null, {
      headers: {
        user: id,
      },
    });

    setUsers(rest);
  }

  async function handleDislike() {
    const [user, ...rest] = users;
    await api.post(`/devs/${user._id}/dislikes`, null, {
      headers: {
        user: id,
      },
    });

    setUsers(rest);
  }

  async function handlelogout() {
    await AsyncStorage.clear();

    navigation.navigate('Login');
  }

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity onPress={handlelogout}>
        <Image style={styles.image} source={logo} />
      </TouchableOpacity>

      <View style={styles.cardsContainer}>
        {users.length === 0
        ? <Text style={styles.empty}>Acabou :(</Text>
        : (
          users.map((user, index) => (
            <View
              key={user._id}
              style={[styles.card, {zIndex: users.length - index}]}>
              <Image
                style={styles.avatar}
                source={{
                  uri: user.avatar,
                }}
              />
              <View style={styles.footer}>
                <Text style={styles.name}>{user.name}</Text>
                <Text numberOfLines={3} style={styles.bio}>
                  {user.bio}
                </Text>
              </View>
            </View>
        ))
        )}
      </View>

      { users.length > 0 && (
        <View style={styles.buttonsContainer}>
        <TouchableOpacity style={styles.button} onPress={handleLike}>
          <Image source={like} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={handleDislike}>
          <Image source={dislike} />
        </TouchableOpacity>
      </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#CC2EFA',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  image: {
    height: 35,
    resizeMode: 'contain',
    marginTop: 30,
  },

  cardsContainer: {
    flex: 1,
    alignSelf: 'stretch', // Faz com que o elemento ocupe toda a largura.
    justifyContent: 'center',
    maxHeight: 500,
  },

  card: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    margin: 30,
    overflow: 'hidden', // Faz com que o borderRadius se aplique de dentro de um container.
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },

  avatar: {
    flex: 1,
    height: 300,
  },

  footer: {
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 15,
  },

  name: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },

  bio: {
    fontSize: 14,
    color: '#999',
    marginTop: 5,
    lineHeight: 18,
  },

  buttonsContainer: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    marginBottom: 30,
  },
  button: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 20,
    //Definindo sombra para dispositivo ANDROID.
    elevation: 2,
    //Defonindo sombra para dispositivo IOS
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 2,
    shadowOffset: {
      width: 0,
      height: 2,
    },
  },
  empty: {
    alignSelf: 'center',
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
});
