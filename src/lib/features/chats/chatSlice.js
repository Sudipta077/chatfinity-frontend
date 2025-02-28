import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// ✅ Accepts token as an argument
export const fetchChats = createAsyncThunk(
    "chat/fetchChats",

    
    async ({ token }) => {
        // console.log("Token of meee--->",token);
        const result = await axios.get(`${process.env.NEXT_PUBLIC_URL}/chat`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        // console.log("result fromredux --=-=-=->", result.data);
        return result.data;


    }
);
// Define chatSlice
const chatSlice = createSlice({
    name: "chat",
    initialState: { chats: [], error: null, isLoading: false },
    reducers: {},
    extraReducers: (builder) => {


        builder
            .addCase(fetchChats.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchChats.fulfilled, (state, action) => {
                state.isLoading = false;
                state.chats = action.payload;
                state.error = null;
            })
            .addCase(fetchChats.rejected, (state, action) => {
                state.error = action.payload;
                state.isLoading = false
            });
    },
});

export default chatSlice.reducer;
