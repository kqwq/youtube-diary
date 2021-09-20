console.log('start')

import dotenv from 'dotenv'
import fs from 'fs'
import fetch from 'node-fetch'

dotenv.config()

var video_id = process.env.YOUTUBE_VIDEO_ID

// Retieve comments from YouTube API
const getComments = async (videoId, nextPageToken) => {
  let url = `https://www.googleapis.com/youtube/v3/commentThreads?part=snippet&videoId=${videoId}&maxResults=100&key=${process.env.YOUTUBE_API_KEY}`;
  if (nextPageToken) {
    url += `&pageToken=${nextPageToken}`
  }
  const response = await fetch(url)
  const data = await response.json()
  return data
}

let allComments = []
let i = 0

const sleep = (ms) => {
  return new Promise(resolve => setTimeout(resolve, ms))
}

async function commentCycle(videoId, pageToken) {
  // Get comments
  console.log('Awaiting comments');
  let response = await getComments(videoId, pageToken==='firstPass' ? false : pageToken)
  let items = response.items
  let nextPageToken = response.nextPageToken

  // Debug log response to file
  // fs.writeFileSync(`./${videoId}.json`, JSON.stringify(response, null, 2))

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

  // Append comments to allComments
  allComments = allComments.concat(formattedComments)

  // Return next page token
  return nextPageToken
}

(async ()=>{
  if (!fs.existsSync(`./data`)) {
    fs.mkdirSync(`./data`)
  }
  let nextPageToken = 'firstPass'
  while(nextPageToken) {
    nextPageToken = await commentCycle(video_id, nextPageToken)
    console.log('\n ---- nextPageToken', nextPageToken, i, ' ---- ');
    i ++

    // Sleep for 1 second
    await sleep(1000)
  }
  
  // Write comments to file
  console.log('Writing comments to file (load_all.js)');
  fs.writeFileSync(`./data/comments.json`, JSON.stringify({
    comments: allComments,
    videoId: video_id,
    currentDate: new Date(),
    totalComments: allComments.length
  }, null, 2))

  console.log('end');
})()