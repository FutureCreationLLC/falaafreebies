import React from 'react';

export interface FreebieItem {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  distance: string; // e.g., "0.5 mi"
  postedAt: string; // e.g., "2h ago"
  isLocal?: boolean; // If true, imageUrl is a blob URL
}

export enum AppView {
  HOME = 'HOME',
  UPLOAD = 'UPLOAD',
  PROFILE = 'PROFILE',
  SETTINGS = 'SETTINGS'
}

export interface NavItem {
  id: AppView;
  label: string;
  icon: React.ReactNode;
}