import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import AsyncStorage from '@react-native-async-storage/async-storage';

const initialState = {
    token: null,
    uid: null,
    status: 'not-authenticated',
};

const loadAuthData = createAsyncThunk(
    'auth/loadAuthData',
    async () => {
        try {
            const token = await AsyncStorage.getItem('token');
            const uid = await AsyncStorage.getItem('uid');
            if (token && uid) {
                return { token, uid };
            } else {
                throw new Error('No se encontraron datos de autenticación.');
            }
        } catch (error) {
            throw error;
        }
    }
);

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        login(state, { payload }) {
            state.token = payload.token;
            state.uid = payload.uid;
            state.status = 'authenticated';
        },
        logout(state) {
            state.token = null;
            state.uid = null;
            state.status = 'not-authenticated';
        },
        checkingCredentials(state) {
            state.status = 'checking';
        },
    },
    extraReducers: (builder) => {
        builder.addCase(loadAuthData.fulfilled, (state, action) => {
            state.token = action.payload.token;
            state.uid = action.payload.uid;
            state.status = 'authenticated';
        });
    },
});

export const { login, logout, checkingCredentials } = authSlice.actions;

export { loadAuthData };

export default authSlice.reducer;