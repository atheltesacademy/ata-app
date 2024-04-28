const { server, io } = require("./app");
const { connectDatabase } = require("./config/database");
const Chat = require('./models/chat');

// Connect to the database
connectDatabase();

// Socket.IO connection event
io.on('connection', (socket) => {
    console.log('User connected');

    // Handle new chat creation
    socket.on('create_chat', async (data) => {
        try {
            const { athlete_id, coach_id, message } = data;

            // Create a new chat document
            const chat = new Chat({ athlete_id, coach_id, messages: [{ sender_id: athlete_id, text: message, timestamp: new Date() }] });
            await chat.save();

            // Join athlete and coach to the chat room
            socket.join(athlete_id);
            socket.join(coach_id);

            // Emit event to notify the frontend about the new chat
            io.emit('new_chat', chat);
        } catch (error) {
            console.error('Error creating chat:', error);
        }
    });

    // Handle disconnection
    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});

server.listen(process.env.PORT, () => {
    console.log(`Server running on port ${process.env.PORT}`);
});

