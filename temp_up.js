import dotenv from 'dotenv'
import { getComments } from './actions/fetchYoutube.js'
import { addCommentToDatabases } from './actions/toDB.js'
import { User } from './models/list.js'
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
 
// Add "day" property to each User object
console.log('stop 0')
const users = User.find({}, (err, users) => {
  if (err) {
    console.log(err)
  } else {
    users.forEach(user => {
      user.diary.forEach(entry => {
        entry.day = findDayFromText(entry.text)
      })
    })
    console.log('step 1',users.length)
    var i =0;
    (async () => {
      for (let user of users) {
        await user.save()
        console.log('step 2',i++)
      }
    })()
  }
})