const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
  console.log('>>> Middleware authenticateToken invocato.');
  console.log('>>> Headers ricevuti:', req.headers);


  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    console.log('>>> Token mancante. Accesso negato.');

    return res.status(403).json({ message: 'Token mancante, accesso negato' });
  }

  console.log('>>> Token mancante. Accesso negato.');

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      console.log('>>> Token non valido:', err.message);

      return res.status(403).json({ message: 'Token non valido' });
    }

    console.log('>>> Token verificato con successo. Utente decodificato:', user);

    req.user = user; 
    next(); 
  });
};

module.exports = authenticateToken;
