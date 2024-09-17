import './output.css';
import { I18nextProvider } from 'react-i18next';
import i18n from './i18n';
import Game from './Game';
import "/node_modules/flag-icons/css/flag-icons.min.css";

function App() {
  return (
    <I18nextProvider i18n={i18n}>
      <Game />
    </I18nextProvider>
  );
}

export default App;
