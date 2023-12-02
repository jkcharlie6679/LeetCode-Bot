import fetch from "node-fetch"

const LEETCODE_API_ENDPOINT = "https://leetcode.com/graphql"
const DAILY_CODING_CHALLENGE_QUERY = `
query questionOfToday {
  activeDailyCodingChallengeQuestion {
    date
    userStatus
    link
    question {
      acRate
      difficulty
      freqBar
      frontendQuestionId: questionFrontendId
      isFavor
      paidOnly: isPaidOnly
      status
      title
      titleSlug
      hasVideoSolution
      hasSolution
      topicTags {
        name
        id
        slug
      }
    }
  }
}`

const fetchDailyCodingChallenge = async () => {
  const init = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query: DAILY_CODING_CHALLENGE_QUERY }),
  }
  const res = await fetch(LEETCODE_API_ENDPOINT, init)
  const status = res.status;
  const data = await res.json();
  return [status, data];
}

export { fetchDailyCodingChallenge }
