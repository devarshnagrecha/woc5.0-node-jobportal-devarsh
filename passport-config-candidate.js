const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcrypt')

function initialize(passportCandidate, getUserByEmail, getUserById) 
{
  const authenticateUser = async (email, password, done) => 
  {
    const user = await getUserByEmail(email)
    console.log("CANDIDATE "+user)
    if (!user) {
      return done(null, false, { message: 'No such email registered!' })
    }

    try {
      if (await bcrypt.compare(password, user.password)) {
        return done(null, user)
      } else {
        return done(null, false, { message: 'Incorrect password!' })
      }
    } catch (e) {
      return done(e)
    }
  }

  passportCandidate.use('candidate', new LocalStrategy({ usernameField: 'email' }, authenticateUser))
  passportCandidate.serializeUser((user, done) => done(null, user.id))
  passportCandidate.deserializeUser((id, done) => {
    return done(null, getUserById(id))
  })
}

module.exports = initialize