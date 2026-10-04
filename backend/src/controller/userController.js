const jwt = require('jsonwebtoken');
const User = require('../schema/userSchema');
const bcrypt = require('bcryptjs');

const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: '1d'
  });
};
const registerUser = async (req, res) => {
  const { name, phone, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      phone,
      email,
      password: hashedPassword
    });

    await newUser.save();
    
    res.status(201).json({ message: 'User registered successfully' });

  } catch (err) {
    res.status(500).json({ message: 'Registration failed', error: err.message });
  }
};


const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
   
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

   
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

 
    const token = generateToken(user._id);

    res.status(200).json({
      message: 'Login successful',
      token, 
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });
  } catch (err) {
    res.status(500).json({ message: 'Login failed', error: err.message });
  }
};

const getAllUsers = async (req, res) => {
  try {
  
    const users = await User.find().select('-password');
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ message: 'Failed to retrieve users', error: err.message });
  }
};

const updateUser = async (req, res) => {
  const { id } = req.params;
  const { name, phone, email, password } = req.body;

  try {
    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Update fields
    if (name) user.name = name;
    if (phone) user.phone = phone;
    if (email) user.email = email;
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      user.password = hashedPassword;
    }

    await user.save();

    res.status(200).json({ message: 'User updated successfully', user });
  } catch (err) {
    res.status(500).json({ message: 'Update failed', error: err.message });
  }
};


const deleteUser = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findByIdAndDelete(id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.status(200).json({ message: 'User deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Delete failed', error: err.message });
  }
};


module.exports = {
  registerUser,
  loginUser,
  getAllUsers,
   updateUser,     
  deleteUser 
};