import AppError from '@shared/errors/AppError';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';
import UpdateProfile from './UpdateProfileService';

let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let updateProfiler: UpdateProfile;

describe('UpdateProfiler', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeHashProvider = new FakeHashProvider();
    updateProfiler = new UpdateProfile(fakeUsersRepository, fakeHashProvider);
  });
  it('should be able to update the profiler', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456789',
    });

    const updatedUser = await updateProfiler.execute({
      user_id: user.id,
      name: 'John Trê',
      email: 'johntre@example.com',
    });

    expect(updatedUser.name).toBe('John Trê');
    expect(updatedUser.email).toBe('johntre@example.com');
  });

  it('should not able to update profile if not-existing user', async () => {
    await expect(
      updateProfiler.execute({
        user_id: 'non-existing-user',
        name: 'John Trê',
        email: 'johntre@example.com',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not able to change to another user email', async () => {
    await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456789',
    });

    const user = await fakeUsersRepository.create({
      name: 'John Test',
      email: 'test@example.com',
      password: '12345',
    });

    await expect(
      updateProfiler.execute({
        user_id: user.id,
        name: 'John Trê',
        email: 'johndoe@example.com',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should be able to update the password', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456789',
    });

    const updatedUser = await updateProfiler.execute({
      user_id: user.id,
      name: 'John Trê',
      email: 'johntre@example.com',
      old_password: '123456789',
      password: '1234123',
    });

    expect(updatedUser.name).toBe('John Trê');
    expect(updatedUser.email).toBe('johntre@example.com');
    expect(updatedUser.password).toBe('1234123');
  });

  it('should bot be able to update the password without old password', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456789',
    });

    await expect(
      updateProfiler.execute({
        user_id: user.id,
        name: 'John Trê',
        email: 'johntre@example.com',
        password: '1234123',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should bot be able to update the password with wrong old password', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456789',
    });

    await expect(
      updateProfiler.execute({
        user_id: user.id,
        name: 'John Trê',
        email: 'johntre@example.com',
        old_password: 'wrong-old-password',
        password: '1234123',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
