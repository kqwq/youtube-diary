import fetch from 'node-fetch'

// Retieve comments from YouTube API
const getComments = async (videoId, nextPageToken) => {
  let url = `https://www.googleapis.com/youtube/v3/commentThreads?part=snippet&videoId=${videoId}&maxResults=100&key=${process.env.YOUTUBE_API_KEY}`;
  if (nextPageToken) {
    url += `&pageToken=${nextPageToken}`
  }
  const response = await fetch(url)
  const data = await response.json()
  let comments = data.items
  nextPageToken = data.nextPageToken

  // Format comments, removing unnecessary data
  comments = comments.map(comment => {
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
  return { comments, nextPageToken }
}

export { getComments }