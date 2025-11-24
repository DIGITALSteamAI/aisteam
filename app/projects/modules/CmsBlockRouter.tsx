import WordPressBlock from "./wordpress/CmsBlock";
import ShopifyBlock from "./shopify/CmsBlock";
import WebflowBlock from "./webflow/CmsBlock";
import GenericBlock from "./generic/CmsBlock";

type Props = {
  cmsType: string;
};

export default function CmsBlockRouter({ cmsType }: Props) {

  if (cmsType === "wordpress") {
    return <WordPressBlock />;
  }

  if (cmsType === "shopify") {
    return <ShopifyBlock />;
  }

  if (cmsType === "webflow") {
    return <WebflowBlock />;
  }

  return <GenericBlock />;
}
