import dotenv from 'dotenv'
import { getComments } from './actions/fetchYoutube.js'
import { addCommentToDatabases } from './actions/toDB.js'
import { Comment } from './models/list.js'
dotenv.config()
 

async function updateComments() {
  const videoId = process.env.YOUTUBE_VIDEO_ID

  console.log('Fetching comments...');
  let { comments, uselessToken } = await getComments(videoId)
  
  console.log('Getting newest comment date');
  let date = await Comment.findOne({}, {}, { sort: { 'publishedAt': -1 } })
  console.log('Last comment', date);
  let newestStoredDate = new Date(date.publishedAt)

  console.log('Filtering comments (newer comments only)');
  comments = comments.filter(comment => {
    let commentDate = new Date(comment.publishedAt)
    return commentDate > newestStoredDate
  })
  
  console.log(`Saving ${comments.length} comments to database`);
  await addCommentToDatabases(comments)  
}

// Every 24 hours, update comments
updateComments()
setInterval(updateComments, 1000 * 60 * 60 * 24)