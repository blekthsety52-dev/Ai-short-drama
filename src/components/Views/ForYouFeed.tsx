import React from 'react';
import { VerticalVideoPlayer } from '../Player/VerticalVideoPlayer';

export const ForYouFeed: React.FC = () => {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center">
      <VerticalVideoPlayer />
    </div>
  );
};
