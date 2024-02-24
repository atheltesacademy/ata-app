const User = require("../models/user");

exports.register = async (req, res) => {
    try {
        const { name, email, password, user_type } = req.body; // Added user_type
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ success: false, message: "User already exists" });
        }
        user = await User.create({ name, email, password, user_type }); // Added user_type

        const token = await user.generateToken();

        const options = {
            expires: new Date (Date.now() + 90 * 24 * 60 * 60 * 1000),
            httpOnly: true,
        };
        res.status(201).cookie("token", token, options).json({
            success: true,
            user,
            token,
            user_type, // Added user_type
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
exports.logout = async (req,res) =>{
    try{
        res.status(200).cookie("token",null,{expires:new Date(Date.now()),httpOnly:true}).json({
            success:true,
            message:"Logged out",
            // user_type: req.user.user_type,

        });
    }catch(error){
        res.status(500).json({
            success:false,
            message:error.message,
        });
    }
}
exports.login =async (req,res) =>{

    try{
        const{ email,password } = req.body;

        const user = await User.findOne({ email }).select("+password");
         
        if(!user){
            return res.status(400).json({
                success:false,
                message:"User does not exist"
            });
        }
        const isMatch = await user.matchPassword(password);

        if(!isMatch){
            return res.status(400).json({

                success:false,
                message:"incorrect password",
            });
        }
        const token = await user.generateToken();

        const options = {
            expires:new Date(Date.now()+90*24*60*60*1000),
            httpOnly: true,
        };
        res.status(200).cookie("token",token,options)
        .json({
            success:true,
            user,
            token,
            user_type: user.user_type,
        });
    }catch(error){
        res.status(500).json({
            success:false,
            message:error.message,
        });
    }
};
exports.updatePassword = async(req,res)=>{
    try{
        const user = await User.findById(req.user._id).select("+password");

        const { oldPassword, newPassword } = req.body;

        if( oldPassword||newPassword ){
            return res.status(400).json({
                success:false,
                message:"Please provide old and new password",
            })
        }
        const isMatch = await user.matchPassword(oldPassword);

        if(!isMatch){
            return res.status(400).json({
                success:false,
                message:"Incorrect old Password",
            })
        }
        user.password = newPassword;
        await user.save();

        res.status(200).json({
            success:true,
            message:"Password updated",
        });

    }catch(error){
        res.status(500).json({
            success:false,
            message:error.message,
        });

    }
}

