/**
 * Randomize array element order in-place.
 * Using Durstenfeld shuffle algorithm.
 * https://stackoverflow.com/a/12646864/2424975
 */
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    let temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
}

function partition(arr, size) {
  const ret = [];
  for(let i = 0; i < arr.length; i++) {
    ret.push(arr.slice(i, i + size));
  }
  return ret;
}

export function match(arr) {
  shuffleArray(arr);
  const matches = partition(arr);
}