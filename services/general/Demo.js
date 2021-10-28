
export const get = async (req, res) => {
  console.log('DECODED', req.decoded);

  res.json({ sent: true });
};
