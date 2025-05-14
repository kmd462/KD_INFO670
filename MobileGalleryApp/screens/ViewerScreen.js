import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const ViewerScreen = ({ route, navigation }) => {
  // Get the image from navigation params, or use a default if none provided
  const { image } = route.params || { 
    image: { uri: 'https://picsum.photos/id/10/500', title: 'Default Image' }
  };

  return (
    <View style={styles.container}>
      <Image source={{ uri: image.uri }} style={styles.fullImage} />
      <Text style={styles.imageTitle}>{image.title}</Text>
      
      <TouchableOpacity 
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Ionicons name="arrow-back" size={24} color="white" />
        <Text style={styles.backButtonText}>Back</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullImage: {
    width: '100%',
    height: '70%',
    resizeMode: 'contain',
  },
  imageTitle: {
    color: 'white',
    fontSize: 18,
    marginTop: 20,
    fontWeight: 'bold',
  },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  backButtonText: {
    color: 'white',
    fontSize: 16,
    marginLeft: 5,
  },
});

export default ViewerScreen;