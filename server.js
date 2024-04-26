const { server, io } = require("./app");
const { connectDatabase } = require("./config/database");
const Chat = require('./models/chat');

connectDatabase();

io.on('connection', function(socket){
    console.log('User connected');

    socket.on('join_chat', async function({ chatId }) {
        // You can add code here if necessary
    });

    socket.on('send_message', async function(data) {
        const { chatId, senderId, text } = data;
        try {
            let chat = await Chat.findById(chatId);
            if (!chat) {
                throw new Error('Chat not found');
            }
            
            chat.messages.push({
                sender_id: senderId,
                text: text,
                timestamp: new Date().toISOString()
            });
            
            chat = await chat.save();
            
            io.to(chatId).emit('message_received', chat);
           
        } catch (error) {
            console.error('Error sending message:', error);
        }
    });
    
    socket.on('disconnect', function(){
        console.log('User disconnected');
    });
});

server.listen(process.env.PORT, () => {
    console.log(`Server running on port ${process.env.PORT}`);
});
