const express = require('express');
const cors = require('cors');
const fs = require('fs').promises;
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

const messagesDir = path.join(__dirname, 'messages');

// Ensure messages directory exists
fs.mkdir(messagesDir, { recursive: true }).catch(console.error);

// Send message endpoint (keeping .php in the route for compatibility)
app.post('/sendMessage.php', async (req, res) => {
    try {
        const { sender, recipient, message } = req.body;
        
        if (!sender || !recipient || !message) {
            return res.status(400).json({ 
                success: false, 
                error: 'Missing required fields' 
            });
        }
        
        const messageData = {
            id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            sender: sender.trim(),
            recipient: recipient.trim(),
            message: message.trim(),
            timestamp: new Date().toISOString()
        };
        
        const filename = path.join(messagesDir, `${recipient}.json`);
        let messages = [];
        
        try {
            const data = await fs.readFile(filename, 'utf8');
            messages = JSON.parse(data);
        } catch (err) {
            // File doesn't exist yet, which is fine
        }
        
        messages.unshift(messageData);
        messages = messages.slice(0, 100); // Keep only last 100 messages
        
        await fs.writeFile(filename, JSON.stringify(messages, null, 2));
        
        console.log(`Message sent from ${sender} to ${recipient}`);
        
        res.json({ 
            success: true, 
            message: 'Message sent successfully', 
            messageId: messageData.id 
        });
    } catch (error) {
        console.error('Error in sendMessage:', error);
        res.status(400).json({ 
            success: false, 
            error: error.message 
        });
    }
});

// Retrieve messages endpoint
app.get('/retrieveMessages.php', async (req, res) => {
    try {
        const { recipient } = req.query;
        
        if (!recipient || recipient.trim() === '') {
            return res.status(400).json({ 
                success: false, 
                error: 'Recipient parameter is required' 
            });
        }
        
        const filename = path.join(messagesDir, `${recipient.trim()}.json`);
        
        try {
            const data = await fs.readFile(filename, 'utf8');
            const messages = JSON.parse(data);
            
            console.log(`Retrieved ${messages.length} messages for ${recipient}`);
            
            res.json({ 
                success: true, 
                messages: messages 
            });
        } catch (err) {
            // No messages file exists for this user
            console.log(`No messages found for ${recipient}`);
            res.json({ 
                success: true, 
                messages: [] 
            });
        }
    } catch (error) {
        console.error('Error in retrieveMessages:', error);
        res.status(400).json({ 
            success: false, 
            error: error.message 
        });
    }
});

// Test endpoint
app.get('/', (req, res) => {
    res.json({ 
        status: 'Server is running!',
        endpoints: {
            sendMessage: 'POST /sendMessage.php',
            retrieveMessages: 'GET /retrieveMessages.php?recipient=username'
        }
    });
});

const PORT = 8000;
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
    console.log(`Test the API at http://localhost:${PORT}/`);
});