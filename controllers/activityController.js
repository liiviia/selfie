const Activity = require('../models/Activity'); 

exports.createActivity = async (req, res) => {
  const { title, description, deadline, author, completed } = req.body;
  
  try {
    const newActivity = new Activity({
      title,
      description,
      deadline,
      author,
      completed
    });

    await newActivity.save();
    res.status(201).json({ message: 'Attività aggiunta con successo', activity: newActivity });
  } catch (error) {
    res.status(500).json({ message: 'Errore durante l\'aggiunta dell\'attività', error });
  }
};
