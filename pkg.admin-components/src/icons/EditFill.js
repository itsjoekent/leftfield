/**
 * @WARNING
 * This code is autogenerated by ${root}/icon-helper/transform.js
 */

import React from 'react';
import { withTheme } from 'styled-components';

function Icon(props) {
  const {
    width = 24,
    height = 24,
    color = props.theme.colors.mono[100],
  } = props;

  return (
    <svg width={width} height={height} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path fill-rule="evenodd" clip-rule="evenodd" d="M17.204 10.796L19 9C19.5453 8.45475 19.8179 8.18213 19.9636 7.88803C20.2409 7.32848 20.2409 6.67153 19.9636 6.11197C19.8179 5.81788 19.5453 5.54525 19 5C18.4547 4.45475 18.1821 4.18213 17.888 4.03639C17.3285 3.75911 16.6715 3.75911 16.112 4.03639C15.8179 4.18213 15.5452 4.45475 15 5L13.1813 6.81866C14.1452 8.46926 15.5314 9.84482 17.204 10.796ZM11.7269 8.27312L4.85638 15.1436C4.43132 15.5687 4.21879 15.7812 4.07905 16.0423C3.93932 16.3034 3.88037 16.5981 3.76248 17.1876L3.14709 20.2646C3.08057 20.5972 3.0473 20.7635 3.14191 20.8581C3.23652 20.9527 3.40283 20.9194 3.73544 20.8529L6.81242 20.2375C7.40187 20.1196 7.69659 20.0607 7.95769 19.9209C8.21879 19.7812 8.43132 19.5687 8.85638 19.1436L15.7458 12.2542C14.1241 11.2386 12.7524 9.87628 11.7269 8.27312Z" fill={color}/>
</svg>
  );
}

export default withTheme(Icon);
