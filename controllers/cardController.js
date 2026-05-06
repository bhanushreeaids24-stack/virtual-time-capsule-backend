// =============================================
// controllers/cardController.js
// =============================================
const Card = require('../models/Card');
const QRCode = require('qrcode');
const { v4: uuidv4 } = require('uuid');
const path = require('path');

// ──────────────────────────────────────────
// POST /api/cards — Create a new card
// ──────────────────────────────────────────
const createCard = async (req, res) => {
  try {
    const {
      receiverName,
      occasion,
      customOccasion,
      message,
      bouquet,
      scheduledDate,
      theme,
      senderName,
    } = req.body;

    // Validate required fields
    if (!receiverName || !message) {
      return res.status(400).json({
        success: false,
        error: 'receiverName and message are required.',
      });
    }

    // Generate a short unique card ID (first 8 chars of a UUID)
    const cardId = uuidv4().replace(/-/g, '').substring(0, 10);

    // Build the shareable link
    const baseUrl = process.env.BASE_URL || 'http://localhost:5000';
    const link = `${baseUrl}/card/${cardId}`;

    // Generate QR code as base64 data URI
    let qrCode = null;
    try {
      qrCode = await QRCode.toDataURL(link, {
        width: 300,
        margin: 2,
        color: { dark: '#6b3fa0', light: '#ffffff' },
      });
    } catch (qrErr) {
      console.warn('QR Code generation failed:', qrErr.message);
    }

    // Handle image upload path (if file was uploaded via multer)
    let imagePath = null;
    if (req.file) {
      imagePath = `/uploads/${req.file.filename}`;
    }

    // Parse bouquet — could come as JSON string or array
    let bouquetArr = [];
    if (bouquet) {
      try {
        bouquetArr = typeof bouquet === 'string' ? JSON.parse(bouquet) : bouquet;
      } catch {
        bouquetArr = Array.isArray(bouquet) ? bouquet : [bouquet];
      }
    }

    // Create and save the card in MongoDB
    const card = await Card.create({
      cardId,
      receiverName,
      occasion: occasion || 'Birthday',
      customOccasion: customOccasion || '',
      message,
      bouquet: bouquetArr,
      image: imagePath,
      qrCode,
      link,
      scheduledDate: scheduledDate ? new Date(scheduledDate) : null,
      theme: theme || 'pastel',
      senderName: senderName || 'Anonymous',
    });

    res.status(201).json({
      success: true,
      message: 'Card created successfully! 🎉',
      data: {
        id: card.cardId,
        link: card.link,
        qrCode: card.qrCode,
        createdAt: card.createdAt,
      },
    });
  } catch (error) {
    console.error('createCard error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// ──────────────────────────────────────────
// GET /api/cards/:id — Fetch a card by cardId
// ──────────────────────────────────────────
const getCard = async (req, res) => {
  try {
    const card = await Card.findOne({ cardId: req.params.id });

    if (!card) {
      return res.status(404).json({ success: false, error: 'Card not found.' });
    }

    // Check if card is scheduled and not yet due
    if (card.scheduledDate && new Date() < new Date(card.scheduledDate)) {
      return res.status(403).json({
        success: false,
        error: 'This card is scheduled for a future date.',
        scheduledDate: card.scheduledDate,
      });
    }

    res.status(200).json({ success: true, data: card });
  } catch (error) {
    console.error('getCard error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// ──────────────────────────────────────────
// GET /api/cards — List all cards (admin / dev)
// ──────────────────────────────────────────
const getAllCards = async (req, res) => {
  try {
    const cards = await Card.find().sort({ createdAt: -1 }).select('-qrCode'); // exclude qrCode for performance
    res.status(200).json({ success: true, count: cards.length, data: cards });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// ──────────────────────────────────────────
// POST /api/cards/:id/like — Increment likes
// ──────────────────────────────────────────
const likeCard = async (req, res) => {
  try {
    const card = await Card.findOneAndUpdate(
      { cardId: req.params.id },
      { $inc: { likes: 1 } },
      { new: true }
    );

    if (!card) {
      return res.status(404).json({ success: false, error: 'Card not found.' });
    }

    res.status(200).json({
      success: true,
      message: '❤️ Liked!',
      likes: card.likes,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// ──────────────────────────────────────────
// DELETE /api/cards/:id — Delete a card
// ──────────────────────────────────────────
const deleteCard = async (req, res) => {
  try {
    const card = await Card.findOneAndDelete({ cardId: req.params.id });
    if (!card) {
      return res.status(404).json({ success: false, error: 'Card not found.' });
    }
    res.status(200).json({ success: true, message: 'Card deleted.' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

module.exports = { createCard, getCard, getAllCards, likeCard, deleteCard };
