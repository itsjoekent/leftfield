import React from 'react';
import get from 'lodash/get';
import { Helmet } from 'react-helmet';
import {
  META_DESCRIPTION,
  META_IMAGE,
  META_TITLE,
} from 'pkg.campaign-components/constants/settings';
import useLanguage from 'pkg.campaign-components/hooks/useLanguage';
import getSettingValue from 'pkg.campaign-components/utils/getSettingValue';

export const TAG = 'Root';

export const SECTIONS_SLOT = 'SECTIONS_SLOT';

export const BACKGROUND_STYLE = 'BACKGROUND_STYLE';

export default function Root(props) {
  const { componentClassName, settings, slots } = props;

  const language = useLanguage();

  const title = getSettingValue(settings, META_TITLE.key, language);
  const description = getSettingValue(settings, META_DESCRIPTION.key, language);
  const image = getSettingValue(settings, META_IMAGE.key, language);

  return (
    <React.Fragment>
      <Helmet>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta property="og:type" content="website" />
        <meta property="og:locale" content={language.replace('-', '_')} />
      </Helmet>
      {!!title && (
        <Helmet>
          <title>{title}</title>
          <meta name="title" content={title} />
          <meta property="twitter:title" content={title} />
        </Helmet>
      )}
      {!!description && (
        <Helmet>
          <meta name="description" content={description} />
          <meta property="twitter:description" content={description} />
        </Helmet>
      )}
      {!!image && (
        <Helmet>
          <meta property="og:image" content={image} />
          <meta property="twitter:card" content="summary_large_image" />
          <meta property="twitter:image" content={image} />
        </Helmet>
      )}
      <div className={componentClassName}>
        {get(slots, SECTIONS_SLOT, null)}
      </div>
    </React.Fragment>
  );
}
