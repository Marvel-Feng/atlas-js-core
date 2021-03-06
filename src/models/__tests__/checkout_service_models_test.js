/* eslint no-magic-numbers : 0 */

import test from 'ava';
import {
  CreateCartRequest, CartsResponse, CartResponse, CreateCheckoutRequest, CheckoutResponse,
  PutCheckoutRequest, CheckoutGetOrderResponses, CheckoutOrderRequest
}
  from '../checkout_service_models';

test('CartsResponse should be initialized from JSON object', t => {
  const json = {
    id: '892d93b83aa31ccca47508c7564d1d4a256c838f2f652aa211c340728161d6ee',
    carts: [{
      id: '892d93b83aa31ccca47508c7564d1d4a256c838f2f652aa211c340728161d6ee',
      items: [{
        sku: 'SO254C009-K120043000',
        config_sku: 'SO254C009-K12',
        quantity: 1,
        price: {
          amount: 19.95,
          currency: 'EUR'
        },
        original_price: {
          amount: 19.95,
          currency: 'EUR'
        }
      }, {
        sku: 'ES122D0H3-Q11000S000',
        config_sku: 'ES122D0H3-Q11',
        quantity: 2,
        price: {
          amount: 25.45,
          currency: 'EUR'
        },
        original_price: {
          amount: 29.95,
          currency: 'EUR'
        }
      }],
      items_out_of_stock: [],
      delivery: {
        service: 'STANDARD',
        cost: {
          amount: 3.5,
          currency: 'EUR'
        },
        earliest: '2018-10-06T11:41:39.879Z',
        latest: '2018-10-09T11:41:39.879Z',
        options: [
          'STANDARD',
          'EXPRESS'
        ]
      },
      gross_total: {
        amount: 70.85,
        currency: 'EUR'
      },
      tax_total: {
        amount: 11.31,
        currency: 'EUR'
      }
    }]
  };

  const getCartsResponse = new CartsResponse(json);

  t.is(getCartsResponse.id, '892d93b83aa31ccca47508c7564d1d4a256c838f2f652aa211c340728161d6ee');
  t.is(getCartsResponse.carts[0].items[0].price.amount, 19.95);
  t.is(getCartsResponse.carts[0].grossTotal.amount, 70.85);
  t.is(getCartsResponse.carts[0].taxTotal.amount, 11.31);
  t.is(getCartsResponse.carts[0].delivery.service, 'STANDARD');
  t.is(getCartsResponse.carts[0].delivery.cost.amount, 3.5);
  t.is(getCartsResponse.carts[0].delivery.earliest, '2018-10-06T11:41:39.879Z');
});

test('CreateCartRequest should be initialized from JSON object', t => {
  const json = {
    items: [
      {
        sku: 'ME142C002-Q110500000',
        quantity: 2
      }
    ]
  };

  const createCart = new CreateCartRequest(json);


  t.is(createCart.items[0].sku, 'ME142C002-Q110500000');
  t.is(createCart.items[0].quantity, 2);
});

test('CartResponse should be initialized from JSON object', t => {
  const json = {
    id: '1',
    items: [
      {
        sku: 'ME142C002-Q110500000',
        config_sku: 'ME142C002-Q11',
        quantity: 3,
        price: {
          amount: 99.95,
          currency: 'EUR'
        },
        original_price: {
          amount: 99.95,
          currency: 'EUR'
        }
      }
    ],
    items_out_of_stock: [
      'ME142C002-Q110500001'
    ],
    delivery: {
      service: 'STANDARD',
      cost: {
        amount: 3.5,
        currency: 'EUR'
      },
      earliest: '2015-04-21T13:27:31+01:00',
      latest: '2015-04-23T13:27:31+01:00',
      options: [
        'STANDARD',
        'EXPRESS'
      ]
    },
    gross_total: {
      amount: 99.95,
      currency: 'EUR'
    },
    tax_total: {
      amount: 99.95,
      currency: 'EUR'
    },
    total_discount: {
      grossTotal: {
        amount: 99.95,
        currency: 'EUR'
      },
      taxTotal: {
        amount: 99.95,
        currency: 'EUR'
      }
    }
  };

  const createCartResponse = new CartResponse(json);

  t.is(createCartResponse.id, '1');
  t.is(createCartResponse.items[0].price.amount, 99.95);
  t.is(createCartResponse.itemsOutOfStock[0], 'ME142C002-Q110500001');
  t.is(createCartResponse.delivery.service, 'STANDARD');
  t.is(createCartResponse.delivery.cost.amount, 3.5);
  t.is(createCartResponse.delivery.earliest, '2015-04-21T13:27:31+01:00');
});

test('CreateCheckoutRequest is initialized from JSON object', t => {
  const json = {
    cart_id: '1',
    billing_address_id: 1,
    billing_address: {
      gender: 'MALE',
      first_name: 'John',
      last_name: 'Doe',
      street: 'Mollstr. 1',
      additional: 'EG',
      zip: '10178',
      city: 'Berlin',
      country_code: 'DE'
    },
    shipping_address_id: 1,
    shipping_address: {
      gender: 'MALE',
      first_name: 'John',
      last_name: 'Doe',
      street: 'Mollstr. 1',
      additional: 'EG',
      zip: '10178',
      city: 'Berlin',
      country_code: 'DE',
      pickup_point: {
        name: 'PACKSTATION',
        id: '802',
        member_id: '45685217'
      }
    },
    delivery: {
      service: 'STANDARD'
    },
    coupons: [
      'COUPON_1'
    ]
  };
  const createCheckoutRequest = new CreateCheckoutRequest(json);

  t.is(createCheckoutRequest.cartId, '1');
  t.is(createCheckoutRequest.billingAddressId, 1);
  t.is(createCheckoutRequest.billingAddress.street, 'Mollstr. 1');
  t.is(createCheckoutRequest.shippingAddressId, 1);
  t.is(createCheckoutRequest.shippingAddress.firstName, 'John');
  t.is(createCheckoutRequest.delivery.service, 'STANDARD');
  t.is(createCheckoutRequest.coupons[0], 'COUPON_1');

});

