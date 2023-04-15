import { EventSubscriber, EntitySubscriberInterface } from 'typeorm'

@EventSubscriber()
export class Posts implements EntitySubscriberInterface {}
