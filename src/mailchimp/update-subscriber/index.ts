import { Request, Response } from 'express';
import { updateSubscriber } from '../utils';

export type UpdateSubscriberPayload = {
  apiKey: string;
  groupId: string;
  id?: string;
  email?: string;
  name?: string;
};

export const updateSubscriberHandler = async (req: Request, res: Response) => {
  try {
    const { apiKey, groupId, id, email, name } = req.body
      .payload as UpdateSubscriberPayload;

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

    const subscriber = await updateSubscriber({
      apiKey,
      groupId,
      idOrEmail,
      email,
      name,
    });

    return res.json(subscriber);
  } catch (error: any) {
    return res
      .status(500)
      .send(error.message || 'Failed to update subscriber.');
  }
};
