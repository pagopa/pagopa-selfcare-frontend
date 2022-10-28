import { ENV } from '../utils/env';

const anchorBitsRegex = /href="(#.*)"/gi;
const localAssetsRegex = /..\/..\/..\/public/gi;

export function getReplacedAssetsPaths(htmlString: string) {
  const { pathname } = window.location;
  return htmlString
    .replace(anchorBitsRegex, `href="${pathname}$1"`)
    .replace(localAssetsRegex, ENV.PUBLIC_URL);
}
