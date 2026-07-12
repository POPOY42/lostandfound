import User from "../models/User.model.js";
import bcrypt from "bcrypt";

const register = async (req, res) => {

    try{
        const {name, surname, username, contactNumber, password} = req.body

        const existingUser = await User.findOne({ username });

        if (existingUser) {
            return res.status(400).json({
                message: "username already exists"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
                name,
                surname,
                username,
                contactNumber,
                password: hashedPassword
            });

        await newUser.save();

        return res.status(201).json({
            message: "User registered successfully"
        });
    }
    catch(error){
        return res.status(500).json({
            message: error.message
        });
    }
}


const login = async (req, res) => {
    try {
        const {username, password} = req.body;

        const user = await User.findOne({username});

        if(!user){
            return res.status(400).json({
                message: "Invalid username or password"
            })
        }

        const isMatch = await bcrypt.compare(password, user.password)
        
        if(!isMatch){
            return res.status(400).json({
                message :"Invalid username or password"
            })
        }

        return res.status(200).json({
            message: "Login successful",
            user: {
                _id: user._id,
                name: user.name,
                surname: user.surname,
                username: user.username,
                contactNumber: user.contactNumber,
                role: user.role,
                createdAt: user.createdAt
            }
        });
    }
    catch(error){
        return res.status(500).json({
            message: error.message
        });
    }
}


const getUsers = async (req, res) => {
    try {
        const users = await User.find({role: "resident"}).sort({createdAt: -1})

        res.status(200).json(users);
    } 
    catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};


const changeUsername = async (req,res) => {
    try {
        const {userId, username} = req.body

        if(!username){
            return res.status(400).json({
                message: "Username is required"
            })
        }

        const existingUser = await User.findOne({
            username,
            _id: { $ne: userId }
        });

        if(existingUser){
            return res.status(400).json({
                message: "Username already exists"
            })
        }

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            {username},
            {new: true}
        )

        return res.status(200).json({
            message: "Username updated successfully",
            user: updatedUser
        });
    } 
    catch (error) {
        return res.status(500).json({
            message: error.message
    });
    }
}


const changePhoneNumber = async (req, res) => {
    try {
        const { userId, contactNumber } = req.body;

        if (!contactNumber) {
            return res.status(400).json({
                message: "Contact number is required"
            });
        }

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { contactNumber },
            { new: true }
        );

        if (!updatedUser) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        return res.status(200).json({
            message: "Contact number updated successfully",
            user: updatedUser
        });

    } catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
};


const changePassword = async (req, res) => {
    try {
        const { userId, currentPassword, newPassword } = req.body;

        if (!currentPassword || !newPassword) {
            return res.status(400).json({
                message: "Current password and new password are required"
            });
        }

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        const isMatch = await bcrypt.compare(currentPassword, user.password);

        if (!isMatch) {
            return res.status(400).json({
                message: "Current password is incorrect"
            });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        user.password = hashedPassword;
        await user.save();

        return res.status(200).json({
            message: "Password updated successfully"
        });

    } catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
};


export{register, 
       login, 
       getUsers,
       changeUsername,
       changePhoneNumber,
       changePassword
}