import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  StyleSheet, 
  TouchableOpacity, 
  Switch,
  ScrollView,
  Alert
} from 'react-native';
import { saveProfileData, loadProfileData } from '../utils/storage';

const ProfileScreen = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [bio, setBio] = useState('');
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [theme, setTheme] = useState('light');

  // Load profile data when component mounts
  useEffect(() => {
    const fetchProfileData = async () => {
      const data = await loadProfileData();
      if (data) {
        setName(data.name || '');
        setEmail(data.email || '');
        setBio(data.bio || '');
        setNotificationsEnabled(data.notificationsEnabled || false);
        setTheme(data.theme || 'light');
      }
    };

    fetchProfileData();
  }, []);

  const handleSave = async () => {
    // Basic validation
    if (!name.trim()) {
      Alert.alert('Error', 'Name cannot be empty');
      return;
    }
    
    if (!email.trim()) {
      Alert.alert('Error', 'Email cannot be empty');
      return;
    }

    const profileData = {
      name,
      email,
      bio,
      notificationsEnabled,
      theme
    };
    
    const success = await saveProfileData(profileData);
    
    if (success) {
      Alert.alert('Success', 'Profile saved successfully');
    } else {
      Alert.alert('Error', 'Failed to save profile');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>User Profile</Text>
      
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Name</Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder="Enter your name"
        />
      </View>
      
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          placeholder="Enter your email"
          keyboardType="email-address"
        />
      </View>
      
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Bio</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={bio}
          onChangeText={setBio}
          placeholder="Tell us about yourself"
          multiline
          numberOfLines={4}
        />
      </View>
      
      <View style={styles.switchContainer}>
        <Text style={styles.label}>Enable Notifications</Text>
        <Switch
          value={notificationsEnabled}
          onValueChange={setNotificationsEnabled}
          trackColor={{ false: "#767577", true: "#81b0ff" }}
          thumbColor={notificationsEnabled ? "#3498db" : "#f4f3f4"}
        />
      </View>
      
      <View style={styles.radioGroup}>
        <Text style={styles.label}>Theme</Text>
        <View style={styles.radioButtons}>
          <TouchableOpacity
            style={[
              styles.radioButton,
              theme === 'light' && styles.radioButtonSelected
            ]}
            onPress={() => setTheme('light')}
          >
            <Text>Light</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.radioButton,
              theme === 'dark' && styles.radioButtonSelected
            ]}
            onPress={() => setTheme('dark')}
          >
            <Text>Dark</Text>
          </TouchableOpacity>
        </View>
      </View>
      
      <TouchableOpacity
        style={styles.saveButton}
        onPress={handleSave}
      >
        <Text style={styles.saveButtonText}>Save</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    fontWeight: '500',
  },
  input: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  radioGroup: {
    marginBottom: 20,
  },
  radioButtons: {
    flexDirection: 'row',
    marginTop: 5,
  },
  radioButton: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    padding: 10,
    marginRight: 10,
    minWidth: 80,
    alignItems: 'center',
  },
  radioButtonSelected: {
    backgroundColor: '#e0e0ff',
    borderColor: '#3498db',
  },
  saveButton: {
    backgroundColor: '#3498db',
    borderRadius: 5,
    padding: 15,
    alignItems: 'center',
    marginTop: 10,
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ProfileScreen;