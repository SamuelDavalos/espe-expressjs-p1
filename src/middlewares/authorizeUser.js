function authorizeUser(req, res, next) {
  const isOwner = Number(req.user.id) === Number(req.params.id);
  const isAdmin = req.user.role === "ADMIN";
  if (!isOwner && !isAdmin)
    return res.status(403).json({ error: "Access Denied" });
  next();
}

module.exports = authorizeUser;
