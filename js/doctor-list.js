class DoctorList {
  constructor(doctorsUrl, renderContainer, cart) {
    this.cart = cart;
    fetch(doctorsUrl)
      .then(result => result.json())
      .then(doctors => {
        this.doctors = doctors;
        this.renderDoctors(renderContainer, doctors);
        this.addEventListeners();
      });
  }
  getDoctorById(id) {
    return this.doctors.find(el => el.id === id);
  }
  renderDoctors(container, doctors) {
    let doctorListDomString = '';
    doctors.forEach(doctor => {
      doctorListDomString += `<div class="col-12 col-sm-6 col-md-4 col-lg-3 mb-3">
                  <div class="card doctor">
                    <img class="card-img-top" src="img/doctors/${
                      doctor.image
                    }"
                        alt="${doctor.title}">
                    <div class="card-body">
                      <h4 class="card-title">${doctor.title}</h4>
                      <p class="card-text">${doctor.specilization}</p>
                      <button class="btn btn-info" data-toggle="modal"
                        data-target="#doctorInfoModal" data-id="${
                          doctor.id
                        }">Інформація
                      </button>
                      <button class="btn btn-primary buy" data-id="${
                        doctor.id
                      }">
                        ₴${doctor.price} - Консультація
                      </button>
                    </div>
                  </div>
                </div>`;
    });
    container.html(doctorListDomString);
  }
  addEventListeners() {
    $('#doctorInfoModal').on('show.bs.modal', event => {
      const button = $(event.relatedTarget); // Button that triggered the modal
      const id = String(button.data('id')); // Extract info from data-* attributes
      const doctor = this.getDoctorById(id);
      const modal = $('#doctorInfoModal');
      modal
        .find('.modal-body .card-img-top')
        .attr('src', 'img/doctors/' + doctor.image)
        .attr('alt', doctor.title);
      modal.find('.modal-body .card-title').text(doctor.title);
      modal.find('.modal-body .card-text').text(doctor.description);
      modal
        .find('button.buy')
        .text(`${doctor.price} - Консультуватися`)
        .data('id', id);
    });
    $('.card.doctor button.buy, #doctorInfoModal button.buy').click(event => {
      const button = $(event.target);
      const id = button.data('id');
      this.cart.addDoctor(id);
      window.showAlert('Лікар доданий до списку консультацій');
    });
  }
}
