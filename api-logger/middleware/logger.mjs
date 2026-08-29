const logger = (req, res, next) => {
  console.log(`Request-method: ${req.method}`);
  console.log(`URL: ${req.url}`);
  console.log(`timeStamp [${new Date().toISOString()}]`);
  console.log(`user-agent-header: ${req.headers["user-agent"]}`);
  next();
};

export default logger;
