import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Button,
  FlatList,
  TouchableOpacity,
  Alert,
  SafeAreaView,
  StatusBar,
} from 'react-native';

export default function App() {
  const [item, setItem] = useState('');
  const [quantity, setQuantity] = useState('');
  const [groceryItems, setGroceryItems] = useState([]);
  const [editIndex, setEditIndex] = useState(-1);

  // Add a new grocery item to the list
  const addItem = () => {
    if (item.trim().length === 0) {
      // Error handling for empty input
      Alert.alert('Error', 'Please enter an item name');
      return;
    }

    if (editIndex !== -1) {
      // Edit existing item
      const updatedItems = [...groceryItems];
      updatedItems[editIndex] = { 
        id: updatedItems[editIndex].id,
        name: item, 
        quantity: quantity || '1',
        purchased: updatedItems[editIndex].purchased 
      };
      setGroceryItems(updatedItems);
      setEditIndex(-1);
    } else {
      // Add new item with unique ID
      setGroceryItems([...groceryItems, { 
        id: Date.now().toString(), 
        name: item, 
        quantity: quantity || '1',
        purchased: false 
      }]);
    }
    
    // Clear input after adding/editing
    setItem('');
    setQuantity('');
  };

  // Delete an item from the list
  const deleteItem = (id) => {
    setGroceryItems(groceryItems.filter(item => item.id !== id));
  };

  // Start editing an item
  const editItem = (id, name, quantity) => {
    const index = groceryItems.findIndex(item => item.id === id);
    setEditIndex(index);
    setItem(name);
    setQuantity(quantity);
  };

  // Toggle purchased status of an item
  const togglePurchased = (id) => {
    setGroceryItems(
      groceryItems.map(item => 
        item.id === id 
          ? { ...item, purchased: !item.purchased } 
          : item
      )
    );
  };
  
  // Render individual grocery item
  const renderItem = ({ item }) => (
    <View style={styles.groceryItem}>
      <TouchableOpacity 
        style={styles.itemTextContainer}
        onPress={() => togglePurchased(item.id)}
      >
        <Text 
          style={[
            styles.itemName, 
            item.purchased && styles.purchasedItem
          ]}
        >
          {item.name}
        </Text>
        <Text style={styles.itemQuantity}>
          Qty: {item.quantity}
        </Text>
      </TouchableOpacity>
      
      <View style={styles.itemButtons}>
        <TouchableOpacity 
          style={[styles.button, styles.editButton]}
          onPress={() => editItem(item.id, item.name, item.quantity)}
        >
          <Text style={styles.buttonText}>Edit</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.button, styles.deleteButton]}
          onPress={() => deleteItem(item.id)}
        >
          <Text style={styles.buttonText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.header}>
        <Text style={styles.title}>My Grocery List</Text>
        <Text style={styles.subtitle}>
          Happy Shopping!
        </Text>
      </View>

      <View style={styles.inputContainer}>
        <View style={styles.inputWrapper}>
          <TextInput
            style={styles.itemInput}
            placeholder="Item name"
            value={item}
            onChangeText={setItem}
          />
          <TextInput
            style={styles.quantityInput}
            placeholder="Qty"
            value={quantity}
            onChangeText={setQuantity}
            keyboardType="numeric"
          />
        </View>
        <Button 
          title={editIndex !== -1 ? "Update" : "Add"} 
          onPress={addItem} 
          color="#2E7D32"
        />
      </View>
      
      <View style={styles.listContainer}>
        <View style={styles.listHeader}>
          <Text style={styles.listTitle}>
            Shopping List
          </Text>
          <Text style={styles.itemCount}>
            {groceryItems.length} items
          </Text>
        </View>
        
        {groceryItems.length > 0 ? (
          <FlatList
            data={groceryItems}
            renderItem={renderItem}
            keyExtractor={item => item.id}
            style={styles.list}
          />
        ) : (
          <Text style={styles.emptyText}>
            Your shopping list is empty. Add some items to get started!
          </Text>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  header: {
    padding: 20,
    backgroundColor: '#F5DD98',
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'black',
  },
  subtitle: {
    fontSize: 16,
    color: 'black',
    marginTop: 5,
  },
  inputContainer: {
    padding: 15,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  inputWrapper: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  itemInput: {
    flex: 3,
    height: 40,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 4,
    marginRight: 10,
    paddingHorizontal: 10,
  },
  quantityInput: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 4,
    paddingHorizontal: 10,
    textAlign: 'center',
  },
  listContainer: {
    flex: 1,
    padding: 15,
  },
  listHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  listTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  itemCount: {
    fontSize: 16,
    color: '#666',
  },
  list: {
    flex: 1,
  },
  groceryItem: {
    flexDirection: 'row',
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
  },
  itemTextContainer: {
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    fontWeight: '500',
  },
  itemQuantity: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  purchasedItem: {
    textDecorationLine: 'line-through',
    color: '#888',
  },
  itemButtons: {
    flexDirection: 'row',
  },
  button: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 4,
    marginLeft: 8,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 12,
  },
  editButton: {
    backgroundColor: '#1976D2',
  },
  deleteButton: {
    backgroundColor: '#D32F2F',
  },
  emptyText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#888',
    marginTop: 30,
  },
});