import { MediosContextProvider } from './Context';
import { AppUi } from './router/AppUi';

export const MediosApp = () => {
  return (
    <MediosContextProvider>
        <AppUi />
    </MediosContextProvider>
  )
}
