import { Tile, TileRowContainer } from '../components/TileLayout'
import React, { useContext, useState } from 'react'
import { AppInstance } from '../../appEntry/appContainer/AppContext'
import AsyncStateFetch from '../../internal/state/AsyncStateFetch'
import { FlexBox } from '../components/view/FlexLayouts'
import { DividerWithTitle, HorizontalSpacer } from '../components/ViewElements'
import CreateFlashProductModal from './flashProducts/CreateFlashProductModal'
import { FlashProductCard } from './flashProducts/FlashProductViewComps'
import ModifyFlashProductModal from './flashProducts/ModifyFlashProductModal'
import { IFlashProduct } from '../../internal/models/products/FlashProduct'

export default function FlashProductsEditor() {
  const { api } = useContext(AppInstance)
  const [currentFlash, setCurrentFlash] = useState<IFlashProduct | null>(null)
  const productsTask = AsyncStateFetch(() => api.flashProduct.all())

  function onFlashModified() {
    productsTask.reload()
  }

  return (
    <TileRowContainer>
      <Tile name={'Flash Tattoos'}>
        <DividerWithTitle name={'Active'} />

        <FlexBox wrap={'wrap'} justify={'flex-start'}>
          {productsTask.data?.map((product) => {
            return (
              <>
                <FlashProductCard
                  flash={product}
                  onClick={() => setCurrentFlash(product)}
                />
                <HorizontalSpacer size={15} />
              </>
            )
          })}

          <CreateFlashProductModal onCreated={onFlashModified} />
        </FlexBox>

        <DividerWithTitle name={'Inactive'} />

        <FlexBox wrap={'wrap'} justify={'flex-start'}>

        </FlexBox>

        <ModifyFlashProductModal
          flashProduct={currentFlash}
          close={() => setCurrentFlash(null)}
          onDelete={onFlashModified}
        />
      </Tile>
    </TileRowContainer>
  )
}