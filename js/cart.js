class Cart {
  constructor(cartContainer) {
    this.cartContainer = cartContainer;
    this.cart = JSON.parse(localStorage['cart'] || '{}');
    this.addEventListeners();
    this.updateBadge();
  }
  addEventListeners() {
    this.cartContainer.on('show.bs.modal', () => this.renderCart());
    this.cartContainer.find('.order').click(ev => this.order(ev));
  }
  addDoctor(id) {
    this.cart[id] = (this.cart[id] || 0) + 1;
    this.saveCart();
    this.updateBadge();
  }
  deleteDoctor(id) {
    if (this.cart[id] > 1) {
      this.cart[id] -= 1;
    } else {
      delete this.cart[id];
    }
    this.saveCart();
    this.updateBadge();
  }
  saveCart() {
    localStorage['cart'] = JSON.stringify(this.cart);
  }
  renderCart() {
    let total = 0;
    let cartDomSting = `<div class="container">
                <div class="row">
                    <div class="col-5"><strong>Лікар</strong></div>
                    <div class="col-3"><strong>Ціна</strong></div>
                </div>`;
    for (const id in this.cart) {
      const doctor = doctorList.getDoctorById(id);
      total += doctor.price * this.cart[id];
      cartDomSting += `<div class="row" data-id="${id}">
                    <div class="col-5">${doctor.title}</div>
                    <div class="col-3">${doctor.price}</div>
                </div>`;
    }
    total = total.toFixed(2);
    cartDomSting += `
                <div class="row">
                    <div class="col-5"><strong>СУМА</strong></div>
                    <div class="col-3"><strong>$${total}</strong></div>
                </div>
        </div>`;
    this.cartContainer.find('.cart-doctor-list-container').html(cartDomSting);
  }
  updateBadge() {
    $('#cart-badge').text(Object.keys(this.cart).length);
  }
  order(ev) {
    const form = this.cartContainer.find('form')[0];
    if (form.checkValidity()) {
      ev.preventDefault();
      fetch('order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          clientName: document.querySelector('#client-name').value,
          clientPhone: document.querySelector('#client-phone').value,
          cart: this.cart
        })
      })
        .then(response => response.text())
        .then(responseText => {
          form.reset();
          this.cart = {};
          this.saveCart();
          this.updateBadge();
          this.renderCart();
          window.showAlert('Дякуємо, ' + responseText);
          this.cartContainer.modal('hide');
        })
        .catch(error => showAlert('Сталася помилка: ' + error, true));
    } else {
      window.showAlert('Заповніть всі поля', false);
    }
  }
}
