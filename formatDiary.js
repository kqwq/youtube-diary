import fs from 'fs'
import commentData from './data/HQnC1UHBvWA.json'

let users = {}

for (let comment of commentData.comments) {
  // Extract day from comment text
  let text = comment.textOriginal
  
  // Convert spelt out number to number digit (Thank you Github Copilot)
  let textDigitized = text.replace(/\b(one|two|three|four|five|six|seven|eight|nine|ten)\b/g, function(match) {
    return match.replace(/one/g, 1).replace(/two/g, 2).replace(/three/g, 3).replace(/four/g, 4).replace(/five/g, 5).replace(/six/g, 6).replace(/seven/g, 7).replace(/eight/g, 8).replace(/nine/g, 9).replace(/ten/g, 10)
  })

  // Match first instance of a number
  let day = textDigitized.match(/\d+/)?.[0]

  // Match user to database or create new user
  let userId = comment.authorChannelId
  if (userId == null || userId == undefined) {
    userId = "ChannelDoesNotExist"
  }
  let userMatch = users[userId]
  if (!userMatch) {
    userMatch = users[userId] = {
      name: comment.authorDisplayName,
      imageUrl: comment.authorProfileImageUrl,
      diary: {},
      nonDiurnal: []
    }
  }

  // Add comment to user's diary
  let bundle = {
    text: text,
    likes: comment.likeCount,
    published: comment.publishedAt,
    replies: comment.totalReplyCount,
  }
  if (day) {
    userMatch.diary[day] = bundle
  } else {
    userMatch.nonDiurnal.push(bundle)
  }

}

// Write to file
let formattedData = {
  fetchFromYouTubeDate: commentData.currentDate,
  formatDate: new Date(),
  videoId: commentData.videoId,
  totalComments: commentData.totalComments,
  users: users
}
fs.writeFileSync(`DiaryData.json`, JSON.stringify(formattedData, null, 2))