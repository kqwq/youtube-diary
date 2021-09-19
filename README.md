# YouTube Comment Downloader

This project is specifically designed for searching through diary comments under this video: https://www.youtube.com/watch?v=HQnC1UHBvWA

DiaryData.json contains everyone's diary and non-diary entries.

## Run locally

### Data collection
1. Clone this repo
2. Run npm install
3. `npm run load_all` to load all comments under the video
4. `npm run update` to append latest comments (up to 100) to the comment database
5. `npm run format` to format comments by user with organized diary entries

Repeat steps 4-5 daily to stay up-to-date

## Website component
Visit [url]