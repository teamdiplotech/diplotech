document.addEventListener('DOMContentLoaded', function() {
  const phoneInputField = document.getElementById('number');
  const phoneInput = window.intlTelInput(phoneInputField, {
    initialCountry: 'mx',
    utilsScript: 'https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/17.0.8/js/utils.js'
  });

  document.getElementById('contactForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Evita que el formulario se envíe de la manera tradicional
    document.getElementById('confirmationMessage').innerText = 'Espera un momento, tus datos están siendo enviados';
    document.getElementById('confirmationMessage').style.color = 'black';
    var name = document.getElementById('name').value;
    var mail = document.getElementById('mail').value;
    var number = phoneInput.getNumber();
    fetch('https://diplotech-40e217e86990.herokuapp.com/send-whatsapp', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        to: number,
        body: `Hola ${name}, pronto alguno de nuestros asesores se comunicará contigo al ${number}. Crea tu cuenta en https://teamdiplotech.github.io/public/home.html. Saludos de parte del team DiploTech.`
      })
    })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        console.log('Mensaje enviado exitosamente!', data.status, data.text);
      } else {
        console.error('Error al enviar el mensaje de WhatsApp');
      }
    })
    .catch(error => console.error('Error:', error));
    fetch('https://diplotech-40e217e86990.herokuapp.com/send-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        to_name: name,
        to_mail: mail
      })
    })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        console.log('Correo enviado exitosamente!', data.status, data.text);
        document.getElementById('name').value = '';
        document.getElementById('lastName').value = '';
        document.getElementById('mail').value = '';
        document.getElementById('number').value = '';

        var confirmationMessage = document.getElementById('confirmationMessage');
        confirmationMessage.innerText = '¡Gracias! Tus datos se han enviado con éxito.';
        confirmationMessage.style.color = 'black';
        setTimeout(function() {
          confirmationMessage.style.color = '#EFFAF2';
        }, 10000);
      } else {
        console.log('Falló el envío del correo...');
        var confirmationMessage = document.getElementById('confirmationMessage');
        confirmationMessage.innerText = 'Ha ocurrido un problema. Por favor, intenta más tarde.';
        confirmationMessage.style.color = 'red';
        setTimeout(function() {
          confirmationMessage.style.color = '#EFFAF2';
        }, 10000);
      }
    })
    .catch(error => console.error('Error:', error));
  });
});
