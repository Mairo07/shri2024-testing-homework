import '@testing-library/jest-dom';
import { render, screen, waitFor } from '@testing-library/react';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { Application } from '../../src/client/Application';
import { CartApi, ExampleApi } from '../../src/client/api';
import { ProductShortInfo } from '../../src/common/types';
import { AxiosRequestHeaders, AxiosResponse } from 'axios';
import { Provider } from 'react-redux';
import { initStore } from '../../src/client/store';
import { link } from 'fs';

const productsMock: ProductShortInfo[] = [
  {id: 1, price: 327, name: 'Modern kogtetochka'},
  {id: 2, price: 10, name: 'Unbranded kogtetochka'},
  {id: 3, price: 765, name: 'Gorgeous kogtetochka'},
];

const initApplication = ():  React.JSX.Element => {
  const basename: string = '/hw/store';
  const mockApi: ExampleApi = new ExampleApi(basename);
  const mockResponse: AxiosResponse<ProductShortInfo[]> = {
    data: productsMock,
    status: 200,
    statusText: 'OK',
    headers: {},
    config: {
      headers: {} as AxiosRequestHeaders,
    },
  };
  jest.spyOn(ExampleApi.prototype, 'getProducts').mockResolvedValue(mockResponse);
  const cart: CartApi = new CartApi();
  const store = initStore(mockApi, cart);
  const application = (
    <MemoryRouter initialEntries={["/catalog"]} initialIndex={0}>
        <Provider store={store}>
          <Application />
        </Provider>
    </MemoryRouter>
  );
  return application
}

afterEach(()=> {
  jest.clearAllMocks()
})

it('в каталоге должны отображаться товары, список которых приходит с сервера', async () => {
  const {container} = render(initApplication());
  
  await waitFor(() => {
    const products = Array.from(container.querySelectorAll('.ProductItem'));
    expect(products.length).toBe(productsMock.length)
    expect(products.map(product => product.querySelector('.card-title')?.textContent)).toContain(productsMock[0].name);
    expect(products.map(product => product.querySelector('.card-title')?.textContent)).toContain(productsMock[1].name);
    expect(products.map(product => product.querySelector('.card-title')?.textContent)).toContain(productsMock[2].name);
  })
})

it('для каждого товара в каталоге отображается название, цена и ссылка на страницу с подробной информацией о товаре', async () => {
  const {container} = render(initApplication());
  
  await waitFor(() => {
    const products: HTMLElement[] = Array.from(container.querySelectorAll('.ProductItem'));
    const names: (string | null | undefined)[] = products.map(product => product?.querySelector('.ProductItem-Name')?.textContent);
    const prices: (string | null | undefined)[] = products.map(product => product?.querySelector('.ProductItem-Price')?.textContent)
    const links: (string | null | undefined)[] = products.map(product => product?.querySelector('.ProductItem-DetailsLink')?.getAttribute('href'))

    expect(names).toContain(productsMock[0].name);
    expect(names).toContain(productsMock[1].name);
    expect(names).toContain(productsMock[2].name);

    expect(prices).toContain('$' + productsMock[0].price);
    expect(prices).toContain('$' + productsMock[1].price);
    expect(prices).toContain('$' + productsMock[2].price);

    expect(links).toContain(`/catalog/${productsMock[0].id}`);
    expect(links).toContain(`/catalog/${productsMock[1].id}`);
    expect(links).toContain(`/catalog/${productsMock[2].id}`);
  })
})

