const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Notification = require('../models/Notification');
const auth = require('../middleware/auth');
const multer = require('multer');
const path = require('path');

// Multer Config
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/'),
    filename: (req, file, cb) => cb(null, `profile-${Date.now()}${path.extname(file.originalname)}`)
});
const upload = multer({ storage });

// Get current user
router.get('/me', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        res.json(user);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get User Profile by Username
router.get('/:username', async (req, res) => {
    try {
        const user = await User.findOne({ username: req.params.username })
            .select('-password')
            .populate('followers', 'username avatar')
            .populate('following', 'username avatar');
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json(user);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get User by ID
router.get('/id/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password');
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json(user);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});


// Update Profile
router.put('/profile', [auth, upload.fields([{ name: 'avatar', maxCount: 1 }, { name: 'coverImage', maxCount: 1 }])], async (req, res) => {
    try {
        const updateData = { ...req.body };
        
        if (req.files['avatar']) {
            updateData.avatar = `http://localhost:5001/uploads/${req.files['avatar'][0].filename}`;
        }
        if (req.files['coverImage']) {
            updateData.coverImage = `http://localhost:5001/uploads/${req.files['coverImage'][0].filename}`;
        }

        const user = await User.findByIdAndUpdate(
            req.user.id,
            { $set: updateData },
            { new: true }
        ).select('-password')
        .populate('followers', 'username avatar')
        .populate('following', 'username avatar');

        res.json(user);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});



// Follow/Unfollow User
router.post('/:id/follow', auth, async (req, res) => {
    try {
        if (req.params.id === req.user.id) return res.status(400).json({ message: 'You cannot follow yourself' });

        const targetUser = await User.findById(req.params.id);
        const currentUser = await User.findById(req.user.id);

        if (!targetUser) return res.status(404).json({ message: 'User not found' });

        const isFollowing = currentUser.following.includes(targetUser._id);

        if (isFollowing) {
            currentUser.following.pull(targetUser._id);
            targetUser.followers.pull(currentUser._id);
        } else {
            currentUser.following.push(targetUser._id);
            targetUser.followers.push(currentUser._id);
        }

        await currentUser.save();
        await targetUser.save();

        if (!isFollowing) {
            await Notification.create({
                recipient: targetUser._id,
                sender: req.user.id,
                type: 'follow'
            });
        }

        res.json({ message: isFollowing ? 'Unfollowed' : 'Followed' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get User Bookmarks
router.get('/me/bookmarks', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).populate({
            path: 'bookmarks',
            populate: { path: 'user', select: 'username avatar' }
        });
        res.json(user.bookmarks);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Create Collection
router.post('/collections', auth, async (req, res) => {
    try {
        const { name } = req.body;
        const user = await User.findById(req.user.id);
        user.collections.push({ name, posts: [] });
        await user.save();
        res.json(user.collections);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Add to Collection
router.post('/collections/:name/add', auth, async (req, res) => {
    try {
        const { postId } = req.body;
        const user = await User.findById(req.user.id);
        const collection = user.collections.find(c => c.name === req.params.name);
        if (!collection) return res.status(404).json({ message: 'Collection not found' });
        
        if (!collection.posts.includes(postId)) {
            collection.posts.push(postId);
            await user.save();
        }
        res.json(collection);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get Suggested Users
router.get('/suggested', auth, async (req, res) => {
    try {
        const currentUser = await User.findById(req.user.id);
        const users = await User.find({ 
            _id: { $nin: [...currentUser.following, req.user.id] } 
        }).limit(5).select('username avatar bio');
        res.json(users);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Search Users
router.get('/search/users', async (req, res) => {
    try {
        const { q } = req.query;
        const users = await User.find({
            username: { $regex: q, $options: 'i' }
        }).select('username avatar bio');
        res.json(users);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
