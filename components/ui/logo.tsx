import Image, { type ImageProps } from "next/image";

type LogoSize = "sm" | "md" | "lg" | "xl";
type LogoTone = "adaptive" | "light" | "dark";

type LogoProps = Omit<ImageProps, "src" | "width" | "height"> & {
  size?: LogoSize;
  tone?: LogoTone;
};

const sizeClasses: Record<LogoSize, string> = {
  sm: "size-5",
  md: "size-7",
  lg: "size-10",
  xl: "size-12",
};

const pixelSizes: Record<LogoSize, number> = {
  sm: 20,
  md: 28,
  lg: 40,
  xl: 48,
};

const toneClasses: Record<LogoTone, string> = {
  adaptive: "brightness-0 dark:invert",
  light: "brightness-0 invert",
  dark: "brightness-0",
};

export function Logo({
  size = "md",
  tone = "adaptive",
  alt = "Yusuf Dere",
  className = "",
  ...props
}: LogoProps) {
  return (
    <Image
      src="/brand/yd-logo.svg"
      alt={alt}
      width={pixelSizes[size]}
      height={pixelSizes[size]}
      draggable={false}
      className={`block object-contain ${sizeClasses[size]} ${toneClasses[tone]} ${className}`}
      {...props}
    />
  );
}
