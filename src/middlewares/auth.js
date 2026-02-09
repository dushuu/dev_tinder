const adminAuth = (req, res, next) => {
  //there is another funtion app.all
  const token = "xyz";
  const isAdminAuthorized = token === "xyz";
  if (isAdminAuthorized) {
    console.log("admin is get cheked");
    next();
  } else res.status(401).send("Unauthorized request");
};

const userAuth = (req, res, next) => {
  //there is another funtion app.all
  const token = "xyz";
  const isAdminAuthorized = token === "xyz";
  console.log("usr auth is getting checked")
  if (isAdminAuthorized) {
    next();
  } else res.status(401).send("Unauthorized request");
};

module.exports = {
  adminAuth,
  userAuth,
};
