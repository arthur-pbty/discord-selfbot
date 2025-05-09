const axios = require('axios');

function sendNotification(title, message, priority) {
  const url = "http://90.120.61.81:81/message?token=AVU4LAnlFA._qZk";
  const data = {
    message: message,
    title: title,
    priority: priority
  };

  axios.post(url, data, {
    headers: {
      "Content-Type": "application/json",
    }
  })
  .then(response => {
    console.log("Notification envoyée avec succès !", response.data);
  })
  .catch(error => {
    console.error("Erreur lors de l'envoi de la notification :", error);
  });
}

module.exports = sendNotification;
