import { configureStore } from "@reduxjs/toolkit";
import todosReducer from "./todosReducer";

export const store = configureStore({
    reducer: {
        todos: todosReducer
    }
});