// =============================================
// controllers/messageController.js
// AI Message Generator – no external API key needed
// =============================================

// Message templates organized by occasion and tone
const messageTemplates = {
  Birthday: {
    emotional: [
      `Another year has passed, and with it comes the reminder of how incredibly special you are to me. On your birthday, I want you to know that your existence makes the world a warmer, brighter place. May this year bring you everything your heart has been quietly wishing for. Happy Birthday, {name}! 🌸`,
      `{name}, birthdays are moments to pause and celebrate the beautiful soul you are. You've grown, laughed, and loved so beautifully. I hope this day wraps you in the same warmth you give to everyone around you. Wishing you a birthday filled with pure joy! 💖`,
      `Every single year, I get to celebrate you — and every year, I fall even more in awe of the person you're becoming. Happy Birthday, {name}. You deserve every beautiful thing life has to offer. 🌷`,
    ],
    funny: [
      `Happy Birthday, {name}! You're not getting older — you're just becoming a vintage edition. Like fine wine. Or old cheese. One of the two 😄🎂`,
      `{name}, they say with age comes wisdom. So technically, you should now be able to figure out how to work the TV remote without asking for help. Happy Birthday, genius! 🎉`,
      `Another trip around the sun complete! {name}, at this rate you'll be an astronaut before you know it. Happy Birthday — may your cake have more candles than your last birthday fire code allowed! 🕯️😂`,
    ],
    formal: [
      `Dear {name}, on the occasion of your birthday, I extend my warmest congratulations and heartfelt wishes for the year ahead. May this milestone bring renewed purpose, joy, and success to every endeavor you pursue.`,
      `{name}, please accept my sincere birthday wishes. May this year be filled with meaningful achievements, good health, and the fulfilment of your aspirations. Warmest regards on your special day.`,
    ],
  },
  Anniversary: {
    emotional: [
      `{name}, every anniversary is a chapter in a love story that keeps getting more beautiful. Looking back at all the moments we've shared, I am overwhelmed with gratitude. Here's to us — to every laugh, every tear, every quiet moment that made it all worthwhile. Happy Anniversary 💍`,
      `Time has a way of making love deeper, richer, and more meaningful. Happy Anniversary, {name}. You are my home — my constant, my forever. ❤️`,
      `On this anniversary, I want you to know that choosing you, every single day, is the easiest and best decision I've ever made. Happy Anniversary, {name} 🌹`,
    ],
    funny: [
      `Happy Anniversary, {name}! You've officially survived another year with me. That deserves a medal. Or at least cake. Probably both 😄💍`,
      `They say marriage is give and take. So I gave you my heart, and you took the TV remote. Happy Anniversary, {name}! 😂❤️`,
    ],
    formal: [
      `Dear {name}, on this anniversary, I wish to express my deep appreciation for the journey we have shared. May the years ahead bring continued happiness and prosperity to you both.`,
    ],
  },
  Congratulations: {
    emotional: [
      `{name}, this achievement is a reflection of your countless late nights, your quiet perseverance, and your unshakeable belief in yourself. You earned every bit of this. I am so incredibly proud of you! 🎉✨`,
      `Watching you reach this milestone fills my heart with so much pride and joy. You've worked so hard, {name}, and now the world gets to see what I've always known — you are extraordinary. Congratulations! 🌟`,
    ],
    funny: [
      `Congratulations, {name}! You did it! And here I was betting on the other option 😄 I kid, I kid — you were always going to crush it. Proud of you! 🎊`,
      `{name}, you've officially leveled up! Your character stats have increased: +10 Confidence, +15 Achievement, +∞ Bragging Rights. Congratulations, legend! 🎮🎉`,
    ],
    formal: [
      `Dear {name}, please accept my heartfelt congratulations on this remarkable achievement. Your dedication and hard work have been evident, and this success is a well-deserved recognition of your efforts. Wishing you continued success.`,
    ],
  },
  Custom: {
    emotional: [
      `{name}, some moments in life call for more than ordinary words. This is one of them. From the bottom of my heart, I want you to know how much you mean to me and how grateful I am to have you in my life. 💐`,
      `There are people who come into your life and change everything — you are that person for me, {name}. Sending you all my love and warmth today. 🌸`,
    ],
    funny: [
      `Hey {name}! I could write something deep and meaningful here, but honestly, I just wanted an excuse to send you something pretty. So here you go. You're welcome 😄🌺`,
      `{name}, I made this card for you because you deserve nice things — and also because I needed to tell you you're pretty great. Just saying! 💫`,
    ],
    formal: [
      `Dear {name}, I am sending this message to express my warmest regards and best wishes to you. It is always a pleasure to celebrate the people who make a positive difference in our lives.`,
    ],
  },
};

// ──────────────────────────────────────────
// POST /api/generate-message
// ──────────────────────────────────────────
const generateMessage = (req, res) => {
  try {
    const { occasion, tone, receiverName } = req.body;

    if (!occasion || !tone) {
      return res
        .status(400)
        .json({ success: false, error: 'occasion and tone are required.' });
    }

    // Normalize inputs
    const normalizedOccasion =
      occasion.charAt(0).toUpperCase() + occasion.slice(1).toLowerCase();
    const normalizedTone = tone.toLowerCase();

    // Get template pool
    const occasionPool =
      messageTemplates[normalizedOccasion] || messageTemplates['Custom'];
    const tonePool =
      occasionPool[normalizedTone] ||
      occasionPool['emotional'] ||
      Object.values(occasionPool)[0];

    // Pick a random message from the pool
    const template = tonePool[Math.floor(Math.random() * tonePool.length)];

    // Replace {name} placeholder
    const name = receiverName || 'you';
    const generatedMessage = template.replace(/\{name\}/g, name);

    res.status(200).json({
      success: true,
      message: generatedMessage,
      occasion: normalizedOccasion,
      tone: normalizedTone,
    });
  } catch (error) {
    console.error('generateMessage error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

module.exports = { generateMessage };
