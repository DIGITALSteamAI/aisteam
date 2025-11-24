import Image from "next/image";

type Props = {
  cmsType: string;
};

export default function CmsIcon({ cmsType }: Props) {
  const type = (cmsType ?? "wordpress").toLowerCase();


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

  const icon = icons[type] ?? {
    src: "/icon-generic.png",
    alt: "Generic CMS"
  };

  return (
<Image
  src={icon.src}
  alt={icon.alt}
  width={36}
  height={36}
  style={{ objectFit: "contain" }}
/>




  );
}
