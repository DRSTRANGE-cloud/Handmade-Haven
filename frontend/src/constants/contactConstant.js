import React from 'react';
import { FaInstagram, FaTwitterSquare } from 'react-icons/fa';
import { HiMail } from 'react-icons/hi';

export const contactItems = [
  {
    id: 1,
    icon: <a href="mailto:contact@shopHandmadeHaven.live"><HiMail /></a>,
    title: 'email',
    description: 'contact@shopHandmadeHaven.live',
  },
  {
    id: 2,
    icon: <a href="https://twitter.com/shopHandmadeHaven" target="_blank" rel="noopener noreferrer"><FaTwitterSquare /></a>,
    title: 'twitter',
    description: 'shop.HandmadeHaven',
  },
  {
    id: 3,
    icon: <a href="https://instagram.com/shopHandmadeHaven" target="_blank" rel="noopener noreferrer"><FaInstagram /></a>,
    title: 'instagram',
    description: 'shop.HandmadeHaven',
  },
];