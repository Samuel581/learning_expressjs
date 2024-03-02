import passport from 'passport'
// If I install passport-facebook it will have it's own strategy
import { Strategy } from 'passport-local'
import { mockUsers } from '../utils/constants.mjs'

passport.serializeUser((user, done) => {
    done(null, user.id);
})

passport.deserializeUser((id, done) => {
    try {
        const findUser = mockUsers.find((user) => user.id  === id);
        if(!findUser) throw new Error("User Not Found");
        done(null, findUser); 
    } catch (error) {
        done(error, null);
    }
})


export default passport.use(
    new Strategy((username, password, done) => {
        console.log(username, password);
        try {
            const findUser = mockUsers.find((user) => user.username === username);
            if (!findUser) throw new Error("User not found");
            if (findUser.password !== password) throw new Error("Password doesn't match");
            done(null, findUser);
        }
        catch (err) {
            done(err, null);
        }
    })
)

