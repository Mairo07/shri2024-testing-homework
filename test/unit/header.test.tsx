import React from 'react';
import { it, expect } from "@jest/globals";
import { screen, render } from "@testing-library/react";
import '@testing-library/jest-dom';
import '@testing-library/jest-dom/jest-globals';

import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";

import { initStore } from "../../src/client/store";
import { Application } from '../../src/client/Application'
import { CartApi, ExampleApi } from "../../src/client/api";

it('в шапке отображаются ссылки на страницы магазина, а также ссылка на корзину', () => {
  const basename = '/hw/store';
  const api = new ExampleApi(basename);
  const cart = new CartApi();
  const store = initStore(api, cart);
    const application = (
      <BrowserRouter>
          <Provider store={store}>
              <Application />
          </Provider>
      </BrowserRouter>
  );

  render(application);

  expect(screen.getByRole('link', {
    name: 'Catalog'
  })).toHaveAttribute('href', '/catalog')

  expect(screen.getByRole('link', {
    name: 'Delivery'
  })).toHaveAttribute('href', '/delivery')

  expect(screen.getByRole('link', {
    name: 'Contacts'
  })).toHaveAttribute('href', '/contacts')

  expect(screen.getByRole('link', {
    name:'Cart'
  })).toHaveAttribute('href', '/cart')

});

it('название магазина в шапке должно быть ссылкой на главную страницу', () => {
  const basename = '/hw/store';
  const api = new ExampleApi(basename);
  const cart = new CartApi();
  const store = initStore(api, cart);
    const application = (
      <BrowserRouter>
          <Provider store={store}>
              <Application />
          </Provider>
      </BrowserRouter>
  );

  render(application);
  const headerTitle = screen.getByText('Kogtetochka store');
  expect(headerTitle).toHaveAttribute('href', '/')
});

