import validateCoords from '../js/validateCoords';

describe('validateCoords', () => {
  describe('валидные форматы', () => {
    it('с пробелом и типографским минусом', () => {
      expect(validateCoords('51.50851, \u22120.12572')).toEqual({
        latitude: 51.50851,
        longitude: -0.12572,
      });
    });

    it('без пробела', () => {
      expect(validateCoords('51.50851,\u22120.12572')).toEqual({
        latitude: 51.50851,
        longitude: -0.12572,
      });
    });

    it('в квадратных скобках', () => {
      expect(validateCoords('[51.50851, \u22120.12572]')).toEqual({
        latitude: 51.50851,
        longitude: -0.12572,
      });
    });

    it('обычный минус', () => {
      expect(validateCoords('[51.50851, -0.12572]')).toEqual({
        latitude: 51.50851,
        longitude: -0.12572,
      });
    });

    it('возвращает числа, а не строки', () => {
      const result = validateCoords('[51.50851, -0.12572]');
      expect(typeof result.latitude).toBe('number');
      expect(typeof result.longitude).toBe('number');
    });
  });

  describe('невалидные форматы', () => {
    it.each([
      ['пустая строка', ''],
      ['только пробелы', '   '],
      ['одно число', '51.50851'],
      ['три числа', '1, 2, 3'],
      ['буквы', 'abc, def'],
      ['незакрытая скобка', '[51.50851, -0.12572'],
      ['только открывающая скобка', '[51.50851, -0.12572'],
      ['широта > 90', '91, 0'],
      ['широта < -90', '-91, 0'],
      ['долгота > 180', '0, 181'],
      ['долгота < -180', '0, -181'],
      ['не строка', 42],
      ['null', null],
    ])('%s', (_label, input) => {
      expect(() => validateCoords(input)).toThrow();
    });
  });
});
