import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { combineReducers } from 'redux';
import authReducer from './authSlice';

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['auth', 'cart'], // only auth and cart will be persisted
};

const rootReducer = combineReducers({
  auth: authReducer,
  // cart: cartReducer, // You'll need to create this separately
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
});

export const persistor = persistStore(store);
