import { v4 } from 'uuid';

export const generateName = () => {
  const PREFIX = 'User';
  return `${PREFIX}${v4().substring(0, 8)}`;
};
