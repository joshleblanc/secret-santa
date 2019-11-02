import { match } from './match';

const arr = [1,2,3,4,5,6];

describe("match", () => {
  it("creates matches", () => {
    const matches = match(arr);

    console.log(matches);
  });
});

