import { createContext, useReducer } from "react";

export const Store = createContext();

const initialState = {
  cart: { cartItems: [] },
};

export const Actions = {
  CART_ADD_ITEM: "CART_ADD_ITEM",
  CART_REMOVE_ITEM: "CART_REMOVE_ITEM",
};

function reducer(state, action) {
  switch (action.type) {
    case Actions.CART_ADD_ITEM: {
      const newItem = action.payload;
      const existItem = state.cart.cartItems.find(
        (item) => item.slug === newItem.slug,
      );

      const cartItems = existItem
        ? state.cart.cartItems.map((item) =>
            item.name === existItem.name ? newItem : item,
          )
        : [...state.cart.cartItems, newItem];

      return { ...state, cart: { ...state.cart, cartItems } };
    }
    case Actions.CART_REMOVE_ITEM: {
      const foundIndex = state.cart.cartItems.findIndex(
        (item) => item.slug === action.payload,
      );
      const cartItems = [...state.cart.cartItems];
      cartItems.splice(foundIndex, 1);
      return { ...state, cart: { ...state.cart, cartItems } };
    }
    default:
      return state;
  }
}

export function StoreProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const value = { state, dispatch };

  return <Store.Provider value={value}>{children}</Store.Provider>;
}
