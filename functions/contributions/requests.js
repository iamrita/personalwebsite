const axios = require('axios')

function githubContributionData() {
    return new Promise(resolve => {
        axios.post('https://api.github.com/graphql', {
            query: `query {
                          user(login: "iamrita"){
                            contributionsCollection {
                              contributionCalendar {
                                totalContributions
                                weeks {
                                contributionDays {
                                    contributionCount
                                    date
                                  }
                                }
                              }
                            }
                          }
                        }`
        }, {
            headers: {
                'Authorization': `Bearer ${process.env.GITHUB_PERSONAL_ACCESS_TOKEN}`,
            }
        }).then(response => {
            resolve(response.data.data.user.contributionsCollection.contributionCalendar.weeks)
        })
    });
}

function gitlabContributionData() {
    return new Promise(resolve => {
        axios.get(`https://gitlab.com/users/iamrita/calendar.json`).then(response => {
            resolve(response.data)
        })
    })
}

module.exports = {
    githubContributionData,
    gitlabContributionData,
}