export const extractTaxonomy = (inputTaxonomy : any) => {
  const extractedContent = inputTaxonomy.split("/");
  return extractedContent.length > 1 ? extractedContent[1] : inputTaxonomy;
};