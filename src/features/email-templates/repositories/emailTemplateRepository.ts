import { httpClientAuth } from "@/infra/http/httpClient";
import type {
  AdminEmailTemplateList,
  AdminEmailTemplatePreview,
} from "../types/email-template.types";

const BASE_URL = "/admin/email-templates";

export const emailTemplateRepository = {
  findAll: async (
    merchantCode: string,
    signal?: AbortSignal,
  ): Promise<AdminEmailTemplateList> => {
    const response = await httpClientAuth.get<AdminEmailTemplateList>(
      BASE_URL,
      {
        params: { merchantCode },
        signal,
      },
    );
    return response.data;
  },

  preview: async (
    templateId: string,
    merchantCode: string,
    signal?: AbortSignal,
  ): Promise<AdminEmailTemplatePreview> => {
    const response = await httpClientAuth.get<AdminEmailTemplatePreview>(
      `${BASE_URL}/${encodeURIComponent(templateId)}/preview`,
      {
        params: { merchantCode },
        signal,
      },
    );
    return response.data;
  },
};
