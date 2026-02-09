const GoogleStrategy = require('passport-google-oauth20').Strategy;
const VkontakteStrategy = require('passport-vkontakte').Strategy;
const { User } = require('../models');

module.exports = function(passport) {
  // Only configure Google OAuth if credentials are provided
  if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
    passport.use(
      new GoogleStrategy(
        {
          clientID: process.env.GOOGLE_CLIENT_ID,
          clientSecret: process.env.GOOGLE_CLIENT_SECRET,
          callbackURL: '/api/auth/google/callback',
        },
        async (accessToken, refreshToken, profile, done) => {
          const newUser = {
            googleId: profile.id,
            email: profile.emails[0].value,
            firstName: profile.name.givenName || profile.emails[0].value.split('@')[0],
            lastName: profile.name.familyName || ' ',
          };

          try {
            let user = await User.findOne({ where: { googleId: profile.id } });

            if (user) {
              done(null, user);
            } else {
              // If user exists with this email but not googleId, you might want to link them.
              // For simplicity, we'll create a new user or find by email if that's preferred.
              user = await User.findOne({ where: { email: newUser.email } });
              if (user) {
                // User exists, but not with Google. You could link accounts here.
                // For now, we'll just log them in.
                done(null, user);
              } else {
                // Create new user
                user = await User.create(newUser);
                done(null, user);
              }
            }
          } catch (err) {
            console.error(err);
            done(err, null);
          }
        }
      )
    );
  } else {
    console.warn('Google OAuth not configured: GOOGLE_CLIENT_ID or GOOGLE_CLIENT_SECRET missing');
  }

  // passport.use(
  //   new VkontakteStrategy(
  //     {
  //       clientID: process.env.VK_CLIENT_ID,
  //       clientSecret: process.env.VK_CLIENT_SECRET,
  //       callbackURL: process.env.VK_CALLBACK_URL || '/api/auth/vk/callback',
  //       profileFields: ['email', 'first_name', 'last_name'],
  //     },
  //     async (accessToken, refreshToken, params, profile, done) => {
  //       const newUser = {
  //         vkId: profile.id,
  //         email: params.email,
  //         firstName: profile.name.givenName,
  //         lastName: profile.name.familyName,
  //       };

  //       try {
  //         let user = await User.findOne({ where: { vkId: profile.id } });

  //         if (user) {
  //           return done(null, user);
  //         }

  //         user = await User.findOne({ where: { email: params.email } });

  //         if (user) {
  //           // Optionally link the VK account to the existing user account
  //           user.vkId = profile.id;
  //           await user.save();
  //           return done(null, user);
  //         }

  //         user = await User.create(newUser);
  //         done(null, user);
  //       } catch (err) {
  //         console.error(err);
  //         done(err, null);
  //       }
  //     }
  //   )
  // );

  // These are not strictly needed for JWT stateless auth, but passport requires them.
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findByPk(id);
      done(null, user);
    } catch (err) {
      done(err, null);
    }
  });
};
