function creditCardType(cc) {
  let amex = new RegExp('^3[47][0-9]{13}$');
  let visa = new RegExp('^4[0-9]{12}(?:[0-9]{3})?$');

  let mastercard = new RegExp('^5[1-5][0-9]{14}$');
  let mastercard2 = new RegExp('^2[2-7][0-9]{14}$');

  let disco1 = new RegExp('^6011[0-9]{12}[0-9]*$');
  let disco2 = new RegExp('^62[24568][0-9]{13}[0-9]*$');
  let disco3 = new RegExp('^6[45][0-9]{14}[0-9]*$');
  
  let diners = new RegExp('^3[0689][0-9]{12}[0-9]*$');
  let jcb =  new RegExp('^35[0-9]{14}[0-9]*$');

  if (visa.test(cc)) {
    return '<i class="fab fa-cc-visa"></i>';
  }
  if (amex.test(cc)) {
    return '<i class="fab fa-cc-amex"></i>';
  }
  if (mastercard.test(cc) || mastercard2.test(cc)) {
    return '<i class="fab fa-cc-mastercard"></i>';
  }
  if (disco1.test(cc) || disco2.test(cc) || disco3.test(cc)) {
    return '<i class="fab fa-cc-discover"></i>';
  }
  if (diners.test(cc)) {
    return '<i class="fab fa-cc-diners-club"></i>';
  }
  if (jcb.test(cc)) {
    return '<i class="fab fa-cc-jcb"></i>';
  }

  return '<i class="far fa-credit-card"></i>';
}