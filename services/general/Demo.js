
export const get = async (req, res) => {
  req.app.get('Sendgrid').send({
    from: 'tyler.escolano@ynov.com',
    to: 'escolano.tyler@gmail.com',
    subject: 'Test',
    body: '<strong>and easy to do anywhere, even with Node.js</strong>',
  });

  res.json({ sent: true });
};
