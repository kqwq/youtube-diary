import dotenv from 'dotenv'
import { Comment, User, DiaryEntry } from '../models/list.js'
dotenv.config()

function findDayFromText(text) {
  // Convert spelt out number to number digit (Thank you Github Copilot)
  let textDigitized = text.replace(/\b(one|two|three|four|five|six|seven|eight|nine|ten)\b/g, function (match) {
    return match.replace(/one/g, 1).replace(/two/g, 2).replace(/three/g, 3).replace(/four/g, 4).replace(/five/g, 5).replace(/six/g, 6).replace(/seven/g, 7).replace(/eight/g, 8).replace(/nine/g, 9).replace(/ten/g, 10)
  })

  // Match first instance of a number
  let day = textDigitized.match(/day \d+/im)?.[0] || textDigitized.match(/\d+/m)?.[0]
  if (day) {
    day = day.replace(/day /gmi, '').toString()
  }
  return day
}

async function addCommentToDatabases(comments) {
  // Add comments to Comment database
  await Comment.insertMany(comments)
  
  for (let comment of comments) {
    // Extract day from comment text
    let text = comment.textOriginal
    let day = findDayFromText(text)

    // Match user to database or create new user
    let user = await User.findOne({ channelId: comment.authorChannelId || "ChannelDoesNotExist" })
    if (!user) {
      user = new User({
        channelId: comment.authorChannelId,
        imageUrl: comment.authorProfileImageUrl,
        name: comment.authorDisplayName,
        diary: [],
        nonDiurnal: [],
        diaryLength: 0,
        nonDiurnalLength: 0,
        totalLikeCount: 0,
        totalReplyCount: 0,
      })
    }

    // Create diary/nondurial entry
    let entry = new DiaryEntry({
      day: day || 'none',
      text: text,
      likes: comment.likeCount,
      published: comment.publishedAt,
      replies: comment.totalReplyCount,
    })
    
    // Add diary entry to user's diary
    if (day) {
      user.diary.push(entry)
      user.diaryLength++
    } else {
      user.nonDiurnal.push(entry)
      user.nonDiurnalLength++
    }    
    user.totalLikeCount += comment.likeCount
    user.totalReplyCount += comment.totalReplyCount
    await user.save()
  }
}

export { addCommentToDatabases }