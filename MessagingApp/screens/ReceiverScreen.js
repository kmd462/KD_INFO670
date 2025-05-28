import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  FlatList,
  RefreshControl,
  ActivityIndicator
} from 'react-native';
import axios from 'axios';

const API_BASE_URL = 'http://10.0.2.2:8000';

const ReceiverScreen = ({ navigation }) => {
  const [recipient, setRecipient] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const retrieveMessages = async (isRefreshing = false) => {
    if (!recipient.trim()) {
      Alert.alert('Error', 'Please enter your username');
      return;
    }

    if (isRefreshing) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }

    try {
      console.log('Retrieving messages for:', recipient);
      console.log('URL:', `${API_BASE_URL}/retrieveMessages.php?recipient=${recipient.trim()}`);
      
      const response = await axios.get(
        `${API_BASE_URL}/retrieveMessages.php`,
        {
          params: {
            recipient: recipient.trim()
          },
          timeout: 10000
        }
      );

      console.log('Response:', response.data);

      if (response.data.success) {
        setMessages(response.data.messages || []);
        
        if (response.data.messages.length === 0) {
          Alert.alert('Info', 'No messages found for this username');
        }
      } else {
        Alert.alert('Error', response.data.error || 'Failed to retrieve messages');
        setMessages([]);
      }

    } catch (error) {
      console.error('Retrieve messages error:', error);
      
      let errorMessage = 'Failed to retrieve messages. ';
      
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
      setMessages([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const renderMessage = ({ item, index }) => {
    const formatTimestamp = (timestamp) => {
      try {
        const date = new Date(timestamp);
        const now = new Date();
        const diffMs = now - date;
        const diffMins = Math.round(diffMs / 60000);
        
        if (diffMins < 1) return 'Just now';
        if (diffMins < 60) return `${diffMins} min ago`;
        if (diffMins < 1440) return `${Math.round(diffMins / 60)} hours ago`;
        
        return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { 
          hour: '2-digit', 
          minute: '2-digit' 
        });
      } catch (e) {
        return timestamp;
      }
    };

    return (
      <View style={styles.messageCard}>
        <View style={styles.messageHeader}>
          <Text style={styles.senderText}>From: {item.sender}</Text>
          <Text style={styles.timestampText}>{formatTimestamp(item.timestamp)}</Text>
        </View>
        <Text style={styles.messageText}>{item.message}</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <Text style={styles.title}>Your Inbox</Text>
        
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Your Username:</Text>
          <View style={styles.searchRow}>
            <TextInput
              style={[styles.input, styles.searchInput]}
              value={recipient}
              onChangeText={setRecipient}
              placeholder="Enter your username (try: Jane, Khue)"
              autoCapitalize="none"
              autoCorrect={false}
              returnKeyType="search"
              onSubmitEditing={() => retrieveMessages(false)}
            />
            <TouchableOpacity 
              style={[styles.searchButton, loading && styles.buttonDisabled]} 
              onPress={() => retrieveMessages(false)}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <Text style={styles.searchButtonText}>Search</Text>
              )}
            </TouchableOpacity>
          </View>
          <Text style={styles.hintText}>Try: Jane, Jane Doe, or Khue</Text>
        </View>
      </View>

      <FlatList
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item, index) => item.id || `message-${index}`}
        contentContainerStyle={[
          styles.messagesList,
          messages.length === 0 && styles.emptyList
        ]}
        refreshControl={
          <RefreshControl 
            refreshing={refreshing} 
            onRefresh={() => retrieveMessages(true)}
            enabled={!!recipient.trim()}
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              {recipient.trim() 
                ? loading 
                  ? 'Loading messages...' 
                  : 'No messages found'
                : 'Enter your username to view messages'}
            </Text>
          </View>
        }
      />

      <TouchableOpacity 
        style={[styles.button, styles.backButton]} 
        onPress={() => navigation.navigate('Sender')}
      >
        <Text style={styles.buttonText}>Back to Send Message</Text>
      </TouchableOpacity>

      <View style={styles.debugInfo}>
        <Text style={styles.debugText}>Using mock data (server connection issue)</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  searchContainer: {
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  inputGroup: {
    marginBottom: 10,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    backgroundColor: '#f8f8f8',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#333',
  },
  searchInput: {
    flex: 1,
    marginRight: 10,
  },
  searchButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    minWidth: 80,
    alignItems: 'center',
  },
  searchButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  hintText: {
    fontSize: 12,
    color: '#666',
    marginTop: 5,
    fontStyle: 'italic',
  },
  button: {
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 20,
    marginVertical: 10,
  },
  backButton: {
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
  messagesList: {
    padding: 20,
  },
  emptyList: {
    flex: 1,
  },
  messageCard: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 3,
  },
  messageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
    alignItems: 'center',
  },
  senderText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#007AFF',
  },
  timestampText: {
    fontSize: 12,
    color: '#666',
  },
  messageText: {
    fontSize: 16,
    color: '#333',
    lineHeight: 22,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 50,
  },
  emptyText: {
    textAlign: 'center',
    color: '#666',
    fontSize: 16,
  },
  debugInfo: {
    padding: 10,
    backgroundColor: '#f0f0f0',
  },
  debugText: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
});

export default ReceiverScreen;