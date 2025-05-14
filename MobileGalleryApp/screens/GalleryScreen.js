import React from 'react';
import { View, Text, FlatList, Image, StyleSheet, TouchableOpacity } from 'react-native';

// Sample image data with direct image URLs
const imageData = [
  { 
    id: '1', 
    title: 'Vietnam Mountain', 
    uri: 'https://static.vinwonders.com/production/mountains-in-Vietnam-banner.jpg' 
  },
  { 
    id: '2', 
    title: 'Bai Nhat Beach', 
    uri: 'https://as2.ftcdn.net/jpg/01/58/66/33/1000_F_158663327_AXsbdZPyfF8OJgb6XAIbFk8PgszjQJsQ.jpg' 
  },
  { 
    id: '3', 
    title: 'Nam Cat Tien National Park', 
    uri: 'https://wander-lush.org/wp-content/uploads/2020/07/Vietnam-National-Parks-Nam-Cat-Tien.jpg' 
  },
  { 
    id: '4', 
    title: 'Ho Chi Minh Skyline', 
    uri: 'https://media.istockphoto.com/id/171588234/photo/ho-chi-minh-city-skyline.jpg?s=612x612&w=0&k=20&c=jmTldJx6U6hgmw2mO_qjYEr1Ur97sXh0cnB448hI-qg=' 
  },
];

const GalleryScreen = ({ navigation }) => {
  const handleImagePress = (item) => {
    navigation.navigate('Viewer', { image: item });
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.imageContainer}
      onPress={() => handleImagePress(item)}
    >
      <Image
        source={{ uri: item.uri }}
        style={styles.thumbnail}
      />
      <Text style={styles.imageTitle}>{item.title}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={imageData}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        numColumns={2}
        contentContainerStyle={styles.list}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  list: {
    padding: 8,
  },
  imageContainer: {
    flex: 1,
    margin: 8,
    backgroundColor: 'white',
    borderRadius: 8,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1,
  },
  thumbnail: {
    width: '100%',
    height: 150,
    resizeMode: 'cover',
  },
  imageTitle: {
    padding: 10,
    fontSize: 14,
    textAlign: 'center',
  },
});

export default GalleryScreen;