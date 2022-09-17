import React from 'react';
import Offcanvas from 'react-bootstrap/Offcanvas';
import { useCart } from 'hooks';
import { CartDetails, IconCart } from 'components';

export function Cart() {
  const {
    displayCart,
    setDisplayCart,
    cart
  } = useCart();
  const offcanvasTitle = `Your cart (${cart.item_count})`;

  return (
    <div className='growcarthq'>
      <button
        type="button"
        className="growcarthq__toggler"
        onClick={() => setDisplayCart(true)}
      >
        <IconCart />
        {!!cart.item_count && (
          <span className="growcarthq__toggler-badge">
            {cart.item_count}
            <span className="visually-hidden">unread messages</span>
          </span>
        )}
      </button>

      <Offcanvas
        show={displayCart}
        onHide={() => setDisplayCart(false)}
        placement={"end"}
      >
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>{offcanvasTitle}</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <CartDetails />
        </Offcanvas.Body>
      </Offcanvas>
    </div>
  );
}