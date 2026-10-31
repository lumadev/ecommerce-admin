export interface ApiEndpointDetail {
  label: string;
  value: string;
  description: string;
}

export interface ApiEndpoint {
  id: string;
  method: string;
  path: string;
  title: string;
  summary: string;
  access: string;
  details: ApiEndpointDetail[];
  request: string;
  response: string;
}
