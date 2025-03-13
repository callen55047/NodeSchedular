interface IMetadata {
  key: string,
  value: string
}

enum EMetadataKeys {
  ORDERING = "ordering"
}

function updateOrCreateMetadataWithKey(metadata: IMetadata[], key: EMetadataKeys, value: string): IMetadata[] {
  const newMetadata = metadata.find((e) => e.key === key)
  if (newMetadata) {
    newMetadata.value = value
  } else {
    metadata.push({ key, value })
  }

  return [...metadata]
}

export {
  IMetadata,
  EMetadataKeys,
  updateOrCreateMetadataWithKey
}