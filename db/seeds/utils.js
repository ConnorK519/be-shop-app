const bcrypt = require("bcrypt");

function formatUsers(usersData) {
  return usersData.map((user) => {
    const hashedPass = bcrypt.hashSync(user.password, 10);
    return [
      user.username,
      user.first_name,
      user.last_name,
      user.email,
      hashedPass,
      user.post_code,
      user.town_or_city,
      user.house_number,
      user.street,
      "{}",
      user.created_at,
    ];
  });
}

module.exports = { formatUsers };
