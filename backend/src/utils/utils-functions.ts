import * as bcrypt from 'bcrypt';

const hashPassword = (password: string) => {
  const hashPassword = bcrypt.hashSync(password, 10);
  return hashPassword;
};

export { hashPassword };