test('CheckoutResponse is initialized from JSON object', t => {

  const json = {
    id: '1',
    customer_number: '1',
    cart_id: '1',
    billing_address: {
      id: '1',
      gender: 'MALE',
      first_name: 'John',
      last_name: 'Doe',
      street: 'Mollstr. 1',
      additional: 'EG',
      zip: '10178',
      city: 'Berlin',
      country_code: 'DE'
    },
    shipping_address: {
      id: '1',
      gender: 'MALE',
      first_name: 'John',
      last_name: 'Doe',
      street: 'Mollstr. 1',
      additional: 'EG',
      zip: '10178',
      city: 'Berlin',
      country_code: 'DE',
      pickup_point: {
        name: 'PACKSTATION',
        id: '802',
        member_id: '45685217'
      }
    },
    delivery: {
      service: 'STANDARD',
      cost: {
        amount: 3.5,
        currency: 'EUR'
      },
      earliest: '2015-04-21T13:27:31+01:00',
      latest: '2015-04-23T13:27:31+01:00',
      options: [
        'STANDARD',
        'EXPRESS'
      ]
    },
    coupon_details: [
      {
        coupon: 'COUPON_1',
        warning: 'Your coupon expires in 5 days',
        error: 'Coupon COUPON_1 does not exist. Please make sure that you are using the right coupon code.',
        discount: {
          gross: {
            amount: 99.95,
            currency: 'EUR'
          },
          tax: {
            amount: 99.95,
            currency: 'EUR'
          },
          remaining: {
            amount: 99.95,
            currency: 'EUR'
          }
        }
      }
    ],
    payment: {
      selected: {
        method: 'CREDIT_CARD',
        metadata: {
          key_1: 'value_1',
          key_2: 'value_2'
        },
        external_payment: true
      },
      selection_page_url: 'https://pay.zalando.de/ae45f19'
    }
  };

  const createCheckoutResponse = new CheckoutResponse(json);

  t.is(createCheckoutResponse.id, '1');
  t.is(createCheckoutResponse.cartId, '1');
  t.is(createCheckoutResponse.customerNumber, '1');
  t.is(createCheckoutResponse.billingAddress.id, '1');
  t.is(createCheckoutResponse.billingAddress.gender, 'MALE');
  t.is(createCheckoutResponse.shippingAddress.id, '1');
  t.is(createCheckoutResponse.shippingAddress.gender, 'MALE');
  t.is(createCheckoutResponse.delivery.service, 'STANDARD');
  t.is(createCheckoutResponse.delivery.cost.amount, 3.5);
  t.is(createCheckoutResponse.delivery.earliest, '2015-04-21T13:27:31+01:00');
  t.is(createCheckoutResponse.delivery.options[0], 'STANDARD');
  t.is(createCheckoutResponse.delivery.options[1], 'EXPRESS');
  t.is(createCheckoutResponse.couponDetails[0].discount.gross.amount, 99.95);
  t.is(createCheckoutResponse.couponDetails[0].discount.remaining.amount, 99.95);
  t.is(createCheckoutResponse.payment.selected.method, 'CREDIT_CARD');
  t.is(createCheckoutResponse.payment.selected.metadata.key_1, 'value_1');
});

test('PutCheckoutresponse is initialized from JSON object', t => {

  const json = {
    billing_address_id: 1,
    billing_address: {
      gender: 'MALE',
      first_name: 'John',
      last_name: 'Doe',
      street: 'Mollstr. 1',
      additional: 'EG',
      zip: '10178',
      city: 'Berlin',
      country_code: 'DE'
    },
    shipping_address_id: 1,
    shipping_address: {
      gender: 'MALE',
      first_name: 'John',
      last_name: 'Doe',
      street: 'Mollstr. 1',
      additional: 'EG',
      zip: '10178',
      city: 'Berlin',
      country_code: 'DE',
      pickup_point: {
        name: 'PACKSTATION',
        id: '802',
        member_id: '45685217'
      }
    },
    delivery: {
      service: 'STANDARD'
    },
    coupons: [
      'COUPON_1'
    ]
  };

  const putCheckoutResponse = new PutCheckoutRequest(json);

  t.is(putCheckoutResponse.billingAddressId, 1);
  t.is(putCheckoutResponse.billingAddress.gender, 'MALE');
  t.is(putCheckoutResponse.shippingAddressId, 1);
  t.is(putCheckoutResponse.shippingAddress.gender, 'MALE');
  t.is(putCheckoutResponse.delivery.service, 'STANDARD');

});

test('Should create CheckoutGetOrderResponses from JSON', t => {
  const json
    = {
      order_number: '1',
      customer_number: '1',
      gross_total: {
        amount: 99.95,
        currency: 'EUR'
      },
      created: '2015-04-21T13:27:31+01:00',
      detail_url: 'https://www.zalando.de/benutzerkonto/bestellung-detail/123456789'
    };

  const checkoutGetOrderResponses = new CheckoutGetOrderResponses(json);

  t.is(checkoutGetOrderResponses.orderNumber, '1');
  t.is(checkoutGetOrderResponses.grossTotal.currency, 'EUR');
});

test('Should create CheckoutOrderRequest from JSON', t => {
  const json = {
    checkout_id: '1'
  };

  const checkoutOrderRequest = new CheckoutOrderRequest(json);

  t.is(checkoutOrderRequest.checkoutId, '1');
});
