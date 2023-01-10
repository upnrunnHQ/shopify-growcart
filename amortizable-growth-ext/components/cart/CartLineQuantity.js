import React from 'react';
import {useCartLine} from 'hooks';

export function CartLineQuantity(props) {
  const cartLine = useCartLine();
  const {as, ...passthroughProps} = props;

  const Wrapper = as ? as : 'span';

  return <Wrapper {...passthroughProps}>{cartLine.quantity}</Wrapper>;
}