import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import AppError from '@shared/errors/AppError';
import ListProvidersService from './ListProvidersServices';

let fakeUsersRepository: FakeUsersRepository;
let listAllProvidersService: ListProvidersService;

describe('ListProviders', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    listAllProvidersService = new ListProvidersService(fakeUsersRepository);
  });
  it('should be able to list the Providers', async () => {
    const user1 = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456789',
    });
    const user2 = await fakeUsersRepository.create({
      name: 'John Tre',
      email: 'johntre@example.com',
      password: '1234589',
    });

    const userlog = await fakeUsersRepository.create({
      name: 'Lipe',
      email: 'lipe@example.com',
      password: '123da4589',
    });

    const provider = await listAllProvidersService.execute({
      user_id: userlog.id,
    });

    expect(provider).toEqual([user1, user2]);
  });
});
