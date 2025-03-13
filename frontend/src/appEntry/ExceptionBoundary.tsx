import React, { useState, useEffect } from 'react';
import { RChildren } from '../types/GenericTypes'
import { ThemedAppContainer } from '../views/components/view/Containers'
import { FlexBox } from '../views/components/view/FlexLayouts'
import ApiController from '../controllers/ApiController'
import PortalLogger from '../internal/PortalLogger'
import { BaseText, Text24 } from '../theme/CustomText'
import { Icon, VerticalSpacer } from '../views/components/ViewElements'

export default function ExceptionBoundary({ children }: RChildren) {
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const errorHandler = (ev: ErrorEvent) => {
      const exception = ev.error || new Error(ev.message)
      setError(exception);
      new PortalLogger(new ApiController(null), null).exception(`[ExceptionBoundary]: ${exception.toString()}`)
    };

    window.addEventListener('error', errorHandler);

    return () => {
      window.removeEventListener('error', errorHandler);
    };
  }, []);

  if (error) {
    return (
      <ThemedAppContainer>
        <FlexBox vertical={true} justify={'center'}>
          <Icon name={'fa-wrench'} rSize={5} />
          <VerticalSpacer size={15} />
          <Text24 text={'Something went wrong...'} />
          <VerticalSpacer size={15} />
          <BaseText text={'We\'re very sorry for the inconvenience. Please reload the page and try again.'} />
        </FlexBox>
      </ThemedAppContainer>
    );
  }

  return children
}

