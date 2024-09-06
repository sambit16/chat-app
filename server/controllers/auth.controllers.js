import bcryptjs from "bcryptjs";
import User from "../db/models/user.model.js";
import generateToken from "../db/utils/generatetoken.js";

// function randomnumber(){
//     var number =0
//     return number
// }

// const boypiclist = ["","","","","",""];
export const signup = async (req, res) => {
  try {
    const { fullname, username, password, confirmPassword, gender } = req.body;

    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    const user = await User.findOne({ username });

    if (user) {
      return res.status(400).json({ message: "Username already exists" });
    }

    //hash pass
    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);

      const boyPF = `https://img.freepik.com/premium-vector/cute-boy-smiling-cartoon-kawaii-boy-illustration-boy-avatar-happy-kid_1001605-3447.jpg`;
    //   const boypic=boypiclist[randomnumber(4)]
    const girlPF = `https://img.freepik.com/premium-photo/engaging-cartoon-avatar-trustworthy-girl-her-late-s-tiktok-promotions_1283595-3611.jpg`;

    const newUser = new User({
      fullname,
      username,
      password: hashedPassword,
      gender,
      profilepic: gender === "male" ? boyPF : girlPF,
    });

    if (newUser) {
      generateToken(newUser._id, res);
      await newUser.save();

      res.status(201).json({
        _id: newUser._id,
        fullname: newUser.fullname,
        username: newUser.username,
        profilepic: newUser.profilepic,
      });
    } else {
      res.status(400).json({ message: "Failed to create user" });
    }
  } catch (error) {
    console.log("error in signup controller", error.message);
    res.status(500).json({ error: "internal server error" });
  }
};

export const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    const ispassCorrect = await bcryptjs.compare(
      password,
      user?.password || ""
    );

    if (!user || !ispassCorrect) {
      return res.status(400).json({ error: "invalid credentials" });
    }

    generateToken(user._id, res);

    res.status(200).json({
      _id: user._id,
      fullname: user.fullname,
      username: user.username,
      profilepic: user.profilepic,
    });
  } catch (error) {
    console.log("error in login controller", error.message);
    res.status(500).json({ error: "internal server error" });
  }
};

export const logout = (req, res) => {
  try {
    res.cookie("jwt", "", { maxAge: 0 });
    res.status(200).json({ message: "Logged out sucessFully" });
  } catch (error) {
    console.log("error in logout controller", error.message);
    res.status(500).json({ error: "internal server error" });
  }
};
