const mongoose =require("mongoose");

exports.connectDatabase = () =>{
    mongoose
    .connect(process.env.MONGO_URI)
    .then((con)=>{ 
        console.log(`Database Connected: ${con.connection.host}`)
    })
    .catch((err)=> {
        console.log(err)
    });
}
// mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
//     .then(() => console.log('Connected to MongoDB'))
//     .catch((err) => console.error('Failed to connect to MongoDB', err));