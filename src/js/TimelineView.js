export default class TimelineView {
  constructor(container) {
    if (!container) throw new Error('TimelineView: container is required');
    this.container = container;
  }

  mount() {
    this.tlContainer = document.createElement('div');
    this.tlContainer.className = 'container';
    this.container.appendChild(this.tlContainer);

    this.tlHead = document.createElement('div');
    this.tlHead.className = 'tl-head';
    this.tlContainer.appendChild(this.tlHead);

    this.tlHeadName = document.createElement('h1');
    this.tlHeadName.textContent = 'Timeline';
    this.tlHead.appendChild(this.tlHeadName);

    // Контейнер сообщений
    this.messages = document.createElement('div');
    this.messages.className = 'messages-container';
    this.tlContainer.appendChild(this.messages);

    // Поле ввода
    this.composer = document.createElement('form');
    this.composer.className = 'composer';
    this.tlContainer.appendChild(this.composer);

    this.inputText = document.createElement('textarea');
    this.inputText.className = 'input-text';
    this.inputText.placeholder = 'Сообщение';
    this.composer.appendChild(this.inputText);

    this.input = document.createElement('input');
    this.input.type = 'submit';
    this.input.value = 'Отправить';
    this.input.className = 'input';
    this.composer.appendChild(this.input);

    this.btnAudio = document.createElement('button');
    this.btnAudio.type = 'button';
    this.btnAudio.className = 'btn-audio';
    this.btnAudio.setAttribute('aria-label', 'Голосовое сообщение');
    this.composer.appendChild(this.btnAudio);

    this.btnVideo = document.createElement('button');
    this.btnVideo.type = 'button';
    this.btnVideo.className = 'btn-video';
    this.btnVideo.setAttribute('aria-label', 'Камера');
    this.composer.appendChild(this.btnVideo);

    this.createModalGeo();
  }

  createModalGeo() {
    this.modalGeo = document.createElement('div');
    this.modalGeo.className = 'modal-geo';
    this.tlContainer.appendChild(this.modalGeo);

    this.geoTxt1 = document.createElement('p');
    this.geoTxt1.textContent = 'Что-то пошло не так ... ';
    this.modalGeo.appendChild(this.geoTxt1);

    this.geoTxt2 = document.createElement('p');
    this.geoTxt2.textContent = 'К сожалению, не удалось определить ваше местоположение. '
      + 'Дайте разрешение на геолокацию либо введите координаты вручную.';
    this.modalGeo.appendChild(this.geoTxt2);

    this.geoLabel = document.createElement('label');
    this.geoLabel.className = 'geo-label';
    this.geoLabel.textContent = 'Широта и долгота через запятую';
    this.modalGeo.appendChild(this.geoLabel);

    this.geoInputCoordinates = document.createElement('input');
    this.geoInputCoordinates.type = 'text';
    this.geoInputCoordinates.className = 'geo-input';
    this.geoInputCoordinates.ariaPlaceholder = '[55.6758, -35,4557]';
    this.modalGeo.appendChild(this.geoInputCoordinates);

    this.geoError = document.createElement('p');
    this.geoError.className = 'geo-error';
    this.modalGeo.appendChild(this.geoError);

    this.geoBtnContainer = document.createElement('div');
    this.geoBtnContainer.className = 'geo-btn-container';
    this.modalGeo.appendChild(this.geoBtnContainer);

    this.btnGeoCancel = document.createElement('button');
    this.btnGeoCancel.className = 'geo-btn-cancel';
    this.btnGeoCancel.type = 'button';
    this.btnGeoCancel.textContent = 'Отмена';
    this.geoBtnContainer.appendChild(this.btnGeoCancel);

    this.btnGeoSave = document.createElement('button');
    this.btnGeoSave.className = 'geo-btn-save';
    this.btnGeoSave.type = 'button';
    this.btnGeoSave.textContent = 'Ok';
    this.geoBtnContainer.appendChild(this.btnGeoSave);
  }

  showGeoError(message) {
    this.geoError.textContent = message;
    this.geoError.style.display = 'block';
    this.geoInputCoordinates.classList.add('geo-input_error');
  }

  hideGeoError() {
    this.geoError.textContent = '';
    this.geoError.style.display = 'none';
    this.geoInputCoordinates.classList.remove('geo-input_error');
  }

  showGeoModal() {
    this.modalGeo.classList.add('active-geo');
  }

  hideGeoModal() {
    this.modalGeo.classList.remove('active-geo');
  }

  clearGeoInput() {
    this.geoInputCoordinates.value = '';
    this.hideGeoError();
  }

  createTextMessage({ text, coords, date }) {
    const postTxtContainer = document.createElement('div');
    postTxtContainer.className = 'post-txt-container';
    this.messages.prepend(postTxtContainer);

    const createdTxtPost = document.createElement('time');
    createdTxtPost.className = 'created-txt';
    createdTxtPost.dateTime = date.toISOString();
    createdTxtPost.textContent = date.toLocaleTimeString('ru-RU', {
      hour: '2-digit',
      minute: '2-digit',
    });
    postTxtContainer.appendChild(createdTxtPost);

    const textPost = document.createElement('div');
    textPost.className = 'text-post';
    textPost.textContent = text;
    postTxtContainer.appendChild(textPost);

    const textInfoRow = document.createElement('div');
    textInfoRow.className = 'txt-info';
    postTxtContainer.appendChild(textInfoRow);

    const postTxtCoordinates = document.createElement('div');
    postTxtCoordinates.className = 'txt-coordinates';
    postTxtCoordinates.textContent = coords;
    textInfoRow.appendChild(postTxtCoordinates);

    const postTxtViewed = document.createElement('div');
    postTxtViewed.className = 'txt-viewed';
    textInfoRow.appendChild(postTxtViewed);

    this.messages.scrollTop = 0;

    // «Просмотр»: как только сообщение оказалось в видимой области
    // контейнера хотя бы на 50% — помечаем как просмотренное.
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            postTxtViewed.classList.add('active-txt-viewed');
            observer.disconnect(); // дальше следить не нужно
          }
        });
      },
      {
        root: this.messages, // следим относительно контейнера, а не всего окна
        threshold: 0.5,
      },
    );
    observer.observe(postTxtContainer);
  }

  // createAudioMessage() {}

  // createVideoMessage() {}
}
