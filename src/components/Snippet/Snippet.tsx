import { createElement, useEffect, useRef } from 'react';
import { waitForElement } from '../../utils/dom-utility';
import { rewriteLinks } from '../../utils/onetrust-utils';
import routes from '../../routes';

type Props = {
    html: string;
    waitForElementCondition: string | null | undefined;
    waitForElementFunction: () => void | null | undefined;
};

export default function Snippet({html, waitForElementCondition, waitForElementFunction = () => {}}: Props) {

  const divRef = useRef<any>(null);

  useEffect(() => {
    const innerHtml = document.createRange().createContextualFragment(html);
    divRef.current.innerHTML = '';
    divRef.current.appendChild(innerHtml);

    if (waitForElementCondition) {
      waitForElement(waitForElementCondition).then(waitForElementFunction)
      .catch((reason) => {
        
      });
    }

  }, [divRef]);
  
  return createElement('div', { ref: divRef });
  
}

