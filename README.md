# YouTube Comment Downloader

This project is specifically designed for searching through diary comments under this video: https://www.youtube.com/watch?v=HQnC1UHBvWA

DiaryData.json contains everyone's diary and non-diary entries.

## Run locally

### Data collection
1. Clone this repo
2. Create file `.env` with the following keys:<br>
`YOUTUBE_API_KEY=` Private API key<br>
`YOUTUBE_VIDEO_ID=HQnC1UHBvWA`
`MONGO_URI=` URI to mongodb database
3. `npm install`
4. `npm run init` to load all comments, format data, start an express server over over localhost:3000, and keep all files up-to-date daily (with logs).

### Routes
/channel/`CHANNEL_ID` => Return comment info
/channelIds => Return array of all available channels


## Website component
Visit [url]