import express from 'express';
import {login} from './auth-service.js';
import messageService from './messages-service.js';
import {admin, auth, editor, viewer} from "./auth-middleware.js";
const router = express.Router();

router.post('/api/auth', login );
router.get("/api/messages", [auth, viewer], messageService.getMessages);

router.post("/api/messages", [auth, editor], messageService.addMessage);

router.put("/api/messages", [auth, editor], messageService.updateMessage);

router.delete("/api/messages", [auth, admin], messageService.deleteMessage);

export default router;