/* eslint no-console: 0 */
/* eslint no-native-reassign: 0 */
import 'isomorphic-fetch';
import { Article } from '../models/catalog_api_models.js';
import { CreateOrderResponse, GetCheckoutResponse } from '../models/guest_checkout_models.js';

const successCode = 200;
const badRequestCode = 399;
const acceptedCode = 204;

function checkStatus(response) {

  if (response.headers.get('Location') && response.status === acceptedCode) {
    document.location.replace(response.headers.get('Location'));
  }

  if (response.status >= successCode && response.status < badRequestCode) {
    return response;
  }
  const error = new Error(`${response.statusText}: ${response.status}`);

  error.response = response;
  throw error;
}

function fetchEndpoint(endpoint) {
  return fetch(endpoint.url, {
    method: endpoint.method,
    mode: endpoint.mode,
    redirect: endpoint.redirect,
    headers: endpoint.headers,
    body: endpoint.body
  })
    .then(checkStatus)
    .then(response => {
      return response.json();
    })
    .then(json => {
      return endpoint.transform(json);
    }).catch(error => {
      console.error(error);
      throw error;
    });
}

class AtlasSDKClient {
  constructor(config) {
    this.config = config;
  }

  getLocale() {
    return this.config.salesChannels.find(sc => sc.channel === this.config.salesChannel).locale;
  }

  getLanguage() {
    const startPosition = 0;

    return this.getLocale().substring(startPosition, this.getLocale().indexOf('_'));
  }

  getArticle(sku) {
    const url = `${this.config.catalogApi.url}/articles/${sku}?client_id=${this.config.clientId}`;
    const CatalogEndpoint = {
      url: url,
      method: 'GET',
      headers: {
        Accept: 'application/x.zalando.article+json, application/x.problem+json',
        'X-Sales-Channel': this.config.salesChannel,
        'X-UID': this.config.clientId
      },
      transform: (json) => {
        return new Article(json);
      }
    };

    return fetchEndpoint(CatalogEndpoint).then(article => {
      return article;
    });
  }

  getCheckout(checkoutId, token) {
    const url = `${this.config.atlasCheckoutGateway.url}/guest-checkout/api/checkouts/${checkoutId}/${token}`;
    const GetCheckoutEndpoint = {
      url: url,
      method: 'GET',
      headers: {
        'Content-Type': 'application/x.zalando.guest-checkout+json',
        Accept: 'application/x.zalando.guest-checkout+json, application/x.problem+json',
        'X-Sales-Channel': this.config.salesChannel,
        'X-UID': this.config.clientId,
        checkout_id: checkoutId,
        token: token
      },
      transform: (response) => {
        return new GetCheckoutResponse(response);
      }
    };

    return fetchEndpoint(GetCheckoutEndpoint).then(getCheckoutResponse => {
      return getCheckoutResponse;
    });
  }

  createOrder(checkoutId, token) {
    const url = `${this.config.atlasCheckoutGateway.url}/guest-checkout/api/orders`;
    const json = JSON.stringify({
      checkout_id: checkoutId,
      token: token
    });
    const CreateOrderEndpoint = {
      url: url,
      method: 'POST',
      headers: {
        'Content-Type': 'application/x.zalando.order.create.continue+json',
        Accept: 'application/x.zalando.order.create.response+json, application/x.problem+json',
        'X-Sales-Channel': this.config.salesChannel,
        'X-UID': this.config.clientId
      },
      body: json,
      transform: (response) => {
        return new CreateOrderResponse(response);
      }
    };

    return fetchEndpoint(CreateOrderEndpoint).then(createOrderResponse => {
      return createOrderResponse;
    });
  }

  createGuestCheckout(json) {
    const url = `${this.config.atlasCheckoutGateway.url}/guest-checkout/api/orders`;
    const GuestCheckoutEndpoint = {
      url: url,
      method: 'POST',
      mode: 'cors',
      redirect: 'manual',
      headers: {
        'Content-Type': 'application/x.zalando.order.create+json',
        Accept: 'application/x.zalando.order.create.response+json, application/x.problem+json',
        'X-Sales-Channel': this.config.salesChannel,
        'X-UID': this.config.clientId
      },
      body: json,
      transform: (response) => {
        return new CreateOrderResponse(response);
      }
    };

    return fetchEndpoint(GuestCheckoutEndpoint).then(guestCheckoutResponse => {
      return guestCheckoutResponse;
    });
  }

}

export { AtlasSDKClient, fetchEndpoint };