console.log('start')

import dotenv from 'dotenv'
import { addCommentToDatabases } from './actions/toDB.js'
import { getComments } from './actions/fetchYoutube.js'

dotenv.config()
var videoId = process.env.YOUTUBE_VIDEO_ID

let i = 0
const sleep = (ms) => {
  return new Promise(resolve => setTimeout(resolve, ms))
}

(async ()=>{
  let nextPageToken = 'firstPass'
  while(nextPageToken) {

    console.log('Fetching comments');
    let comments
    ({ comments, nextPageToken } = await getComments(videoId, nextPageToken==='firstPass' ? false : nextPageToken))

    console.log('Saving comments');
    await addCommentToDatabases(comments)

    console.log('\n ---- nextPageToken', nextPageToken, i, ' ---- ');
    i ++    
    await sleep(500)// Sleep for 0.5 second
  }
  console.log('finished loading all');
})()
