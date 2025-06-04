import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { Todo } from '../models/todo.model.js';

export const getAllTodos = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    if(!userId) throw new ApiError("User not found", 401);

    const todos = await Todo.find({user_id: userId});
    return res.status(200).json(new ApiResponse(201, todos, "Todos fetched successfully"));
});

export const createTodo = asyncHandler(async (req, res) => {
    const { title, description, dueDate, priority, category, completed } = req.body;

    const todo = await Todo.create({
        title,
        description,
        dueDate,
        priority,
        category,
        user_id: req.user._id
    });
    
    const newTodo = await Todo.findById(todo._id);
    if(!newTodo) throw new ApiError(500, "Todo not created");

    return res.status(200).json(new ApiResponse(201, newTodo, "Todo created successfully"));
});