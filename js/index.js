const cart = new Cart($('#cartModal'));
const doctorList = new DoctorList(
  'doctors.json',
  $('.doctors-container'),
  cart
);
