import fetch from 'node-fetch'
import fs from 'fs'
import dotenv from 'dotenv'
import { exec } from 'child_process'
dotenv.config()


// Retieve comments from YouTube API
const getComments = async (videoId) => {
  let url = `https://www.googleapis.com/youtube/v3/commentThreads?part=snippet&videoId=${videoId}&maxResults=100&key=${process.env.YOUTUBE_API_KEY}`;
  const response = await fetch(url)
  const data = await response.json()
  return data
}

async function getLast100(videoId) {
  // Get comments
  console.log('Awaiting comments');
  let response = await getComments(videoId)
  let items = response.items

  // Format comments, removing unnecessary data
  console.log('Formatting comments');
  const formattedComments = items.map(comment => {
    const { snippet } = comment
    const { topLevelComment, totalReplyCount } = snippet
    const { authorDisplayName, authorProfileImageUrl, likeCount, publishedAt, textOriginal, authorChannelId } = topLevelComment.snippet
    return {
      authorDisplayName,
      authorProfileImageUrl,
      textOriginal,
      likeCount,
      publishedAt,
      totalReplyCount,
      authorChannelId: authorChannelId?.value || null
    }
  })

  return formattedComments
}

async function updateComments() {
  const videoId = process.env.YOUTUBE_VIDEO_ID
  let newComments = await getLast100(videoId)
  console.log('Loading old comments');
  let oldComments = JSON.parse(fs.readFileSync('./data/comments.json')).comments
  let latestOldComment = oldComments[0]
  console.log('Combining comments');
  let numUpdated = 0
  for (let i = 0; i < newComments.length; i++) {
    const newComment = newComments[i]

    // If the new comment is newer than the old comment, add it to the old comments
    if (newComment.publishedAt > latestOldComment.publishedAt) {
      oldComments.unshift(newComment)
      numUpdated++
    }
  }
  console.log(`Updated ${numUpdated} comments`);

  let allComments = oldComments

  // Write comments to file
  console.log('Writing comments to file (periodic.js)');
  fs.writeFileSync(`./data/comments.json`, JSON.stringify({
    comments: allComments,
    videoId: videoId,
    currentDate: new Date(),
    totalComments: allComments.length
  }, null, 2))

  // Run node formatDiary.js
  console.log('Running formatDiary.js');
  exec('node formatDiary.js', (err, stdout, stderr) => {
    if (err) {
      console.error(err)
      return
    }
    console.log(stdout)
  })
}

// Every 24 hours, update comments
updateComments()
setInterval(updateComments, 1000 * 60 * 60 * 24)