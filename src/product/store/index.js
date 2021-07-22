import { configureStore } from '@reduxjs/toolkit';
import assembly from '@product/features/assembly';
import modal from '@product/features/modal';
import previewMode from '@product/features/previewMode';
import workspace from '@product/features/workspace';
import parliamentarian from '@product/middleware/parliamentarian';

export default configureStore({
  middleware: [
    parliamentarian,
  ],
  reducer: {
    assembly,
    modal,
    previewMode,
    workspace,
  },
});
