import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Buttons, Icons, Typography } from 'pkg.admin-components';
import { selectWebsiteId } from '@product/features/assembly';
import { pushSnack } from '@product/features/snacks';
import useProductApi from '@product/hooks/useProductApi';

export default function PublishButton() {
  const hitApi = useProductApi();
  const [isPublishing, setIsPublishing] = React.useState(false);

  const dispatch = useDispatch();
  const websiteId = useSelector(selectWebsiteId);

  function onPublish() {
    setIsPublishing(true);

    hitApi({
      method: 'post',
      route: `/website/${websiteId}/publish`,
      onResponse: ({ ok }) => {
        if (ok) {
          dispatch(pushSnack({ message: 'Building your website, your changes will be live shortly!' }));
        }

        setIsPublishing(false);
      },
      onFatalError: () => setIsPublishing(false),
    });
  }

  return (
    <Buttons.Filled
      IconComponent={Icons.SendFill}
      paddingVertical="4px"
      paddingHorizontal="8px"
      buttonFg={(colors) => colors.mono[700]}
      buttonBg={(colors) => colors.yellow[600]}
      hoverButtonBg={(colors) => colors.yellow[700]}
      isLoading={isPublishing}
      onClick={onPublish}
    >
      <Typography
        fontStyle="bold"
        fontSize="16px"
      >
        Publish
      </Typography>
    </Buttons.Filled>
  );
}
