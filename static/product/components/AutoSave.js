import React from 'react';
import { batch, useDispatch, useSelector } from 'react-redux';
import { Typography } from 'pkg.admin-components';
import { selectWebsiteId } from '@product/features/assembly';
import {
  clearUpdates,
  setSnapshotId,
  selectSnapshotUpdate,
} from '@product/features/snapshot';
import useProductApi from '@product/hooks/useProductApi';

export default function AutoSave() {
  const dispatch = useDispatch();
  const hitApi = useProductApi();

  const websiteId = useSelector(selectWebsiteId);
  const { data, description } = useSelector(selectSnapshotUpdate);

  const [isSaving, setIsSaving] = React.useState(false);

  React.useEffect(() => {
    if (!data || !websiteId) return;

    setIsSaving(true);

    const descriptionStringified = description
      .filter((line) => !!line)
      .join(', ');

    const timeoutId = setTimeout(() => {
      hitApi({
        method: 'put',
        route: `/website/${websiteId}`,
        payload: {
          updatedData: data,
          description: descriptionStringified,
        },
        onResponse: ({ json, ok }) => {
          if (ok) {
            batch(() => {
              dispatch(clearUpdates());
              dispatch(setSnapshotId(json.snapshotId));
            });
          }

          setIsSaving(false);
        },
        onFatalError: () => setIsSaving(false),
      });
    }, 1500);

    return () => clearTimeout(timeoutId);
  }, [websiteId, data, description]);

  return (
    <Typography
      fontStyle="light"
      fontSize="12px"
      fg={(colors) => colors.mono[600]}
    >
      {isSaving ? 'Saving...' : 'All changes saved'}
    </Typography>
  );
}
