module.exports = function (req, res, next) {
  if (req.method === 'OPTIONS') {
    next()
  }

  try {
    const { sum } = req.body

    if (!sum || sum < 1) {
      return res.status(403).json({ message: 'Некорректная сумма операции' })
    }

    next()
  } catch (e) {
    console.log(e)
    return res.status(403).json({ message: 'Некорректная сумма операции' })
  }
}
