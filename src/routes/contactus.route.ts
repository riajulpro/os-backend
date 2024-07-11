import { Router } from "express";
import { createContactMessage } from "../controllers/contact.us.controller";
const router = Router();

router.post("/send", createContactMessage);

const contactRoute = router;
export default contactRoute;
