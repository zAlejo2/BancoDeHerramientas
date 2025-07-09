import bcrypt from 'bcrypt';

const password = 'admin'; // o la que necesites
const saltRounds = 10;

bcrypt.hash(password, saltRounds, function(err, hash) {
  if (err) {
    console.error('Error al generar el hash:', err);
  } else {
    console.log('Hash generado:', hash);
  }
});
