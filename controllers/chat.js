// Import required modules
const Chat = require('../models/chat');
const Athlete = require('../models/athlete');
const Coach = require('../models/coach');
const socketIO = require('socket.io');
const socketIOClient = require('socket.io-client');

// Initialize connectedClients as an object
const connectedClients = {};

// Function to handle incoming messages from clients and store them in the database
exports.createChat = async (req, res) => {
    try {
        const { athlete_id, coach_id, message } = req.body;

        // Fetch athlete and coach records from the database
        const athlete = await Athlete.findById(athlete_id);
        const coach = await Coach.findById(coach_id);

        if (!athlete || !coach) {
            return res.status(404).json({ success: false, message: 'Athlete or coach not found' });
        }

        // Create or find the chat document based on both athlete and coach IDs
        let chat = await Chat.findOneAndUpdate(
            {
                $or: [
                    { athlete_id, coach_id },
                    { athlete_id: coach_id, coach_id: athlete_id }
                ]
            },
            {},
            { upsert: true, new: true, setDefaultsOnInsert: true }
        );

        // Verify if chat object is properly initialized
        if (!chat || !chat.messages) {
            throw new Error('Failed to retrieve chat object from database or missing messages array.');
        }

        // Determine the sender based on the current participants' IDs
        const senderId = athlete_id === athlete._id.toString() ? athlete_id : coach_id;

        // Determine the recipient based on the sender
        const recipientId = senderId === athlete_id ? coach_id : athlete_id;

        // Add the new message to the messages array
        chat.messages.push({
            sender_id: senderId,
            text: message,
            timestamp: new Date() // Add timestamp when adding the message
        });

        // Save the chat document
        await chat.save();
        console.log('Chat saved:', chat);

        // Send the message to the recipient
        sendChatMessage(senderId, recipientId, {
            type: 'chat',
            chat_id: chat._id,
            message: message,
            timestamp: chat.messages[chat.messages.length - 1].timestamp // Get the timestamp of the last message
        });

        res.status(201).json({ success: true, chat });
    } catch (error) {
        console.error('Error creating chat:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};
// Function to send chat messages to recipients
function sendChatMessage(senderId, recipientId, data) {
    const recipientSocket = connectedClients[recipientId];

    // If recipient socket connection is available, send the message
    if (recipientSocket) {
        recipientSocket.emit('message', { ...data, athlete_id: senderId, coach_id: recipientId });
    } else {
        console.log(`Recipient ${recipientId} socket connection not found, attempting to authenticate...`);
        
        // Authenticate the recipient and establish socket connection
        const recipientSocket = socketIOClient.connect('http://localhost:4000'); // Update with your server address
        recipientSocket.emit('authenticate', recipientId);

        recipientSocket.on('connect', () => {
            console.log(`Recipient ${recipientId} socket connection established`);
            connectedClients[recipientId] = recipientSocket;
            recipientSocket.emit('message', { ...data, athlete_id: senderId, coach_id: recipientId });
        });

        recipientSocket.on('error', (error) => {
            console.error(`Error establishing socket connection for recipient ${recipientId}:`, error);
        });
    }
}
// // Import required modules
// const Chat = require('../models/chat');
// const Athlete = require('../models/athlete');
// const Coach = require('../models/coach');
// const WebSocket = require('ws');

// // Initialize connectedClients as an object
// const connectedClients = {};

// // Function to handle incoming messages from clients and store them in the database
// exports.createChat = async (req, res) => {
//     try {
//         const { athlete_id, coach_id, message } = req.body;

//         // Fetch athlete and coach records from the database
//         const athlete = await Athlete.findById(athlete_id);
//         const coach = await Coach.findById(coach_id);

//         if (!athlete || !coach) {
//             return res.status(404).json({ success: false, message: 'Athlete or coach not found' });
//         }

//         // Create or find the chat document based on both athlete and coach IDs
//         let chat = await Chat.findOneAndUpdate(
//             {
//                 $or: [
//                     { athlete_id, coach_id },
//                     { athlete_id: coach_id, coach_id: athlete_id }
//                 ]
//             },
//             {},
//             { upsert: true, new: true, setDefaultsOnInsert: true }
//         );

//         // Verify if chat object is properly initialized
//         if (!chat || !chat.messages) {
//             throw new Error('Failed to retrieve chat object from database or missing messages array.');
//         }

//         // Determine the sender based on the current participants' IDs
//         const senderId = athlete_id === athlete._id.toString() ? athlete_id : coach_id;

//         // Determine the recipient based on the sender
//         const recipientId = senderId === athlete_id ? coach_id : athlete_id;

//         // Add the new message to the messages array
//         chat.messages.push({
//             sender_id: senderId,
//             text: message,
//             timestamp: new Date() // Add timestamp when adding the message
//         });

//         // Save the chat document
//         await chat.save();
//         console.log('Chat saved:', chat);

//         // Send the message to the recipient
//         sendChatMessage(senderId, recipientId, {
//             type: 'chat',
//             chat_id: chat._id,
//             message: message,
//             timestamp: chat.messages[chat.messages.length - 1].timestamp // Get the timestamp of the last message
//         });

//         res.status(201).json({ success: true, chat });
//     } catch (error) {
//         console.error('Error creating chat:', error);
//         res.status(500).json({ success: false, message: 'Internal server error' });
//     }
// };

// // Function to send chat messages to recipients
// function sendChatMessage(senderId, recipientId, data) {
//     const recipientClient = connectedClients[recipientId];

//     // If recipient WebSocket connection is available, send the message
//     if (recipientClient && recipientClient.readyState === WebSocket.OPEN) {
//         recipientClient.send(JSON.stringify(data));
//     } else {
//         // Recipient WebSocket connection not found or not open, open a new WebSocket connection
//         console.log(`Recipient ${recipientId} WebSocket connection is not open or not found, opening new connection...`);
        
//         // Assuming WebSocket server is running on port ..
//         const newClient = new WebSocket('http://localhost:4000');

//         // Handle new WebSocket connection events
//         newClient.on('open', () => {
//             console.log(`New WebSocket connection established for ${recipientId}`);
//             connectedClients[recipientId] = newClient;
//             newClient.send(JSON.stringify(data)); // Send the message
//         });

//         newClient.on('error', (error) => {
//             console.error(`Error establishing WebSocket connection for ${recipientId}:`, error);
//         });
//     }
// }

// // Initialize connectedClients as a Map
// const connectedClients = new Map();
// exports.createChat = async (req, res) => {
//     try {
//         const { athlete_id, coach_id, message } = req.body;

//         // Fetch athlete and coach records from the database
//         const athlete = await Athlete.findById(athlete_id);
//         const coach = await Coach.findById(coach_id);

//         if (!athlete || !coach) {
//             return res.status(404).json({ success: false, message: 'Athlete or coach not found' });
//         }

//         // Find or create the chat document based on both athlete and coach IDs
//         let chat = await Chat.findOne({
//             $or: [
//                 { athlete_id: athlete_id, coach_id: coach_id },
//                 { athlete_id: coach_id, coach_id: athlete_id }
//             ]
//         });

//         if (!chat) {
//             // If no chat exists, create a new one
//             chat = new Chat({
//                 athlete_id: athlete_id,
//                 coach_id: coach_id,
//                 messages: [] // Initialize messages array
//             });
//         }

//         // Determine the sender based on the current participants' IDs
//         const sender_id = athlete_id === athlete._id.toString() ? athlete_id : coach_id;

//         // Determine the recipient based on the sender
//         const recipient_id = sender_id === athlete_id ? coach_id : athlete_id;

//         // Add the new message to the messages array
//         chat.messages.push({
//             sender_id: sender_id,
//             text: message
//         });

//         // Save the chat document
//         await chat.save();
//         console.log('Chat saved:', chat);

//         // Send the message to the recipient
//         sendChatMessage(sender_id, recipient_id, {
//             type: 'chat',
//             chat_id: chat._id,
//             message: message,
//             timestamp: chat.messages.slice(-1)[0].timestamp // Get the timestamp of the last message
//         });

//         res.status(201).json({ success: true, chat });
//     } catch (error) {
//         console.error('Error creating chat:', error);
//         res.status(500).json({ success: false, message: 'Internal server error' });
//     }
// };

// function sendChatMessage(senderId, recipientId, data) {
//     if (connectedClients.has(recipientId)) {
//         const recipientClient = connectedClients.get(recipientId);
//         if (recipientClient.readyState === WebSocket.OPEN) {
//             recipientClient.send(JSON.stringify(data));
//         }
//     }
// }

// Get all history chats for coaches
exports.getCoachChats = async (req, res) => {
    try {
        const coach_id = req.params.coach_id;
        const chat = await Chat.find({ participant_id: coach_id }); // Use ChatHistory instead of chatHistory
        res.status(200).json({ success: true, chat });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
// Get all history chats for an athlete
exports.getAthleteChats = async (req, res) => {
    try {
        const athlete_id = req.params.athlete_id;
        const chat = await Chat.find({ participant_id: athlete_id }); // Use ChatHistory instead of chatHistory
        res.status(200).json({ success: true, chat });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get all chats
exports.getAllChats = async (req, res) => {
    try {
        const chats = await Chat.find();
        res.status(200).json({ success: true, chats });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get chat by ID
exports.getChatById = async (req, res) => {
    try {
        const chat = await Chat.findById(req.params.id);
        if (!chat) {
            return res.status(404).json({ success: false, message: 'Chat not found' });
        }
        res.status(200).json({ success: true, chat });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
// Delete chat by ID
exports.deleteChatById = async (req, res) => {
    try {
        const chat = await Chat.findByIdAndDelete(req.params.id);
        if (!chat) {
            return res.status(404).json({ success: false, message: 'Chat not found' });
        }
        res.status(200).json({ success: true, message: 'Chat deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
