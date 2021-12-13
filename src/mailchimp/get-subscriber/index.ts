import { Request, Response } from 'express';
import { getSubscriber } from '../utils';

export type GetSubscriberPayload = {
  apiKey: string;
  groupId: string;
  id?: string;
  email?: string;
};

export const getSubscriberHandler = async (req: Request, res: Response) => {
  try {
    const { apiKey, groupId, id, email } = req.body
      .payload as GetSubscriberPayload;

    if (!apiKey) {
      throw new Error('Missing apiKey');
    }

    if (!groupId) {
      throw new Error('Missing groupId');
    }

    const idOrEmail = id || email;

    if (!idOrEmail) {
      throw new Error('Missing id or email');
    }

    const subscriber = await getSubscriber({ apiKey, groupId, idOrEmail });

    return res.json(subscriber);
  } catch (error: any) {
    return res.status(500).send(error.message || 'Failed to get subscriber.');
  }
};
