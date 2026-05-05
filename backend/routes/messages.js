const express = require('express');
const router = express.Router();
const Message = require('../models/Message');
const Conversation = require('../models/Conversation');
const User = require('../models/User');
const auth = require('../middleware/auth');

// Get all conversations for current user
router.get('/conversations', auth, async (req, res) => {
    try {
        const conversations = await Conversation.find({
            participants: req.user.id
        }).populate('participants', 'username avatar').sort({ updatedAt: -1 });
        res.json(conversations);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get messages for a specific conversation (by other user's ID)
router.get('/:userId', auth, async (req, res) => {
    try {
        const otherUserId = req.params.userId;
        const currentUserId = req.user.id;

        // Find conversation
        let conversation = await Conversation.findOne({
            participants: { $all: [currentUserId, otherUserId] }
        });

        if (!conversation) return res.json([]);

        const messages = await Message.find({
            conversationId: conversation._id
        }).sort({ createdAt: 1 });

        // Mark messages as read if recipient is current user
        await Message.updateMany(
            { conversationId: conversation._id, recipient: currentUserId, isRead: false },
            { $set: { isRead: true } }
        );

        res.json(messages);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Send a message
router.post('/:userId', auth, async (req, res) => {
    try {
        const { content } = req.body;
        const otherUserId = req.params.userId;
        const currentUserId = req.user.id;

        let conversation = await Conversation.findOne({
            participants: { $all: [currentUserId, otherUserId] }
        });

        if (!conversation) {
            conversation = await Conversation.create({
                participants: [currentUserId, otherUserId],
            });
        }

        const newMessage = new Message({
            conversationId: conversation._id,
            sender: currentUserId,
            recipient: otherUserId,
            content
        });

        await newMessage.save();

        conversation.lastMessage = {
            text: content,
            sender: currentUserId,
            isRead: false
        };
        await conversation.save();

        res.status(201).json(newMessage);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Search users to chat with
router.get('/search/users', auth, async (req, res) => {
    try {
        const { q } = req.query;
        if (!q) return res.json([]);
        const users = await User.find({
            username: { $regex: q, $options: 'i' },
            _id: { $ne: req.user.id }
        }).select('username avatar');
        res.json(users);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
