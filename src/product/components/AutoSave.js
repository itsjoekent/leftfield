import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Typography } from 'pkg.admin-components';
import { selectWebsiteId } from '@product/features/assembly';
import { clear, selectAutoSave } from '@product/features/autoSave';
import useProductApi from '@product/hooks/useProductApi';

export default function AutoSave() {
  const dispatch = useDispatch();
  const hitApi = useProductApi();

  const websiteId = useSelector(selectWebsiteId);
  const { latestRevision } = useSelector(selectAutoSave);

  const [isSaving, setIsSaving] = React.useState(false);

  React.useEffect(() => {
    if (!latestRevision) return;

    setIsSaving(true);
    const timeoutId = setTimeout(() => {
      hitApi(
        'post',
        'update-website',
        {
          websiteId,
          updatedVersion: latestRevision
        },
        () => {
          dispatch(clear());
          setIsSaving(false);
        },
      );
    }, 1500);

    return () => clearTimeout(timeoutId);
  }, [websiteId, latestRevision]);

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