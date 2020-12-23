import { configureStore } from '@reduxjs/toolkit';
import userReducer from './userSlice';
import AppReducer from './AppSlice';


export default configureStore({
  reducer: {
    user: userReducer,
    app: AppReducer
  },
});
