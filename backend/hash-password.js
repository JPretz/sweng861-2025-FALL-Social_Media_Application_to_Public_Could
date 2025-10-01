import bcrypt from 'bcrypt';

const password = 'pass123'; // the password you want to hash
const saltRounds = 10;

bcrypt.hash(password, saltRounds, (err, hash) => {
  if (err) throw err;
  console.log('Bcrypt hash:', hash);
});
