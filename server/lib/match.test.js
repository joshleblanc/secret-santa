import assert from "assert";
import { match } from './match';

describe("match", () => {
  it("creates matches for even arrays", () => {
    const arr = [1,2,3,4,5,6];
    const matches = match(arr);

    assert(matches.length === 6, "it created the correct number of matches");
    assert(matches.every(m => m.length === 2), "every match has 2 elements");
    console.log(matches);
  });

  it('creates matches for odd arrays', () => {
    const arr = [1,2,3,4,5];
    const matches = match(arr);

    assert(matches.length === 5, "it created the correct number of matches");
    assert(matches.every(m => m.length === 2), "every match has 2 elements");
  });
});

