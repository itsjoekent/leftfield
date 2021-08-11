import { configureStore } from '@reduxjs/toolkit';
import assembly from '@product/features/assembly';
import auth from '@product/features/auth';
import modal from '@product/features/modal';
import previewMode from '@product/features/previewMode';
import snacks from '@product/features/snacks';
import snapshot from '@product/features/snapshot';
import workspace from '@product/features/workspace';
import parliamentarian from '@product/middleware/parliamentarian';
import sync from '@product/middleware/sync';

export default configureStore({
  middleware: [
    parliamentarian,
    sync,
  ],
  reducer: {
    assembly,
    auth,
    modal,
    previewMode,
    snacks,
    snapshot,
    workspace,
  },
});
