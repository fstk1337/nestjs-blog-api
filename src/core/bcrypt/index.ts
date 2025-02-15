import { genSaltSync, hashSync, compareSync } from 'bcrypt-ts';

export const generateHash = (password: string) => {
  const salt = genSaltSync(10);
  return hashSync(password, salt);
};

export const verifyPassword = (password: string, hash: string) => {
  return compareSync(password, hash);
};
