import { UserException } from './user.exception';

describe('UserException', () => {
  it('should be defined', () => {
    expect(new UserException()).toBeDefined();
  });
});
