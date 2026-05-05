const express = require('express');
const router = express.Router();
const Post = require('../models/Post');
const User = require('../models/User');
const Comment = require('../models/Comment');
const auth = require('../middleware/auth');
const Notification = require('../models/Notification');
const multer = require('multer');
const path = require('path');

// Multer Config
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/'),
    filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage });

// Create Post
router.post('/', [auth, upload.single('image')], async (req, res) => {
    try {
        const imagePath = req.file ? `http://localhost:5001/uploads/${req.file.filename}` : req.body.image;
        const post = new Post({ 
            content: req.body.content, 
            image: imagePath,
            user: req.user.id 
        });
        await post.save();
        const populatedPost = await post.populate('user', 'username avatar');
        res.status(201).json(populatedPost);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get All Posts
router.get('/', async (req, res) => {
    try {
        const posts = await Post.find()
            .populate('user', 'username avatar')
            .populate({
                path: 'comments',
                populate: { path: 'user', select: 'username avatar' }
            })
            .sort({ createdAt: -1 });
        res.json(posts);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get User Posts
router.get('/user/:username', async (req, res) => {
    try {
        const user = await User.findOne({ username: req.params.username });
        if (!user) return res.status(404).json({ message: 'User not found' });
        
        const posts = await Post.find({ user: user._id })
            .populate('user', 'username avatar')
            .populate({
                path: 'comments',
                populate: { path: 'user', select: 'username avatar' }
            })
            .sort({ createdAt: -1 });
        res.json(posts);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get Single Post
router.get('/:id', async (req, res) => {
    try {
        const post = await Post.findById(req.params.id)
            .populate('user', 'username avatar')
            .populate({
                path: 'comments',
                populate: { path: 'user', select: 'username avatar' }
            });
        if (!post) return res.status(404).json({ message: 'Post not found' });
        res.json(post);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});



// Like/Unlike Post
router.post('/:id/like', auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) return res.status(404).json({ message: 'Post not found' });

        const index = post.likes.indexOf(req.user.id);
        const isLiked = index === -1;
        if (isLiked) {
            post.likes.push(req.user.id);
        } else {
            post.likes.splice(index, 1);
        }
        await post.save();

        if (isLiked && post.user.toString() !== req.user.id) {
            await Notification.create({
                recipient: post.user,
                sender: req.user.id,
                type: 'like',
                post: post._id
            });
        }

        res.json(post);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Bookmark/Unbookmark Post
router.post('/:id/bookmark', auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) return res.status(404).json({ message: 'Post not found' });

        const user = await User.findById(req.user.id);
        const index = user.bookmarks.indexOf(req.params.id);
        const isBookmarked = index !== -1;

        if (isBookmarked) {
            user.bookmarks.splice(index, 1);
        } else {
            user.bookmarks.push(req.params.id);
        }

        await user.save();
        res.json({ message: isBookmarked ? 'Unbookmarked' : 'Bookmarked', bookmarks: user.bookmarks });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Comment on Post
router.post('/:id/comment', auth, async (req, res) => {
    try {
        const { content } = req.body;
        const comment = new Comment({ content, user: req.user.id, post: req.params.id });
        await comment.save();

        const post = await Post.findById(req.params.id);
        post.comments.push(comment._id);
        await post.save();

        if (post.user.toString() !== req.user.id) {
            await Notification.create({
                recipient: post.user,
                sender: req.user.id,
                type: 'comment',
                post: post._id,
                content: content.substring(0, 50)
            });
        }

        const populatedComment = await comment.populate('user', 'username avatar');
        res.status(201).json(populatedComment);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Delete Post
router.delete('/:id', auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) return res.status(404).json({ message: 'Post not found' });
        
        if (post.user.toString() !== req.user.id) {
            return res.status(401).json({ message: 'User not authorized' });
        }

        await post.deleteOne();
        res.json({ message: 'Post removed' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Toggle Bookmark
router.post('/:id/bookmark', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        const index = user.bookmarks.indexOf(req.params.id);
        if (index === -1) {
            user.bookmarks.push(req.params.id);
        } else {
            user.bookmarks.splice(index, 1);
        }
        await user.save();
        res.json({ bookmarks: user.bookmarks });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get Trending Posts
router.get('/trending', async (req, res) => {
    try {
        const posts = await Post.find()
            .populate('user', 'username avatar')
            .populate({
                path: 'comments',
                populate: { path: 'user', select: 'username avatar' }
            });
            
        // Simple sorting by (likes + comments)
        const sortedPosts = posts.sort((a, b) => 
            (b.likes.length + b.comments.length) - (a.likes.length + a.comments.length)
        ).slice(0, 20);

        res.json(sortedPosts);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Search Posts
router.get('/search', async (req, res) => {
    try {
        const { q } = req.query;
        const posts = await Post.find({
            content: { $regex: q, $options: 'i' }
        }).populate('user', 'username avatar');
        res.json(posts);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
