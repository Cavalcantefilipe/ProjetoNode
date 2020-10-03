import AppError from '@shared/errors/AppError';
import FakeStorageProvider from '@shared/container/providers/StorageProvider/fakes/FakeStorageProvider';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import UpdateUserAvatarService from './UpdateUserAvatarService';

let fakeUsersRepository: FakeUsersRepository;
let fakeStorageProvider: FakeStorageProvider;
let updateUserAvatar: UpdateUserAvatarService;

describe('UpdateUserAvatar', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeStorageProvider = new FakeStorageProvider();
    updateUserAvatar = new UpdateUserAvatarService(
      fakeUsersRepository,
      fakeStorageProvider,
    );
  });
  it('should be able to create a new user', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456789',
    });

    await updateUserAvatar.execute({
      user_id: user.id,
      avatarFilename: 'PictureJohnDoe.jpg',
    });

    expect(user.avatar).toBe('PictureJohnDoe.jpg');
  });

  it('should not be able to update avatarUser from non existing user', async () => {
    await expect(
      updateUserAvatar.execute({
        user_id: 'non-existing-user',
        avatarFilename: 'PictureJohnDoe.jpg',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should delete old avatar when updating new one', async () => {
    const deleteFile = jest.spyOn(fakeStorageProvider, 'deleteFile');

    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456789',
    });

    await updateUserAvatar.execute({
      user_id: user.id,
      avatarFilename: 'PictureJohnDoe.jpg',
    });

    await updateUserAvatar.execute({
      user_id: user.id,
      avatarFilename: 'PictureJohnDoe2.jpg',
    });

    expect(deleteFile).toHaveBeenCalledWith('PictureJohnDoe.jpg');

    expect(user.avatar).toBe('PictureJohnDoe2.jpg');
  });
});
