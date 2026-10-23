import TimelineView from './TimelineView';
import validateCoords from './validateCoords';
import getPosition from './getPosition';

export default class Timeline {
  constructor(container) {
    this.container = container;
  }

  init() {
    this.view = new TimelineView(this.container);
    this.view.mount();

    this.listeners();
  }

  listeners() {
    this.view.composer.addEventListener('submit', this.onCreateMessage);
    this.view.btnGeoSave.addEventListener('click', this.onSaveGeoCoords);
    this.view.btnGeoCancel.addEventListener('click', this.onCloseGeo);
  }

  onCreateMessage = async (e) => {
    e.preventDefault();

    const message = this.view.inputText.value.trim();
    if (!message) return;

    try {
      const coords = await getPosition();
      this.view.createTextMessage({
        text: message,
        coords,
        date: new Date(),
      });
      this.view.inputText.value = '';
    } catch (err) {
      this.pendingText = message;
      this.view.clearGeoInput();
      this.view.showGeoModal();
    }
  };

  onSaveGeoCoords = () => {
    const { value } = this.view.geoInputCoordinates;

    try {
      const { latitude, longitude } = validateCoords(value);

      this.view.createTextMessage({
        text: this.pendingText ?? '',
        coords: `[${latitude}, ${longitude}]`,
        date: new Date(),
      });

      this.pendingText = null;
      this.view.clearGeoInput();
      this.view.hideGeoModal();
      this.view.inputText.value = '';
    } catch (err) {
      this.view.showGeoError(err.message);
    }
  };

  onCloseGeo = () => {
    this.pendingText = null;
    this.view.clearGeoInput();
    this.view.hideGeoModal();
  };
}
