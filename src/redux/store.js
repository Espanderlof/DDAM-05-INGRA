import AsyncStorage from '@react-native-async-storage/async-storage';
import { configureStore, createSlice } from '@reduxjs/toolkit';
import { persistReducer, persistStore } from 'redux-persist';


//import todosReducer from "./todosReducer";

const persistConfig = {
    key: 'root',
    storage: AsyncStorage,
  };
  
  const authPersistConfig = {
    key: 'auth',
    storage: AsyncStorage,
  };

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        token: null,
        isAuthenticated: false,
    },
    reducers: {
        login(state, action) {
            state.token = action.payload.token
            state.isAuthenticated = true
        },
        logout(state) {
            state.token = null
            state.isAuthenticated = false
        },
    },
    ...authPersistConfig,
});

const persistedReducer = persistReducer(persistConfig, {
    auth: authSlice.reducer,
});

export const store = configureStore({
    reducer: {
      auth: authSlice.reducer,
    },
    //reducer: persistedReducer,
});

//export const persistor = persistStore(store);

export const { login, logout } = authSlice.actions;
export default { store };