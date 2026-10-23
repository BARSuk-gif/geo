export default class TimelineView {
  constructor(container) {
    if (!container) throw new Error('TimelineView: container is required');
    this.container = container;
  }

  mount() {
    this.tlContainer = document.createElement('div');
    this.tlContainer.className = 'container';
    this.container.append(this.tlContainer);

    this.tlHead = document.createElement('div');
    this.tlHead.className = 'tl-head';
    this.tlContainer.append(this.tlHead);

    this.tlHeadName = document.createElement('h1');
    this.tlHeadName.textContent = 'Timeline';
    this.tlHead.append(this.tlHeadName);

    // Контейнер сообщений
    this.messages = document.createElement('div');
    this.messages.className = 'messages-container';
    this.tlContainer.append(this.messages);

    // Поле ввода
    this.composer = document.createElement('form');
    this.composer.className = 'composer';
    this.tlContainer.append(this.composer);

    this.inputText = document.createElement('textarea');
    this.inputText.className = 'input-text';
    this.inputText.placeholder = 'Сообщение';
    this.composer.append(this.inputText);

    this.btnAudio = document.createElement('button');
    this.btnAudio.type = 'button';
    this.btnAudio.className = 'btn-audio';
    this.btnAudio.setAttribute('aria-label', 'Голосовое сообщение');
    this.composer.append(this.btnAudio);

    this.btnVideo = document.createElement('button');
    this.btnVideo.type = 'button';
    this.btnVideo.className = 'btn-video';
    this.btnVideo.setAttribute('aria-label', 'Камера');
    this.composer.append(this.btnVideo);

    this.createModalGeo();
  }

  createModalGeo() {
    this.modalGeo = document.createElement('div');
    this.modalGeo.className = 'modal-geo';
    this.tlContainer.append(this.modalGeo);

    this.geoTxt1 = document.createElement('p');
    this.geoTxt1.textContent = 'Что-то пошло не так ... ';
    this.modalGeo.append(this.geoTxt1);

    this.geoTxt2 = document.createElement('p');
    this.geoTxt2.textContent = 'К сожалению, не удалось определить ваше местоположение. '
      + 'Дайте разрешение на геолокацию либо введите координаты вручную.';
    this.modalGeo.append(this.geoTxt2);

    this.geoLabel = document.createElement('label');
    this.geoLabel.className = 'geo-label';
    this.geoLabel.textContent = 'Широта и долгота через запятую';
    this.modalGeo.append(this.geoLabel);

    this.geoInputCoordinates = document.createElement('input');
    this.geoInputCoordinates.type = 'text';
    this.geoInputCoordinates.className = 'geo-input';
    this.geoInputCoordinates.placeholder = '[55.6758, -35,4557]';
    this.modalGeo.append(this.geoInputCoordinates);

    // Пользователь начал править ввод — убираем прошлую ошибку
    this.geoInputCoordinates.addEventListener('input', () => {
      this.hideGeoError();
    });

    this.geoError = document.createElement('p');
    this.geoError.className = 'geo-error';
    this.modalGeo.append(this.geoError);

    this.geoBtnContainer = document.createElement('div');
    this.geoBtnContainer.className = 'geo-btn-container';
    this.modalGeo.append(this.geoBtnContainer);

    this.btnGeoCancel = document.createElement('button');
    this.btnGeoCancel.className = 'geo-btn-cancel';
    this.btnGeoCancel.type = 'button';
    this.btnGeoCancel.textContent = 'Отмена';
    this.geoBtnContainer.append(this.btnGeoCancel);

    this.btnGeoSave = document.createElement('button');
    this.btnGeoSave.className = 'geo-btn-save';
    this.btnGeoSave.type = 'button';
    this.btnGeoSave.textContent = 'Ok';
    this.geoBtnContainer.append(this.btnGeoSave);
  }

  showGeoError(message) {
    this.geoError.textContent = message;
    this.geoError.classList.add('is-visible');
    this.geoInputCoordinates.classList.add('geo-input_error');
  }

  hideGeoError() {
    this.geoError.textContent = '';
    this.geoError.classList.remove('is-visible');
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

    const pad = (n) => String(n).padStart(2, '0');
    const d = date;
    const formatted = `${pad(d.getDate())}.${pad(d.getMonth() + 1)}.${d.getFullYear()} `
      + `${pad(d.getHours())}:${pad(d.getMinutes())}`;

    const createdTxtPost = document.createElement('time');
    createdTxtPost.className = 'created-txt';
    createdTxtPost.dateTime = date.toISOString();
    createdTxtPost.textContent = formatted;
    postTxtContainer.append(createdTxtPost);

    const textPost = document.createElement('div');
    textPost.className = 'text-post';
    textPost.textContent = text;
    postTxtContainer.append(textPost);

    const textInfoRow = document.createElement('div');
    textInfoRow.className = 'txt-info';
    postTxtContainer.append(textInfoRow);

    const postTxtCoordinates = document.createElement('div');
    postTxtCoordinates.className = 'txt-coordinates';
    postTxtCoordinates.textContent = coords;
    textInfoRow.append(postTxtCoordinates);

    const postTxtViewed = document.createElement('div');
    postTxtViewed.className = 'txt-viewed';
    textInfoRow.append(postTxtViewed);

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
