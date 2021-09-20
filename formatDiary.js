const fs = require('fs');
const commentData = require('./data/comments.json');

if (fs.existsSync('./data/comments.json')) {
  fs.rmSync('./data/comments.json') // Remove this file because it's large and not needed
}

let users = {}

for (let comment of commentData.comments) {
  // Extract day from comment text
  let text = comment.textOriginal
  
  // Convert spelt out number to number digit (Thank you Github Copilot)
  let textDigitized = text.replace(/\b(one|two|three|four|five|six|seven|eight|nine|ten)\b/g, function(match) {
    return match.replace(/one/g, 1).replace(/two/g, 2).replace(/three/g, 3).replace(/four/g, 4).replace(/five/g, 5).replace(/six/g, 6).replace(/seven/g, 7).replace(/eight/g, 8).replace(/nine/g, 9).replace(/ten/g, 10)
  })

  // Match first instance of a number
  let day = textDigitized.match(/day \d+/im)?.[0] || textDigitized.match(/\d+/m)?.[0]
  if (day) {
    day = day.replace(/day /gmi, '').toString()
  }

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
    if (userMatch.diary[day]) {
      // Resolve with (1) windows folder notation, (1) turns into (2) and so on
      let parenthesisNum = day.match(/\((\d+)\)/)?.[0]
      if (parenthesisNum) {
        day = day.replace(/\((\d+)\)/, `(${parseInt(parenthesisNum) + 1})`)
      } else {
        day += ` (1)`
      }
      // Debugging
      // console.log(`${userMatch.name} has a duplicate day ${day}`);
    }
    userMatch.diary[day] = bundle
  } else {
    userMatch.nonDiurnal.push(bundle)
  }
}

// Discard all users who have no diary entries and sort diary entries by date published
console.log(Object.keys(users).length, 'Total comments');
for (let userId in users) {

  // Discard users who have no diary entries
  let user = users[userId]
  if (Object.keys(user.diary).length == 0) {
    delete users[userId]
    continue
  }

  // Discard users who do not have 2+ diary entries containing the word "day"
  let numberOfDayEntries = 0
  for (let day in user.diary) {
    if (user.diary[day].text.includes('day')) {
      numberOfDayEntries ++
    }
  }
  if (numberOfDayEntries < 2) {
    delete users[userId]
    continue
  }

  // Sort diary entries by date published
  user.diary = Object.keys(user.diary).sort((a, b) => {
    return new Date(a.published) - new Date(b.published)
  }).reduce((obj, key) => {
    obj[key] = user.diary[key]
    return obj
  }, {})
}
console.log(Object.keys(users).length, 'Comments with 2+ day diary history');

// Write to file
let formattedData = {
  fetchFromYouTubeDate: commentData.currentDate,
  formatDate: new Date(),
  videoId: commentData.videoId,
  totalComments: commentData.totalComments,
  users: users
}
fs.writeFileSync(`./data/formatted.json`, JSON.stringify(formattedData))

// CSV compressed output
// let csv = `"User","Day","Text","Likes","Replies","Published"\n`
// for (let userId in users) {
//   let user = users[userId]
//   for (let day in user.diary) {
//     let bundle = user.diary[day]
//     csv += `${0},${JSON.stringify(bundle.text)},${bundle.likes},${bundle.replies},${bundle.published}\n`
//   }
// }
// fs.writeFileSync(`./data/dairies.csv`, csv)
    

// Break into multiple files by channel ID
if (!fs.existsSync('./data/channel')) {
  fs.mkdirSync(`./data/channel`) // Create channel folder if it doesn't exist
}
for (let userId in users) {
  let user = users[userId]
  fs.writeFileSync(`./data/channel/${userId}.json`, JSON.stringify(user, null, 2))
}

// Create list of channel IDs
let channelList = []
for (let userId in users) {
  let user = users[userId]
  channelList.push({
    id: userId,
    name: user.name,
    imageUrl: user.imageUrl,
    diaryLength: Object.keys(user.diary).length,
    nonDiurnalLength: user.nonDiurnal.length
  })
}
// Sort by number of diary entries
channelList.sort((a, b) => {
  return b.diaryLength - a.diaryLength
})
fs.writeFileSync(`./data/channelIds.json`, JSON.stringify(channelList, null, 2))