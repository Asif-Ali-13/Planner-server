import { Router } from 'express';
import { verifyJWT } from '../middlewares/auth.middleware.js';
import { createTodo, deleteTodo, getAllTodos, updateTodo } from '../controllers/todo.controller.js';

const router = Router();

router.use(verifyJWT);

router.route("/")
        .get(getAllTodos)
        .post(createTodo)

router.route("/:todoId")
        .patch(updateTodo)
        .delete(deleteTodo)

export const todoRoutes = router;