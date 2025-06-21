// import { normalizeString } from "./NormalizeString.js";

// const buildMatchCondition = (key, value) => {
//   if (typeof value === 'string' && value.trim()) {
//     return { [key]: normalizeString(value) };
//   }
//   if (typeof value === 'number') {
//     return { [key]: value };
//   }
//   if (value instanceof Date) {
//     return { [key]: value };
//   }
//   return null;
// };

// const SearchQuery = (search = {}) => {
//   const matchConditions = [];
//   for (const [key, value] of Object.entries(search)) {
//     const condition = buildMatchCondition(key, value);
//     if (condition) {
//       matchConditions.push(condition);
//     }
//   }
//   return matchConditions.length > 0 ? { $match: { $and: matchConditions } } : null;
// };

// export default SearchQuery;

import { normalizeString } from "./NormalizeString.js";

const buildMatchCondition = (key, value) => {
  if (typeof value === 'string' && value.trim()) {
    return {
      [key]: { $regex: `^${value.trim()}`, $options: 'i' },
    };
  }
  if (typeof value === 'number') {
    return { [key]: value };
  }
  if (value instanceof Date) {
    return { [key]: value };
  }
  return null;
};


const SearchQuery = (search = {}) => {
  const matchConditions = [];
  for (const [key, value] of Object.entries(search)) {
    const condition = buildMatchCondition(key, value);
    if (condition) {
      matchConditions.push(condition);
    }
  }
  return matchConditions.length > 0 ? { $match: { $and: matchConditions } } : null;
};

export default SearchQuery;
