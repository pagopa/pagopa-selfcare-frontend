import { createElement, useEffect, useRef } from 'react';

type Props = {
    html: string;
};

export default function Snippet({html}: Props) {

  const divRef = useRef<any>(null);

  useEffect(() => {
    const innerHtml = document.createRange().createContextualFragment(html);
    divRef.current.innerHTML = '';
    divRef.current.appendChild(innerHtml);
  }, [divRef]);
  
  return createElement('div', { ref: divRef });
  
}