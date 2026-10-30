const authorizeUser = (req, res, next) => {
  const requestedUserId = Number(req.params.id);
  const authenticatedUserId = Number(req.user.id);

  if (req.user.role !== "ADMIN" && requestedUserId !== authenticatedUserId) {
    return res.status(403).json({ error: "Forbidden" });
  }

  return next();
};

module.exports = authorizeUser;
