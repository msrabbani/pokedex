const titleFormat = text => text.charAt(0).toUpperCase() + text.slice(1);
const idFormat = (id, total) => {
  let idStr = id.toString()
  let max = total.toString().length
  let notFound = 'Number not found!'
  return idStr.length <= max ? '#' +'0'.repeat(max - idStr.length) + idStr : notFound
};

const emptyArray = arr => {
  arr.length < 1 || arr == undefined ? false : true;
};
const emptyObj = obj => {
  Object.entries(obj).length < 1 || obj == undefined ? false : true;
};
export { titleFormat, idFormat, emptyArray, emptyObj };
