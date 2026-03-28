const updateUser = async(id, updatedFields) => {
  const {error} = userDataValidator.validateUpdateUser(updatedFields) 

  if(error) {
    // throw message
  }

  // TODO: Hash the user password and save the hashed password

  //TODO: Phone number validation and verification
  // TODO: Email verification

  // TODO: Check if the verification is invalid or expired, then throw an error message
  
  // TODO: Check if the updated one already exists, then throw an error.
  // TODO: Update the user's data
 
  //Then save the user's data
  return await this.usersRespository.updateUser(id, updatedFields)
}