import React from 'react';
import { it, expect } from "@jest/globals";
import { screen, render } from "@testing-library/react";
import '@testing-library/jest-dom';
import '@testing-library/jest-dom/jest-globals';

import { MemoryRouter } from "react-router-dom";
import { Provider } from "react-redux";

import { initStore } from "../../src/client/store";
import { Application } from '../../src/client/Application';
import { CartApi, ExampleApi } from "../../src/client/api";


describe('в магазине должны быть страницы', () => {
  it('главная',() => {
    const basename = '/hw/store';
    const api = new ExampleApi(basename);
    const cart = new CartApi();
    const store = initStore(api, cart);
    const application = (
      <MemoryRouter initialEntries={["/"]} initialIndex={0}>
          <Provider store={store}>
            <Application />
          </Provider>
      </MemoryRouter>
    );
    render(application);

    expect(screen.getByText('Welcome to Kogtetochka store!')).toBeInTheDocument();
  })

  it('каталог',() => {
    const basename = '/hw/store';
    const api = new ExampleApi(basename);
    const cart = new CartApi();
    const store = initStore(api, cart);
    const application = (
      <MemoryRouter initialEntries={["/catalog"]} initialIndex={0}>
          <Provider store={store}>
            <Application />
          </Provider>
      </MemoryRouter>
    );
    render(application);
    expect(screen.getByRole('heading', { name: 'Catalog'})).toBeInTheDocument();
  })

  it('условия доставки',() => {
    const basename = '/hw/store';
    const api = new ExampleApi(basename);
    const cart = new CartApi();
    const store = initStore(api, cart);
    const application = (
      <MemoryRouter initialEntries={["/delivery"]} initialIndex={0}>
          <Provider store={store}>
            <Application />
          </Provider>
      </MemoryRouter>
    );
    render(application);
    expect(screen.getByRole('heading', { name: 'Delivery'})).toBeInTheDocument();
  })

  it('контакты',() => {
    const basename = '/hw/store';
    const api = new ExampleApi(basename);
    const cart = new CartApi();
    const store = initStore(api, cart);
    const application = (
      <MemoryRouter initialEntries={["/contacts"]} initialIndex={0}>
          <Provider store={store}>
            <Application />
          </Provider>
      </MemoryRouter>
    );
    render(application);
    expect(screen.getByRole('heading', { name: 'Contacts'})).toBeInTheDocument();
  })

  it('корзина',() => {
    const basename = '/hw/store';
    const api = new ExampleApi(basename);
    const cart = new CartApi();
    const store = initStore(api, cart);
    const application = (
      <MemoryRouter initialEntries={["/cart"]} initialIndex={0}>
          <Provider store={store}>
            <Application />
          </Provider>
      </MemoryRouter>
    );
    render(application);
    expect(screen.getByRole('heading', { name: 'Shopping cart'})).toBeInTheDocument();
  })   
})

