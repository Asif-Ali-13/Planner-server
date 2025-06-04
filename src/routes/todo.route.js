import { Router } from 'express';
import { verifyJWT } from '../middlewares/auth.middleware.js';
import { createTodo, getAllTodos } from '../controllers/todo.controller.js';

const router = Router();

router.use(verifyJWT);

router.route("/")
        .get(getAllTodos)
        .post(createTodo)


export const todoRoutes = router;