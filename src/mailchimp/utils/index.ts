import Mailchimp = require('mailchimp-api-v3');

export type Subscriber = {
  id: string;
  status: 'subscribed' | 'unsubscribed';
  email: string;
  name?: string;
};

export const subscribe = async ({
  apiKey,
  groupId,
  email,
  name,
}: {
  apiKey: string;
  groupId: string;
  email: string;
  name?: string;
}): Promise<Subscriber> => {
  try {
    const mailchimp = new Mailchimp(apiKey);

    const result = await mailchimp.post(`/lists/${groupId}/members`, {
      email_address: email,
      status: 'subscribed',
      merge_fields: {
        FNAME: name,
      },
    });

    return {
      id: result.id,
      email: result.email_address,
      name: result.full_name,
      status: result.status,
    };
  } catch (error: any) {
    if (error.response?.body?.title == 'Member Exists') {
      return updateSubscriber({
        apiKey,
        groupId,
        idOrEmail: email,
        status: 'subscribed',
        email,
        name,
      });
    } else {
      console.error(error.response?.body || error);

      throw error.response?.data?.message
        ? new Error(error.response?.data?.message)
        : error;
    }
  }
};

export const getSubscriber = async ({
  apiKey,
  groupId,
  idOrEmail,
}: {
  apiKey: string;
  groupId: string;
  idOrEmail: string;
}): Promise<Subscriber> => {
  try {
    const mailchimp = new Mailchimp(apiKey);

    const result = await mailchimp.get(
      `/lists/${groupId}/members/${idOrEmail}`
    );

    return {
      id: result.id,
      status: result.status,
      email: result.email_address,
      name: result.full_name,
    };
  } catch (error: any) {
    console.error(error.response?.body || error);

    throw error.response?.data?.message
      ? new Error(error.response?.data?.message)
      : error;
  }
};

export const updateSubscriber = async ({
  apiKey,
  groupId,
  idOrEmail,
  email,
  name,
  status,
}: {
  apiKey: string;
  groupId: string;
  idOrEmail: string;
  email?: string;
  name?: string;
  status?: Subscriber['status'];
}): Promise<Subscriber> => {
  try {
    const mailchimp = new Mailchimp(apiKey);
    let data: any = { status: status || 'subscribed' };

    if (email) {
      data.email_address = email;
    }

    if (name) {
      data.merge_fields = {
        FNAME: name,
      };
    }

    const result = await mailchimp.patch(
      `/lists/${groupId}/members/${idOrEmail}`,
      data
    );

    return {
      id: result.id,
      status: result.status,
      email: result.email_address,
      name: result.full_name,
    };
  } catch (error: any) {
    console.error(error.response?.body || error);

    throw error.response?.data?.message
      ? new Error(error.response?.data?.message)
      : error;
  }
};

export const unsubscribe = async ({
  apiKey,
  groupId,
  email,
}: {
  apiKey: string;
  groupId: string;
  email: string;
}): Promise<Subscriber> => {
  try {
    const mailchimp = new Mailchimp(apiKey);
    const result = await mailchimp.patch(`/lists/${groupId}/members/${email}`, {
      status: 'unsubscribed',
    });

    return {
      id: result.id,
      status: result.status,
      email: result.email_address,
      name: result.full_name,
    };
  } catch (error: any) {
    console.error(error.response?.body || error);

    throw error.response?.data?.message
      ? new Error(error.response?.data?.message)
      : error;
  }
};
