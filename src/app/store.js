import { configureStore } from '@reduxjs/toolkit';
import userReducer from '../features/userSlice';
import AppReducer from '../features/AppSlice';


export default configureStore({
  reducer: {
    user: userReducer,
    app: AppReducer
  },
});
