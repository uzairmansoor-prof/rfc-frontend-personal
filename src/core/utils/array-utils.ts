import { isEmpty } from "./functions";
import Fuse from "fuse.js";

export const genericSearch = (
  data: any[],
  keysToSearch: string[],
  searchvalue: string,
) => {
  if (isEmpty(searchvalue)) return data;

  const options = {
    includeMatches: true,
    minMatchCharLength: 1,
    ignoreLocation: true,
    includeScore: true,
    keys: keysToSearch,
  };

  const fuseIndex = Fuse.createIndex(keysToSearch, data);
  const fuse = new Fuse(data, options, fuseIndex);

  const searchResult = fuse.search(`${searchvalue}`);
  return searchResult
    .filter(({ matches }) =>
      matches.some(({ value }) => {
        return String(value).toLowerCase().includes(searchvalue.toLowerCase());
      }),
    )
    .map(({ item }) => item);
};

export const removeSpecificDuplicates = (arr) => {
  const countMap = new Map();

  for (const item of arr) {
    countMap.set(item, (countMap.get(item) || 0) + 1);
  }

  return arr.filter((item) => item !== 2 || countMap.get(item) === 1);
};
