import User from "../models/User.model.js";
import bcrypt from "bcrypt";

const register = async (req, res) => {

    try{
        const {name, surname, studentId, password} = req.body

        const existingUser = await User.findOne({ studentId });

        if (existingUser) {
            return res.status(400).json({
                message: "Student ID already exists"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
                name,
                surname,
                studentId,
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
        const {studentId, password} = req.body;

        const user = await User.findOne({studentId});

        if(!user){
            return res.status(400).json({
                message: "Invalid student ID or password"
            })
        }

        const isMatch = await bcrypt.compare(password, user.password)
        
        if(!isMatch){
            return res.status(400).json({
                message :"Invalid student ID or password"
            })
        }

        return res.status(200).json({
            message: "Login successful",
            user: {
                _id: user._id,
                name: user.name,
                surname: user.surname,
                studentId: user.studentId,
                role: user.role
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
        const users = await User.find({role: "student"});

        res.status(200).json(users);
    } 
    catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};
export {register, login, getUsers}