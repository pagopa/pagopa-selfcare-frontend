export const extractTaxonomy = (inputTaxonomy : any) => {
  const matchedContent = inputTaxonomy.match(/\/(\d+)\D*\//);  
  return matchedContent ? matchedContent[1] : inputTaxonomy;
};