const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.login = async (req, res) => {

  try {

    const { username, password } = req.body;

    if(!username || !password){
      return res.status(400).json({message:'inserisci username e passwordd!'});
    }

    //cerco user a db
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ message: 'Username o password errati' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Username o password errati' });
    }

    const token = jwt.sign(
      { id: user._id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({ token, email: user.email, phone: user.phoneNumber });
  } catch (error) {
    console.error('Errore nel login:', error);
    res.status(500).json({ message: 'Errore del server' });
  }
};
