const express = require("express");
const router = express.Router();

const {
  createCard,
  getCard,
  getAllCards,
  likeCard,
  deleteCard
} = require("../controllers/cardController");

// create
router.post("/", createCard);

// get all
router.get("/", getAllCards);

// get one
router.get("/:id", getCard);

// like
router.post("/:id/like", likeCard);

// delete
router.delete("/:id", deleteCard);

module.exports = router;