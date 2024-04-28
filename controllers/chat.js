const Chat = require('../models/chat');
const Athlete = require('../models/athlete');
const Coach = require('../models/coach');
const { io } = require('../app');

exports.createAndSendMessage = async (req, res) => {
    try {
        // Extract athlete_id, coach_id, message, and sender_role from the request body
        const { athlete_id, coach_id, message, sender_role } = req.body;

        // Check if athlete and coach exist in the database
        let athlete = await Athlete.findById(athlete_id);
        let coach = await Coach.findById(coach_id);

        // If athlete or coach doesn't exist, create them
        if (!athlete) {
            athlete = new Athlete({ _id: athlete_id });
            await athlete.save();
        }
        if (!coach) {
            coach = new Coach({ _id: coach_id });
            await coach.save();
        }

        // Find or create the chat document based on both athlete and coach IDs
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

        // Determine the sender based on the current participants' IDs and sender role
        let senderId;
        if (sender_role === 'athlete') {
            senderId = athlete_id;
        } else if (sender_role === 'coach') {
            senderId = coach_id;
        } else {
            throw new Error('Invalid sender role.');
        }

        // Add the new message to the messages array
        chat.messages.push({
            sender_id: senderId,
            text: message,
            timestamp: new Date()
        });

        // Save the chat document along with athlete and coach IDs
        chat.athlete_id = athlete_id;
        chat.coach_id = coach_id;
        await chat.save();

        // Emit the chat data to clients using Socket.IO
        if (io) {
            io.emit('new_chat', chat);
        }

        // Emit the message to the respective room
        if (io) {
            io.to(chat._id).emit('message_received', chat);
        }

        // Send the response with the created or updated chat instance along with athlete and coach IDs
        res.status(201).json({ success: true, chat });
    } catch (error) {
        // Handle errors
        console.error('Error creating chat or sending message:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};


// const Chat = require('../models/chat');
// const Athlete = require('../models/athlete');
// const Coach = require('../models/coach');
// const { io } = require('../app');

// exports.createChat = async (req, res) => {
//     try {
//         // Extract athlete_id, coach_id, and message from the request body
//         const { athlete_id, coach_id, message } = req.body;

//         // Check if athlete and coach exist in the database
//         let athlete = await Athlete.findById(athlete_id);
//         let coach = await Coach.findById(coach_id);

//         // If athlete or coach doesn't exist, create them
//         if (!athlete) {
//             athlete = new Athlete({ _id: athlete_id });
//             await athlete.save();
//         }
//         if (!coach) {
//             coach = new Coach({ _id: coach_id});
//             await coach.save();
//         }

//         // Find or create the chat document based on both athlete and coach IDs
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

//         // Add the new message to the messages array
//         chat.messages.push({
//             sender_id: senderId,
//             text: message,
//             timestamp: new Date() 
//         });

//         // Save the chat document along with athlete and coach IDs
//         chat.athlete_id = athlete_id;
//         chat.coach_id = coach_id;
//         await chat.save();

//         // Emit the chat data to clients using Socket.IO
//         if (io) {
//             io.emit('new_chat', chat);
//         }

//         // Send the response with the created or updated chat instance along with athlete and coach IDs
//         res.status(201).json({ success: true, chat});
//     } catch (error) {
//         // Handle errors
//         console.error('Error creating chat:', error);
//         res.status(500).json({ success: false, message: 'Internal server error' });
//     }
// };

// // Function to handle coach sending a message to athlete
// exports.coachSendMessageToAthlete = async (req, res) => {
//     try {
//         // Extract athlete_id, coach_id, and message from the request body
//         const { athlete_id, coach_id, message } = req.body;

//         // Find the chat document between the athlete and coach
//         let chat = await Chat.findOne({
//             $or: [
//                 { athlete_id, coach_id },
//                 { athlete_id: coach_id, coach_id: athlete_id }
//             ]
//         });

//         // If chat doesn't exist, return error
//         if (!chat) {
//             return res.status(404).json({ success: false, message: 'Chat not found' });
//         }

//         // Add the coach's message to the messages array
//         chat.messages.push({
//             sender_id: coach_id,
//             text: message,
//             timestamp: new Date() 
//         });

//         // Save the updated chat document
//         chat = await chat.save();

//         // Emit the message to the respective room
//         if (io) {
//             io.to(chat._id).emit('message_received', chat);
//         }

//         // Send success response
//         res.status(200).json({ success: true, message: 'Message sent successfully' });
//     } catch (error) {
//         // Handle errors
//         console.error('Error sending message from coach to athlete:', error);
//         res.status(500).json({ success: false, message: 'Internal server error' });
//     }
// };

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
