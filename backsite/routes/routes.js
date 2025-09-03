import express from "express";

import { getuser, newuser } from "../controllers/userController.js";

const router = express.Router();

router.get('/',getuser);

router.post('/',newuser);

export default router;