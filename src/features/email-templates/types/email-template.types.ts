export interface AdminEmailTemplate {
  id: string;
  name: string;
  recipient: string;
  subject: string;
  trigger: string;
}

export interface EmailTemplateMerchant {
  id: string;
  code: string;
  name: string;
}

export interface AdminEmailTemplateList {
  merchant: EmailTemplateMerchant;
  templates: AdminEmailTemplate[];
}

export interface AdminEmailTemplatePreview extends AdminEmailTemplate {
  html: string;
  merchant: EmailTemplateMerchant;
}
