import AsyncStorage from '@react-native-async-storage/async-storage';

// Save profile data to local storage
export const saveProfileData = async (profileData) => {
  try {
    const jsonValue = JSON.stringify(profileData);
    await AsyncStorage.setItem('@user_profile', jsonValue);
    return true;
  } catch (error) {
    console.error('Error saving profile data:', error);
    return false;
  }
};

// Load profile data from local storage
export const loadProfileData = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem('@user_profile');
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (error) {
    console.error('Error loading profile data:', error);
    return null;
  }
};