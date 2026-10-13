import Image, { ImageProps } from "next/image";
import React from "react";

export interface IImageCustomProps extends ImageProps {
  fallbackSrc?: string;
}

export default function ImageCustom({
  alt,
  src,
  fallbackSrc = "/assets/images/placeholder.png",
  ...props
}: IImageCustomProps) {
  const [imgSrc, setImgSrc] = React.useState(src);

  return (
    <Image
      alt={alt}
      src={imgSrc}
      onError={() => {
        if (fallbackSrc) setImgSrc(fallbackSrc);
      }}
      {...props}
    />
  );
}
