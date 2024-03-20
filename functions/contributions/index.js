const express = require('express')
const functions = require('firebase-functions')
const cors = require('cors');
const app = express()

app.use(cors({
    origin: '*'
}));

exports.app = functions.https.onRequest(
    { secrets: ["GITHUB_PERSONAL_ACCESS_TOKEN"] }, (req, res) => {

        /**
         * Example:
         * contributions: [
         *    {
         *       date: '2021-9-22',
         *       count: 5
         *    }
         * ]
         */
        let contributions = []

        githubContributionData().then(data => {
            data.forEach(element => {
                element.contributionDays.forEach(day => {
                    contributions.push({
                        date: day.date,
                        count: day.contributionCount
                    })
                })
            });
        })

        let gitlabData = []

        gitlabContributionData().then(data => {
            gitlabData = Object.entries(data).map(([key, value]) => ({ date: key, count: value }))
        })

        contributions.forEach((element, index) => {
            const itemIndex = gitlabData.findIndex(item => item.date === element.date)

            if (itemIndex !== -1) {
                contributions[index].count = contributions[index].count + gitlabData[itemIndex].count
            }
        });

        const totalContributionCount = contributions.reduce((accumulator, contribution) => {
            return accumulator + contribution.count;
        }, 0);

        res.json({
            data: {
                totalContributionCount,
                contributions,
            }
        }, 200)
    })