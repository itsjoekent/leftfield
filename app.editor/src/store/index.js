import { configureStore } from '@reduxjs/toolkit';
import assembly from '@editor/features/assembly';
import modal from '@editor/features/modal';
import previewMode from '@editor/features/previewMode';
import workspace from '@editor/features/workspace';
import componentDefaults from '@editor/middleware/componentDefaults';

export default configureStore({
  middleware: [
    componentDefaults,
  ],
  reducer: {
    assembly,
    modal,
    previewMode,
    workspace,
  },
});
