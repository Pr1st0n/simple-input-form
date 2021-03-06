/**
 * Simple input form.
 */
class InputForm {
  constructor() {
    this._form = document.getElementById('myForm');
    this._inputs = Array.from(this._form.querySelectorAll('.form-input input'));

    this._form.addEventListener('submit', this.submit.bind(this));
  }

  /**
   * Validates form input data.
   *
   * @returns {{isValid: Boolean, errorFields: String[]}} Validation result data object.
   */
  validate() {
    const fioPatt = new RegExp(/^([a-zа-я]+\s){2}([a-zа-я]+)$/i);
    const emailPatt = new RegExp(
      /^[a-z]{1}[a-z0-9\.-]{1,28}[a-z0-9]{1}@(ya\.ru|yandex\.ru|yandex\.ua|yandex\.by|yandex\.kz|yandex\.com)$/i
    );
    const phonePatt = new RegExp(/^\+7\(\d{3}\)\d{3}(?:-\d{2}){2}$/i);
    let result = {
      isValid: true,
      errorFields: []
    };

    const validate0 = (name, value) => {
      switch (name) {
        case 'fio': {
          return fioPatt.test(value);
        }
        case 'email': {
          return emailPatt.test(value);
        }
        case 'phone': {
          return phonePatt.test(value) && value.match( /\d/g).reduce((memo, num) => memo + parseInt(num), 0) < 30;
        }
      }
    };

    this._inputs.forEach(input => {
      const name = input.name;
      const value = input.value;
      const isValid = validate0(name, value);

      if (!isValid) {
        result.isValid = false;
        result.errorFields.push(name);
      }
    });

    return result;
  }

  /**
   * Returns data object containing form input values.
   *
   * @returns {Object} Data object.
   */
  getData() {
    return this._inputs.reduce((memo, input) => {
      memo[input.name] = input.value;

      return memo;
    }, {});
  }

  /**
   * Sets allowed data object fields as input values.
   *
   * @param {Object} data Data object:
   * - {String} fio Three words string.
   * - {String} email String for email with one of the domains: ya.ru, yandex.ru, yandex.ua,
   * yandex.by, yandex.kz, yandex.com.
   * - {String} phone Phone number in format: +7(111)222-33-11 with digits sum not exceeding 30.
   */
  setData(data) {
    const inputNames = this._inputs.map(input => input.name);

    inputNames.forEach((inputName, index) => {
      const value = data[inputName];

      if (value) {
        this._inputs[index].value = value;
      }
    });
  }

  /**
   * Submits form.
   *
   * @param {Object} evt Event.
   */
  submit(evt) {
    evt.preventDefault(); // Prevent default form submit.

    const validationResult = this.validate();

    if (!validationResult.isValid) {
      this._inputs.forEach(input => {
        input.classList.toggle('error', validationResult.errorFields.includes(input.name));
      });

      return;
    }

    this._inputs.forEach(input => {
      input.classList.remove('error');
    });

    const submitButton = document.getElementById('submitButton');
    const submitLoader = document.getElementById('submitLoader');
    const resultContainer = document.getElementById('resultContainer');
    const loadData = () => {
      const url = this._form.action;
      const req = new XMLHttpRequest();

      req.open('GET', url, true);
      req.send();

      req.onload = () => {
        const res = JSON.parse(req.responseText);
        const status = res.status;

        resultContainer.classList.add(status); // Set class according to request result.

        switch (status) {
          case 'success': {
            resultContainer.innerHTML = 'Success';

            break;
          }
          case 'error': {
            resultContainer.innerHTML = res.reason;

            break;
          }
          case 'progress': {
            setTimeout(loadData, res.timeout);

            return; // Prevent submit button blinking.
          }
        }

        submitButton.disabled = false;
        clearTimeout(loaderTimeout);
        submitLoader.style.display = 'none';
      };

      req.onerror = evt => {
        resultContainer.className = '';
        resultContainer.innerHTML = req.statusText;
        submitButton.disabled = false;

        clearTimeout(loaderTimeout);

        submitLoader.style.display = 'none';
      };
    };

    resultContainer.innerHTML = '';
    submitButton.disabled = true;

    // Prevent loader blinking.
    const loaderTimeout = setTimeout(() => {
      submitLoader.style.display = 'block';
    }, 100);

    loadData();
  }
}

const MyForm = new InputForm(); // eslint-disable-line no-unused-vars