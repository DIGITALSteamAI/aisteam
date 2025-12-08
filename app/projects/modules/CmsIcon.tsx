import Image from "next/image";

type Props = {
  // Raw CMS type from DB like "WordPress" or "Shopify"
  cmsType?: string;
  // Optional direct icon path like "/icon-wordpress.png"
  srcOverride?: string;
};

export default function CmsIcon({ cmsType, srcOverride }: Props) {
  const type = (cmsType ?? "").toLowerCase().trim();

  const icons: Record<string, { src: string; alt: string }> = {
    wordpress: {
      src: "/icon-wordpress.png",
      alt: "WordPress"
    },
    shopify: {
      src: "/icon-shopify.png",
      alt: "Shopify"
    },
    webflow: {
      src: "/icon-webflow.png",
      alt: "Webflow"
    },
    squarespace: {
      src: "/icon-squarespace.png",
      alt: "Squarespace"
    }
  };

  let src = "/icon-generic.png";
  let alt = "Generic CMS";

  if (srcOverride && srcOverride.startsWith("/")) {
    src = srcOverride;
    alt = cmsType || alt;
  } else if (type && icons[type]) {
    src = icons[type].src;
    alt = icons[type].alt;
  }

  return (
    <Image
      src={src}
      alt={alt}
      width={36}
      height={36}
      style={{ objectFit: "contain" }}
    />
  );
}
