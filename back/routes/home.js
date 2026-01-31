import express from 'express'
const router = express.Router();

router.get('/', (req, res) => {
    res.send("daje roma");
})

export default router;