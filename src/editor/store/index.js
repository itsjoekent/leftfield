import { configureStore } from '@reduxjs/toolkit';
import assembly from '@editor/features/assembly';
import modal from '@editor/features/modal';
import previewMode from '@editor/features/previewMode';
import workspace from '@editor/features/workspace';
import parliamentarian from '@editor/middleware/parliamentarian';

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
