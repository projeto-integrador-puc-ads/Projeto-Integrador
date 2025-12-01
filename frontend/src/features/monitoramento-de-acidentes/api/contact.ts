import http from '@/lib/http';

export interface Contact {
  id: string;
  ownerId: bigint;
  name: string;
  email: string;
}

export interface CreateContactPayload {
  name: string;
  email: string;
}

export interface UpdateContactPayload {
  name?: string;
  email?: string;
}

export const contactApi = {
  listarPorUsuario: async (userId: string): Promise<Contact[]> => {
    const { data } = await http.get<Contact[]>(`/api/contact-emails/user/${userId}`);
    return Array.isArray(data) ? data : [];
  },

  porId: async (contactId: string): Promise<Contact> => {
    const { data } = await http.get<Contact>(`/api/contact-emails/${contactId}`);
    return data;
  },

  criar: async (userId: string, payload: CreateContactPayload): Promise<Contact> => {
    const { data } = await http.post<Contact>(`/api/contact-emails/user/${userId}`, payload);
    return data;
  },

  atualizar: async (contactId: string, payload: UpdateContactPayload): Promise<Contact> => {
    const { data } = await http.put<Contact>(`/api/contact-emails/${contactId}`, payload);
    return data;
  },

  remover: async (contactId: string): Promise<void> => {
    await http.delete(`/api/contact-emails/${contactId}`);
  },
};
