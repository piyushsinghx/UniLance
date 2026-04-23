const User = require('../models/User');
const generateToken = require('../utils/generateToken');
const { isAcademicEmail } = require('../utils/studentVerification');

const buildAuthPayload = (user) => ({
  _id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  university: user.university,
  avatar: user.avatar,
  bio: user.bio,
  skills: user.skills,
  isVerified: user.isVerified,
  verificationStatus: user.verificationStatus,
  collegeIdImage: user.collegeIdImage,
  createdAt: user.createdAt,
  token: generateToken(user._id),
});

// @desc    Register a new user
// @route   POST /api/auth/register
const register = async (req, res) => {
  try {
    const { name, email, password, role, university, collegeIdImage } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hasAcademicEmail = isAcademicEmail(email);
    const hasManualVerification = Boolean(collegeIdImage);

    if (!hasAcademicEmail && !hasManualVerification) {
      return res.status(400).json({
        message: 'Use a college email or upload a college ID for manual approval.',
      });
    }
    
    const user = await User.create({
      name,
      email,
      password,
      role: role || 'buyer',
      university: university || '',
      collegeIdImage: collegeIdImage || '',
      isVerified: hasAcademicEmail,
      verificationStatus: hasAcademicEmail ? 'verified' : 'pending',
    });

    res.status(201).json(buildAuthPayload(user));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    res.json(buildAuthPayload(user));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get current user profile
// @route   GET /api/auth/me
const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { register, login, getMe };
