import React from 'react';
import {
  Editable,
  withReact,
  Slate,
} from 'slate-react';
import { createEditor } from 'slate';
import { withHistory } from 'slate-history';
import { Block, Flex } from 'pkg.admin-components';
import RichTextBlockButton from '@product/components/RichText/BlockButton';
import RichTextElement from '@product/components/RichText/Element';
import RichTextLeaf from '@product/components/RichText/Leaf';
import RichTextMarkButton from '@product/components/RichText/MarkButton';

export const BLANK_DEFAULT = [{ type: 'paragraph', children: [{ text: '' }] }];

export default function RichText(props) {
  const {
    apiRef = null,
    initialState = BLANK_DEFAULT,
    onChange,
  } = props;

  const [value, setValue] = React.useState(BLANK_DEFAULT);
  const renderElement = React.useCallback((props) => <RichTextElement {...props} />, []);
  const renderLeaf = React.useCallback((props) => <RichTextLeaf {...props} />, []);
  const editor = React.useMemo(() => withHistory(withReact(createEditor())), []);

  React.useEffect(() => {
    if (!!apiRef) {
      apiRef.current = { value, setValue };
    }
  }, [value]);

  function onChangeWrapper(value) {
    setValue(value);

    if (onChange) {
      onChange(value);
    }
  }

  return (
    <Slate
      editor={editor}
      value={value}
      onChange={onChangeWrapper}
    >
      <Flex.Column
        borderWidth="1px"
        borderColor={(colors) => colors.mono[400]}
        rounded={(radius) => radius.default}
      >
        <Flex.Row
          align="center"
          wrap="wrap"
          padding="4px"
          bg={(colors) => colors.mono[200]}
        >
          <RichTextMarkButton
            format="bold"
            icon="Bold"
            label="Toggle bold text"
          />
          <RichTextMarkButton
            format="italic"
            icon="Italic"
            label="Toggle italic text"
          />
          <RichTextMarkButton
            format="underline"
            icon="Underline"
            label="Toggle underline text"
          />
          <RichTextBlockButton
            format="heading-one"
            icon="Header1"
            label="Toggle heading level one"
          />
          <RichTextBlockButton
            format="heading-two"
            icon="Header2"
            label="Toggle heading level two"
          />
          <RichTextBlockButton
            format="heading-three"
            icon="Header3"
            label="Toggle heading level three"
          />
          <RichTextBlockButton
            format="heading-four"
            icon="Header4"
            label="Toggle heading level four"
          />
        </Flex.Row>
        <Block padding="6px">
          <Editable
            renderElement={renderElement}
            renderLeaf={renderLeaf}
            spellCheck
            autoFocus
          />
        </Block>
      </Flex.Column>
    </Slate>
  );
}
