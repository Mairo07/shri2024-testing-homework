import React, { ReactElement, ReactNode } from 'react';
import { MemoryRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { it, expect } from "@jest/globals";
import { screen, render, getAllByTestId } from "@testing-library/react";
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import '@testing-library/jest-dom/jest-globals';

import { initStore } from "../../src/client/store";
import { Application } from '../../src/client/Application';
import { CartApi, ExampleApi } from "../../src/client/api";

import './__mock__/localStorageMock';
import { CartState } from '../../src/common/types';

const cartDataMock: CartState = [
  {count: 1, price: 327, name: 'Modern kogtetochka'},
  {count: 2, price: 10, name: 'Unbranded kogtetochka'},
  {count: 3, price: 765, name: 'Gorgeous kogtetochka'},
];

const initApplication = (component: ReactNode, cartData: CartState = []): ReactElement => {
  const basename: string = '/hw/store';
  const api: ExampleApi = new ExampleApi(basename);
  const cart: CartApi = new CartApi();
  cart.setState(cartData)
  const store = initStore(api, cart);
  const application = (
    <MemoryRouter initialEntries={["/cart"]} initialIndex={0}>
        <Provider store={store}>
            {component}
        </Provider>
    </MemoryRouter>
  );
  return application
}

afterEach(() => {
  localStorage.clear();
})

describe('Корзина с данными', () => {
  it('в корзине должна отображаться таблица с добавленными в нее товарами', () => {
    render(initApplication(<Application/>, cartDataMock));
    const cart: CartApi = new CartApi();
    const cartItems = cart.getState();
    const count = Object.keys(cartItems).length

    const table = screen.getByRole('table');
    const itemRows = getAllByTestId(table, /[0-9]+/)

    expect(table).toBeInTheDocument();
    expect(itemRows.length).toEqual(count)    
  });

  it('в шапке рядом со ссылкой на корзину должно отображаться количество не повторяющихся товаров в ней', () => {
    render(initApplication(<Application/>, cartDataMock));
    const cart: CartApi = new CartApi();
    const cartItems: CartState = cart.getState();
    const count: number = Object.keys(cartItems).length

    expect(screen.getByRole('link', {
      name:/cart/i
    }).textContent).toEqual(`Cart (${count})`)
  });

  it('в корзине должна быть кнопка "очистить корзину", по нажатию на которую все товары должны удаляться', async () => {
    render(initApplication(<Application/>, cartDataMock));
    const cart: CartApi = new CartApi();
    const cartItems: CartState  = cart.getState();
    const clearButton: HTMLButtonElement = screen.getByRole('button', {
      name: /clear shopping cart/i
    });
    expect(cartItems).toEqual(cartDataMock);
    expect(clearButton).toBeInTheDocument();

    await userEvent.click(clearButton);
    expect(cart.getState()).toEqual({});
  });

  it('для каждого товара должны отображаться название, цена, количество, стоимость, а также должна отображаться общая сумма заказа', () => {    
    const { container } = render(initApplication(<Application/>, cartDataMock));
    const names: HTMLElement[] = Array.from(container.querySelectorAll('.Cart-Name'));
    const prices: HTMLElement[] = Array.from(container.querySelectorAll('.Cart-Price'));
    const counts: HTMLElement[] = Array.from(container.querySelectorAll('.Cart-Count'));
    const totals: HTMLElement[] = Array.from(container.querySelectorAll('.Cart-Total'));
    const orderPriceElem: HTMLElement | null = container.querySelector('.Cart-OrderPrice')
    
    const totalDataEl0: number = cartDataMock[0].count * cartDataMock[0].price;
    const totalDataEl1: number = cartDataMock[1].count * cartDataMock[1].price;
    const totalDataEl2: number = cartDataMock[2].count * cartDataMock[2].price;
    const orderPrice: number = totalDataEl0 + totalDataEl1 + totalDataEl2

   expect(names.map(item => item.textContent)).toContain(cartDataMock[0].name);
   expect(prices.map(item => item.textContent)).toContain(`$${cartDataMock[0].price}`);
   expect(counts.map(item => item.textContent)).toContain(`${cartDataMock[0].count}`);
   expect(totals.map(item => item.textContent)).toContain(`$${totalDataEl0}`);

   expect(names.map(item => item.textContent)).toContain(cartDataMock[1].name);
   expect(prices.map(item => item.textContent)).toContain(`$${cartDataMock[1].price}`);
   expect(counts.map(item => item.textContent)).toContain(`${cartDataMock[1].count}`);
   expect(totals.map(item => item.textContent)).toContain(`$${totalDataEl1}`);

   expect(names.map(item => item.textContent)).toContain(cartDataMock[2].name);
   expect(prices.map(item => item.textContent)).toContain(`$${cartDataMock[2].price}`);
   expect(counts.map(item => item.textContent)).toContain(`${cartDataMock[2].count}`);
   expect(totals.map(item => item.textContent)).toContain(`$${totalDataEl2}`);

   expect(orderPriceElem?.textContent).toEqual(`$${orderPrice}`)
  })

  it('должна отображаться форма для оформления заказа', () => {
    const { container } = render(initApplication(<Application/>, cartDataMock));
    const heading: HTMLElement = screen.getByRole('heading', {
      name: /сheckout/i
    });
    const form: HTMLElement | null = container.querySelector('.Form');

    expect(heading).toBeInTheDocument();
    expect(form).toBeInTheDocument();
  })

})

describe('Пустая корзина', ()=> {
  it('должна отображаться ссылка на каталог товаров', () => {
    const {container} = render(initApplication(<Application/>));
    const cartElement: HTMLElement | null = container.querySelector('.Cart');
    const link: HTMLElement | null  = cartElement ? cartElement.querySelector('a') : null;
    expect(link).toHaveAttribute('href', '/catalog')
  })
})







