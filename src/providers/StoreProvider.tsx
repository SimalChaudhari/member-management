import { PropsWithChildren, ReactElement } from 'react';
import { Provider } from 'react-redux';
import store from 'store/Store';

/**
 * Provides the Redux store to the app.
 */
export function StoreProvider({ children }: PropsWithChildren): ReactElement {
  return <Provider store={store}>{children}</Provider>;
}
