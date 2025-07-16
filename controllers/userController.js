const User = require('../models/user');
const ClaimHistory = require('../models/ClaimHistory');

// Initial users for seeding the database
const initialUsers = [
  { name: 'Rahul' }, { name: 'Kamal' }, { name: 'Sanak' }, { name: 'Priya' },
  { name: 'Amit' }, { name: 'Sneha' }, { name: 'Vikas' }, { name: 'Deepa' },
  { name: 'Rohan' }, { name: 'Kavita' }
];

// Seed users if the database is empty
exports.seedUsers = async (req, res) => {
  try {
    const userCount = await User.countDocuments();
    if (userCount === 0) {
      await User.insertMany(initialUsers);
      console.log('Initial users seeded successfully.');
      return res.status(201).json({ message: 'Initial users seeded.' });
    }
    res.status(200).json({ message: 'Users already exist.' });
  } catch (error) {
    console.error('Error seeding users:', error);
    res.status(500).json({ message: 'Error seeding users', error: error.message });
  }
};

// Get users with total points and their rank
exports.getUsersAndRankings = async (req, res) => {
  try {
    const users = await User.find().sort({ totalPoints: -1 });
    const usersWithRank = users.map((user, index) => ({
      _id: user._id,
      name: user.name,
      totalPoints: user.totalPoints,
      rank: index + 1
    }));
    res.status(200).json(usersWithRank);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users and rankings', error: error.message });
  }
};

// Claim points for a user
exports.claimPoints = async (req, res) => {
  const { userId } = req.body;
  if (!userId) {
    return res.status(400).json({ message: 'User ID is required.' });
  }
  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    const pointsClaimed = Math.floor(Math.random() * 10) + 1;
    user.totalPoints += pointsClaimed;
    await user.save();

    const claimHistory = new ClaimHistory({
      userId: user._id,
      pointsClaimed
    });
    await claimHistory.save();

    const users = await User.find().sort({ totalPoints: -1 });
    const leaderboard = users.map((u, index) => ({
      _id: u._id,
      name: u.name,
      totalPoints: u.totalPoints,
      rank: index + 1
    }));

    res.status(200).json({
      message: 'Points claimed successfully!',
      user: { _id: user._id, name: user.name, totalPoints: user.totalPoints },
      pointsClaimed,
      leaderboard
    });
  } catch (error) {
    res.status(500).json({ message: 'Error claiming points', error: error.message });
  }
};


// Add a new user
exports.addUser = async (req, res) => {
  const { name } = req.body;
  if (!name) {
    return res.status(400).json({ message: 'User name is required.' });
  }
  try {
    const existingUser = await User.findOne({ name });
    if (existingUser) {
      return res.status(409).json({ message: 'User with this name already exists.' });
    }

    const newUser = new User({ name, totalPoints: 0 });
    await newUser.save();
    res.status(201).json({ message: 'User added successfully', user: newUser });
  } catch (error) {
    res.status(500).json({ message: 'Error adding user', error: error.message });
  }
};
//claim history
exports.getClaimHistory = async (req, res) => {
  try {
    const history = await ClaimHistory.find()
      .populate('userId', 'name')
      .sort({ claimedAt: -1 });

    res.status(200).json(history);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching claim history', error: error.message });
  }
};
