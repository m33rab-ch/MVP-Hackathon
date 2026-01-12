const User = require('../models/User');
const Transaction = require('../models/Transaction');

// Get user public profile
exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select('name email department year rating skills bio createdAt')
      .lean();

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Get user's active services
    const services = await require('../models/Service').find({
      seller: req.params.id,
      status: 'active'
    }).select('title category price deliveryTime averageRating');

    // Get user's transaction stats
    const transactionStats = await Transaction.aggregate([
      {
        $match: {
          $or: [
            { buyer: req.params.id },
            { seller: req.params.id }
          ],
          status: 'completed'
        }
      },
      {
        $group: {
          _id: null,
          totalTransactions: { $sum: 1 },
          asBuyer: {
            $sum: {
              $cond: [{ $eq: ['$buyer', req.params.id] }, 1, 0]
            }
          },
          asSeller: {
            $sum: {
              $cond: [{ $eq: ['$seller', req.params.id] }, 1, 0]
            }
          }
        }
      }
    ]);

    res.json({
      ...user,
      services,
      stats: transactionStats[0] || {
        totalTransactions: 0,
        asBuyer: 0,
        asSeller: 0
      }
    });
  } catch (error) {
    console.error('Get user profile error:', error);
    res.status(500).json({ error: 'Failed to fetch user profile' });
  }
};

// Update user skills
exports.updateUserSkills = async (req, res) => {
  try {
    const { skills } = req.body;
    
    if (!Array.isArray(skills)) {
      return res.status(400).json({ error: 'Skills must be an array' });
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { skills: skills.slice(0, 10) }, // Limit to 10 skills
      { new: true }
    ).select('-password');

    res.json({
      message: 'Skills updated successfully',
      user
    });
  } catch (error) {
    console.error('Update skills error:', error);
    res.status(500).json({ error: 'Failed to update skills' });
  }
};

// Get user's transactions (as buyer or seller)
exports.getUserTransactions = async (req, res) => {
  try {
    const userId = req.params.id;
    const currentUserId = req.user._id;
    
    // Only allow if viewing own transactions or public profile
    if (userId !== currentUserId.toString()) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    const transactions = await Transaction.find({
      $or: [
        { buyer: userId },
        { seller: userId }
      ]
    })
    .populate('buyer', 'name email')
    .populate('seller', 'name email')
    .populate('service', 'title category')
    .sort({ createdAt: -1 })
    .limit(20);

    res.json(transactions);
  } catch (error) {
    console.error('Get user transactions error:', error);
    res.status(500).json({ error: 'Failed to fetch transactions' });
  }
};

// Get current user's earnings
exports.getUserEarnings = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .select('earnings');

    // Calculate recent transactions
    const recentTransactions = await Transaction.find({
      seller: req.user._id,
      status: 'completed'
    })
    .sort({ completedAt: -1 })
    .limit(5)
    .select('amount completedAt');

    res.json({
      earnings: user.earnings,
      recentTransactions
    });
  } catch (error) {
    console.error('Get earnings error:', error);
    res.status(500).json({ error: 'Failed to fetch earnings' });
  }
};