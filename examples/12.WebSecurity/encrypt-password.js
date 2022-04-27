// Import dependencies
import bcrypt from "bcrypt";

// Hash the password
const salt = await bcrypt.genSalt(15);
console.log(await bcrypt.hash("pass123", salt));
