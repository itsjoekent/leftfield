import { configureStore } from '@reduxjs/toolkit';
import assembly from '@editor/features/assembly';
import previewMode from '@editor/features/previewMode';
import workspace from '@editor/features/workspace';

export default configureStore({
  reducer: {
    assembly,
    previewMode,
    workspace,
  },
});
