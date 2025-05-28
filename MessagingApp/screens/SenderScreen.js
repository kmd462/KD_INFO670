import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator
} from 'react-native';
import axios from 'axios';

const API_BASE_URL = 'http://10.0.2.2:8000';

const SenderScreen = ({ navigation }) => {
  const [sender, setSender] = useState('');
  const [recipient, setRecipient] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!sender.trim()) {
      Alert.alert('Error', 'Please enter your username');
      return;
    }
    
    if (!recipient.trim()) {
      Alert.alert('Error', 'Please enter recipient username');
      return;
    }
    
    if (!message.trim()) {
      Alert.alert('Error', 'Please enter a message');
      return;
    }

    setLoading(true);
    
    try {
      const response = await axios.post(
        `${API_BASE_URL}/sendMessage.php`,
        {
          sender: sender.trim(),
          recipient: recipient.trim(),
          message: message.trim()
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
          timeout: 10000
        }
      );

      if (response.data.success) {
        Alert.alert(
          'Success', 
          'Message sent successfully!',
          [
            {
              text: 'OK',
              onPress: () => {
                setMessage('');
              }
            }
          ]
        );
      } else {
        Alert.alert('Error', response.data.error || 'Failed to send message');
      }
    } catch (error) {
      console.error('Send message error:', error);
      
      let errorMessage = 'Failed to send message. ';
      
      if (error.code === 'ECONNABORTED') {
        errorMessage += 'Request timed out.';
      } else if (error.response) {
        errorMessage += error.response.data?.error || 'Server error.';
      } else if (error.request) {
        errorMessage += 'Cannot connect to server. Make sure the server is running.';
      } else {
        errorMessage += error.message;
      }
      
      Alert.alert('Error', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView 
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.formContainer}>
          <Text style={styles.title}>Send a Message</Text>
          
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Your Username:</Text>
            <TextInput
              style={styles.input}
              value={sender}
              onChangeText={setSender}
              placeholder="Enter your username"
              autoCapitalize="none"
              autoCorrect={false}
              returnKeyType="next"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Recipient Username:</Text>
            <TextInput
              style={styles.input}
              value={recipient}
              onChangeText={setRecipient}
              placeholder="Enter recipient username"
              autoCapitalize="none"
              autoCorrect={false}
              returnKeyType="next"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Message:</Text>
            <TextInput
              style={[styles.input, styles.messageInput]}
              value={message}
              onChangeText={setMessage}
              placeholder="Type your message here..."
              multiline
              numberOfLines={4}
              textAlignVertical="top"
              returnKeyType="send"
            />
          </View>

          <TouchableOpacity 
            style={[styles.button, styles.primaryButton, loading && styles.buttonDisabled]} 
            onPress={sendMessage}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Send Message</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.button, styles.secondaryButton]} 
            onPress={() => navigation.navigate('Receiver')}
          >
            <Text style={styles.buttonText}>Go to Inbox</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  formContainer: {
    padding: 20,
    maxWidth: 500,
    width: '100%',
    alignSelf: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
    color: '#333',
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#333',
  },
  messageInput: {
    height: 100,
    textAlignVertical: 'top',
    paddingTop: 12,
  },
  button: {
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  primaryButton: {
    backgroundColor: '#007AFF',
  },
  secondaryButton: {
    backgroundColor: '#666',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default SenderScreen;