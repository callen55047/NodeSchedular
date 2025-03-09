import express from 'express'

const DeepLinkRouter = express.Router()

/*
* Handles Deep Link routing assets for Android and iOS
* This class hosts the necessary json files with app bundle ID's
* these link web URLs to a local app installation (if applicable for your business)
 */
const AppleAppSiteAssociation = {
  'applinks': {
    'apps': [],
    'details': [
      {
        'appID': '[appleTeamId].com.sample.app',
        'paths': ['/native/*']
      }
    ]
  }
}

const AndroidAppSiteAssociation = [
  {
    'relation': ['delegate_permission/common.handle_all_urls'],
    'target': {
      'namespace': 'android_app',
      'package_name': 'com.sample.app',
      'sha256_cert_fingerprints':
        []
    }
  },
  {
    'relation': [
      'delegate_permission/common.handle_all_urls'
    ],
    'target': {
      'namespace': 'android_app',
      'package_name': 'com.sample.app',
      'sha256_cert_fingerprints': []
    }
  }
]

DeepLinkRouter.get('/apple-app-site-association', (req, res) => {
  return res
    .setHeader('Content-Type', 'application/json')
    .json(AppleAppSiteAssociation)
})

DeepLinkRouter.get('/assetlinks.json', (req, res) => {
  return res
    .setHeader('Content-Type', 'application/json')
    .json(AndroidAppSiteAssociation)
})

export default DeepLinkRouter