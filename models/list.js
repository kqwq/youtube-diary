import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

// Connect to server
mongoose.connect(process.env.MONGO_URI);

// Define new mongoose schema to hold comments
const commentSchema = new mongoose.Schema({
  authorDisplayName: String,
  authorProfileImageUrl: String,
  textOriginal: String,
  likeCount: Number,
  publishedAt: Date,
  totalReplyCount: Number,
  authorChannelId: String,
})

const diaryEntry = new mongoose.Schema({
  day: String,
  text: String,
  likes: Number,
  replies: Number,
  published: Date,
})

const userSchema = new mongoose.Schema({
  channelId: String,
  imageUrl: String,
  name: String,
  diary: [diaryEntry],
  nonDiurnal: [diaryEntry],
  diaryLength: Number,
  nonDiurnalLength: Number,
  totalLikeCount: Number,
  totalReplyCount: Number,
})


const Comment = mongoose.model('Comment', commentSchema);
const DiaryEntry = mongoose.model('Diary', diaryEntry);
const User = mongoose.model('DiaryCollection', userSchema);

export { Comment, DiaryEntry, User };
