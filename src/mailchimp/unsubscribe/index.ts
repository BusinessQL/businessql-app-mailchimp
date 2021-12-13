import { Request, Response } from 'express';
import { unsubscribe } from '../utils';

export type UnubscribePayload = {
  apiKey: string;
  groupId: string;
  email: string;
};

export const unsubscribeHandler = async (req: Request, res: Response) => {
  try {
    const { apiKey, groupId, email } = req.body.payload as UnubscribePayload;

    if (!apiKey) {
      throw new Error('Missing apiKey');
    }

    if (!groupId) {
      throw new Error('Missing groupId');
    }

    if (!email) {
      throw new Error('Missing email');
    }

    const subscriber = await unsubscribe({ apiKey, groupId, email });

    return res.json(subscriber);
  } catch (error: any) {
    return res.status(500).send(error.message || 'Failed to unsubscribe.');
  }
};
