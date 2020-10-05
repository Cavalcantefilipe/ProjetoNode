import ICreateNotificationsDTO from '@modules/notification/dtos/ICreateNotificationDTO';
import Notification from '@modules/notification/infra/typeorm/schemas/Notification';
import INotificationsRepository from '@modules/notification/repositories/INotificationsRepository';
import { ObjectID } from 'mongodb';

class FakeNotificationsRepository implements INotificationsRepository {
  private notifications: Notification[] = [];

  public async create({
    recipient_id,
    content,
  }: ICreateNotificationsDTO): Promise<Notification> {
    const notification = new Notification();

    Object.assign(notification, { id: new ObjectID(), content, recipient_id });

    this.notifications.push(notification);

    return notification;
  }
}

export default FakeNotificationsRepository;
