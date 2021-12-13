import { Request, Response } from 'express';
import { getSubscriberHandler } from './mailchimp/get-subscriber';
import { subscribeHandler } from './mailchimp/subscribe';
import { unsubscribeHandler } from './mailchimp/unsubscribe';
import { updateSubscriberHandler } from './mailchimp/update-subscriber';

export const main = async (req: Request, res: Response) => {
  try {
    const { action } = req.body;

    switch (action) {
      case 'subscribe':
        return subscribeHandler(req, res);

      case 'getSubscriber':
        return getSubscriberHandler(req, res);

      case 'updateSubscriber':
        return updateSubscriberHandler(req, res);

      case 'unsubscribe':
        return unsubscribeHandler(req, res);

      default:
        break;
    }
    throw new Error(`Invalid action: ${action}`);
  } catch (error: any) {
    return res.status(500).json({ error: error.message || 'Failed' });
  }
};
