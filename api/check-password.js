module.exports = function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { password } = req.body || {};
  const correctPassword = process.env.EDIT_PASSWORD;

  if (!correctPassword) {
    return res.status(500).json({ error: 'EDIT_PASSWORD が設定されていません' });
  }

  if (password === correctPassword) {
    return res.status(200).json({ ok: true });
  }

  return res.status(401).json({ ok: false, error: 'パスワードが違います' });
};
