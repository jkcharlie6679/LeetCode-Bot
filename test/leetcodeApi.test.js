import { fetchDailyCodingChallenge } from "../src/leetcodeApi.js"

describe("Testing the fetchDailyCodingChallenge()", () => {
  it("Get the question title", () => {
    fetchDailyCodingChallenge().then(([status, _]) => {
      if (status !== 200) {
        throw new Error("Can't get the question title.");
      }
    });
  });
});
