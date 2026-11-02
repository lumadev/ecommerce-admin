import { useQuery } from "@tanstack/react-query";
import { useOutletContext } from "react-router-dom";
import { emailTemplateRepository } from "../repositories/emailTemplateRepository";

export const useEmailTemplates = (selectedTemplateId: string | null) => {
  const { merchantCode } = useOutletContext<{ merchantCode?: string }>();

  const templatesQuery = useQuery({
    queryKey: ["admin-email-templates", merchantCode],
    queryFn: ({ signal }) => {
      if (!merchantCode) {
        throw new Error("Selecione uma loja para consultar os templates.");
      }
      return emailTemplateRepository.findAll(merchantCode, signal);
    },
    enabled: Boolean(merchantCode),
    staleTime: 5 * 60 * 1000,
    retry: false,
  });

  const previewQuery = useQuery({
    queryKey: ["admin-email-template-preview", merchantCode, selectedTemplateId],
    queryFn: ({ signal }) => {
      if (!merchantCode || !selectedTemplateId) {
        throw new Error("Selecione uma loja e um template para continuar.");
      }
      return emailTemplateRepository.preview(
        selectedTemplateId,
        merchantCode,
        signal,
      );
    },
    enabled: Boolean(merchantCode && selectedTemplateId),
    staleTime: 5 * 60 * 1000,
    retry: false,
  });

  return {
    merchantCode,
    templates: templatesQuery.data?.templates ?? [],
    merchant: templatesQuery.data?.merchant,
    isLoading: templatesQuery.isLoading,
    isError: templatesQuery.isError,
    refetch: templatesQuery.refetch,
    preview: previewQuery.data,
    isPreviewLoading: previewQuery.isLoading,
    isPreviewError: previewQuery.isError,
    refetchPreview: previewQuery.refetch,
  };
};
