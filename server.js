const { server } = require("./app");
const { connectDatabase } = require("./config/database");
const WebSocket = require('ws');
const Chat = require('./models/chat'); // Import your Chat model
const mongoose = require('mongoose');

// Connect to the database
connectDatabase();

// Create a WebSocket server
const wss = new WebSocket.Server({ server });
// WebSocket connection handler
wss.on('connection', (ws) => {
  console.log('New client connected');

  // Handle incoming messages
  ws.on('message', async (message) => {
    // Convert the buffer to a string
    const data = message.toString();
    console.log('Received message:', data);

    try {
      // Create a new Chat document
      const chat = new Chat({
        chats: [{
          participant_id: new mongoose.Types.ObjectId(), 
          message: data,
          timestamp: new Date(),
        }]
      });

      // Save the new chat document
      const savedChat = await chat.save();
      console.log('Chat saved:', savedChat);
      
      // Echo the received message back to the client
      ws.send('Thanks for your message!');
    } catch (error) {
      console.error('Error saving chat to database:', error);
      // Send an error message back to the client
      ws.send('Error saving chat to database');
    }
  });

  // Handle client disconnection
  ws.on('close', () => {
    console.log('Client disconnected');
  });
});

// Start the server
server.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});
