async function findAndSaveUser(Users) {
  try {
    let user = await Users.findOne({});
    user.name = "michael";
    user = await user.save();
    user = await Users.findOne({ gender: "m" });
  } catch (error) {
    console.error(error);
  }
}
