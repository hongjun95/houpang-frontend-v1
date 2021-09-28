import React from 'react';

interface PreviewImgProps {
  previewImgUri: string | ArrayBuffer;
  className?: string;
}

const PreviewImg = ({ previewImgUri, className }: PreviewImgProps) => {
  return <img src={`${previewImgUri}`} className={className} />;
};

export default React.memo(PreviewImg);
