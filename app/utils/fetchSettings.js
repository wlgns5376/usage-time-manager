import settings from 'electron-settings';
import defaultSettings from '../settings.default.js';

const fetchSettings = () => {

    let newSettings = Object.assign({}, defaultSettings, settings.getAll());

    settings.setAll(newSettings);
}

export default fetchSettings;