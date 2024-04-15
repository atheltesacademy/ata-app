// const { server } = require("./app");
// const { connectDatabase } = require("./config/database");
// const WebSocket = require('ws');
// const Chat = require('./models/chat');// Import your Chat model
// const mongoose = require('mongoose');

// // Connect to the database
// connectDatabase();

// // Create a WebSocket server
// const wss = new WebSocket.Server({ server });

// // Map to store client connections and their IDs
// const clients = new Map();

// // WebSocket connection handler
// wss.on('connection', (ws) => {
//   console.log('New client connected');
  
//   // Generate a unique ID for the client
//   const clientId = generateClientId();

//   // Store the client connection and its ID
//   clients.set(ws, clientId);

//   // Handle incoming messages
//   ws.on('message', async (message) => {
//     // Convert the buffer to a string
//     const data = message.toString();
//     console.log('Received message:', data);

//     try {
//       // Find or create chat document based on participant IDs
//       let chat = await Chat.findOne({ 'chats.participant_id': { $in: [clientId, ...clients.values()] } });

//       if (!chat) {
//         // If no chat exists, create a new one
//         chat = new Chat({
//           chats: [{
//             participant_id: clientId,
//             messages: [], // Initialize messages array
//             timestamp: new Date(),
//           }]
//         });
//       }

//       // Update existing chat document with new message
//       chat.chats[0].messages.push({
//         participant_id: clientId,
//         message: data,
//         timestamp: new Date(),
//       });

//       // Save the updated/created chat document
//       const savedChat = await chat.save();
//       console.log('Chat saved:', savedChat);

//       // Broadcast the message to all clients except the sender
//       broadcastMessage(ws, data);
//     } catch (error) {
//       console.error('Error saving chat to database:', error);
//       // Send an error message back to the client
//       ws.send('Error saving chat to database');
//     }
//   });
// });

// // Function to generate a unique client ID
// function generateClientId() {
//   return new mongoose.Types.ObjectId();
// }

// // Function to broadcast message to all clients except the sender
// function broadcastMessage(sender, message) {
//   clients.forEach((clientId, client) => {
//     if (client !== sender && client.readyState === WebSocket.OPEN) {
//       client.send(message);
//     }
//   });
// }

// // Start the server
// server.listen(process.env.PORT, () => {
//   console.log(`Server running on port ${process.env.PORT}`);
// });
const { server } = require("./app");
const { connectDatabase } = require("./config/database");
const socketIO = require('socket.io');
const Chat = require('./models/chat');// Import your Chat model
const mongoose = require('mongoose');

// Connect to the database
connectDatabase();

// Create a Socket.IO server
const io = socketIO(server);

// Map to store client connections and their IDs
const clients = new Map();

// Socket.IO connection handler
io.on('connection', (socket) => {
  console.log('New client connected');
  
  // Generate a unique ID for the client
  const clientId = generateClientId();

  // Store the client connection and its ID
  clients.set(socket, clientId);

  // Handle incoming messages
  socket.on('message', async (data) => {
    console.log('Received message:', data);

    try {
      // Find or create chat document based on participant IDs
      let chat = await Chat.findOne({ 'chats.participant_id': { $in: [clientId, ...clients.values()] } });

      if (!chat) {
        // If no chat exists, create a new one
        chat = new Chat({
          chats: [{
            participant_id: clientId,
            messages: [], // Initialize messages array
            timestamp: new Date(),
          }]
        });
      }

      // Update existing chat document with new message
      chat.chats[0].messages.push({
        participant_id: clientId,
        message: data,
        timestamp: new Date(),
      });

      // Save the updated/created chat document
      const savedChat = await chat.save();
      console.log('Chat saved:', savedChat);

      // Broadcast the message to all clients except the sender
      socket.broadcast.emit('message', data);
    } catch (error) {
      console.error('Error saving chat to database:', error);
      // Send an error message back to the client
      socket.emit('error', 'Error saving chat to database');
    }
  });
});

// Function to generate a unique client ID
function generateClientId() {
  return new mongoose.Types.ObjectId().toString();
}

// Start the server
server.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});
