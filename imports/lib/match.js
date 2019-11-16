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

function partition(arr) {
  const ret = [];
  let copy = arr.slice();

  for(let i = 0; i < arr.length; i++) {
    const slice = arr.slice(i, i + 2);
    ret.push(slice);
    copy = copy.filter(el => el !== slice[1]);
  }
  ret[ret.length - 1].push(copy[0]);
  return ret;
}

export function match(arr) {
  shuffleArray(arr);
  return partition(arr);
}
