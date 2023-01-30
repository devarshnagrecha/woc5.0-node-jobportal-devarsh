const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcrypt')

function initialize(passportEmployer, getUserByEmail, getUserById) 
{
  const authenticateUser = async (email, password, done) => 
  {
    const user = await getUserByEmail(email)
    console.log("EMPLOYER "+user)
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

  passportEmployer.use('employer',new LocalStrategy({ usernameField: 'email' }, authenticateUser))
  passportEmployer.serializeUser((user, done) => done(null, user.id))
  passportEmployer.deserializeUser((id, done) => {
    return done(null, getUserById(id))
  })
}

module.exports = initialize