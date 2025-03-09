import { ServiceAccount } from 'firebase-admin'

const config = {
  'type': '',
  'project_id': '',
  'private_key_id': '',
  'private_key': '',
  'client_email': '',
  'client_id': '',
  'auth_uri': '',
  'token_uri': '',
  'auth_provider_x509_cert_url': '',
  'client_x509_cert_url': '',
  'universe_domain': ''
}

const serviceAccount: ServiceAccount = {
  projectId: config.project_id,
  clientEmail: config.client_email,
  privateKey: config.private_key,
}

export {
  config,
  serviceAccount
}
