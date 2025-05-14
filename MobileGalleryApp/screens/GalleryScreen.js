import React from 'react';
import { View, Text, FlatList, Image, StyleSheet, TouchableOpacity } from 'react-native';

// Sample image data
const imageData = [
  { id: '1', title: 'Mountain View', uri: 'https://picsum.photos/id/10/200' },
  { id: '2', title: 'Beach Sunset', uri: 'https://picsum.photos/id/11/200' },
  { id: '3', title: 'Forest Path', uri: 'https://picsum.photos/id/12/200' },
  { id: '4', title: 'City Skyline', uri: 'https://picsum.photos/id/13/200' },
  { id: '5', title: 'Desert Landscape', uri: 'https://picsum.photos/id/14/200' },
  { id: '6', title: 'Snow Mountain', uri: 'https://picsum.photos/id/15/200' },
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