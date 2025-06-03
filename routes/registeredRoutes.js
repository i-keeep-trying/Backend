const express = require('express');

const router = express.Router();

router.get('/', (req, res) => {
    console.log("We recieved a request of register route")
    const sampleData = {
        massage: "Hello world"
    }
    res.json(sampleData);
});

module.exports = router;