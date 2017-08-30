/**
 * Simple input form.
 */
class InputForm {
  constructor() {
    this.form = document.getElementById('myForm');
    this.inputs = Array.from(this.form.querySelectorAll('.form-input input'));

    this.form.addEventListener('submit', this.submit.bind(this));
  }

  /**
   * Validates form input data.
   *
   * @returns {{isValid: Boolean, errorFields: String[]}} Validation result data object.
   */
  validate() {
    let result = {
      isValid: true,
      errorFields: []
    }

    const validate0 = (name, value) => {
      switch(name) {
        case 'fio': {
          break;
        }
        case 'email': {
          break;
        }
        case 'phone': {
          break;
        }
      }
    }

    this.inputs.forEach(input => validate0(input.name, input.value));

    return result;
  }

  /**
   * Returns data object containing form input values.
   *
   * @returns {Object} Data object.
   */
  getData() {
    return this.inputs.reduce((memo, input) => {
      memo[input.name] = input.value;

      return memo;
    }, {});
  }

  /**
   * Sets data object fields as input values.
   *
   * @param {Object} data Data object:
   * - {String} fio Three words string.
   * - {String} email String for email with one of the domains: ya.ru, yandex.ru,
   * yandex.ua, yandex.by, yandex.kz, yandex.com.
   * - {String} phone Phone number in format: +7(111)222-33-11 with digits sum
   * not exceeding 30.
   */
  setData(data) {
    const inputNames = this.inputs.map(input => input.name);

    inputNames.forEach((inputName, index) => {
      const value = data[inputName];

      if (value) {
        this.inputs[index].value = value;
      }
    });
  }

  /**
   * Submits form.
   *
   * @param {Object} evt Event.
   */
  submit(evt) {
    evt.preventDefault();

    this.validate();
  }
}

const MyForm = new InputForm();