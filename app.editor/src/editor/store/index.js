import { configureStore } from '@reduxjs/toolkit';
import previewMode from '@editor/features/previewMode';

export default configureStore({
  reducer: {
    previewMode,
  },
});
