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
<path fill-rule="evenodd" clip-rule="evenodd" d="M5.30673 16.3821C5.6451 16.899 6.04388 17.3775 6.49677 17.8067C7.61896 18.8703 9.02532 19.586 10.5457 19.8671C12.0661 20.1482 13.6354 19.9826 15.0637 19.3905C16.492 18.7984 17.7181 17.8051 18.5937 16.5308C19.4693 15.2564 19.9568 13.7557 19.9973 12.21C20.0379 10.6644 19.6296 9.14014 18.822 7.82167C18.0144 6.5032 16.842 5.44701 15.4467 4.78089C14.5023 4.33008 13.4833 4.07101 12.448 4.01294L13.0032 6.08484C13.5483 6.17728 14.0809 6.34509 14.585 6.58577C15.6315 7.08536 16.5108 7.8775 17.1165 8.86635C17.7222 9.8552 18.0284 10.9984 17.998 12.1576C17.9676 13.3168 17.602 14.4424 16.9453 15.3982C16.2886 16.3539 15.369 17.0989 14.2978 17.543C13.2266 17.9871 12.0496 18.1112 10.9093 17.9004C9.76901 17.6896 8.71424 17.1529 7.8726 16.3551C7.69686 16.1886 7.53198 16.0121 7.37863 15.8269L5.30673 16.3821Z" fill={color}/>
<path d="M5.91239 4.06647C6.68924 3.47037 7.54796 2.99272 8.46042 2.64739C8.87978 2.48868 9.08946 2.40932 9.28694 2.51053C9.48442 2.61174 9.54649 2.84338 9.67063 3.30667L11.7412 11.0341C11.8632 11.4894 11.9242 11.7171 11.8206 11.8964C11.7171 12.0758 11.4894 12.1368 11.0341 12.2588L3.30667 14.3294C2.84338 14.4535 2.61174 14.5156 2.42535 14.3952C2.23896 14.2747 2.20284 14.0535 2.13061 13.6109C1.97344 12.6481 1.95774 11.6656 2.08555 10.6947C2.25696 9.39275 2.68314 8.13728 3.33975 7C3.99636 5.86272 4.87054 4.8659 5.91239 4.06647Z" stroke={color} stroke-width="2"/>
</svg>
  );
}

export default withTheme(Icon);
