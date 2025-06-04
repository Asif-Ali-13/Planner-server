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

export const updateTodo = asyncHandler(async (req, res) => {
    const { todoId } = req.params;
    const { title, description, dueDate, priority, category, completed, completedDate } = req.body;

    const body = req.body;
    console.log(body);

    const todo = await Todo.findByIdAndUpdate(
        todoId,
        { $set: { title, description, dueDate, priority, category, completed, completedDate } },
        { new: true }
    )

    return res.status(200).json(new ApiResponse(201, todo, "Todo updated successfully"));
});

export const deleteTodo = asyncHandler(async (req, res) => {
    const { todoId } = req.params;

    const todo = await Todo.findByIdAndDelete(todoId);
    if(!todo) throw new ApiError(500, "Todo not found");

    return res.status(200).json(new ApiResponse(201, {}, "Todo deleted successfully"));
});