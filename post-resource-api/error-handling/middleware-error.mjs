export const customizedError = (err, _, res) => {
   const statusCode = err.statusCode || 500;

   const message = err.message || "Something went wrong"

   const errors = {
     status: "error",
     stack: err.stack,
     statusCode,
     message,
   }

   res.send(errors)
}