const express = require("express");
const wordControllers = require("../controllers/word-controllers");

const router = express.Router();

router.get("/alphabets", wordControllers.getAlphabets);

router.get("/get/:wid", wordControllers.getbyId);

router.get("/random", wordControllers.getRandom);

router.post("/data", wordControllers.postWords);

router.patch("/edit", wordControllers.editWord)

router.delete("/delete", wordControllers.deleteWord)
module.exports = router;
