export const rewriteLinks = (route: any, selectorString: string) => {
  const links = document.querySelectorAll(selectorString);
  links.forEach((l) => {
    const href = l.getAttribute('href');
    if (href?.startsWith('#', 0)) {
      const newHref = `${route}${href}`;
      l.setAttribute('href', newHref);
    }
  });
};