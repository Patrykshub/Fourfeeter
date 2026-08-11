import type { ReactNode } from 'react'
import { IntlProvider } from 'react-intl'
import messages from '../lang/en-GB.json'

export const IntlWrapper = ({ children }: { children: ReactNode }) => (
  <IntlProvider locale="en-GB" messages={messages}>
    {children}
  </IntlProvider>
)
