document
    .getElementById('succeedButton')
    .addEventListener('click', window.devSsoIdp.redirectWithSuccess);
document
    .getElementById('failButton')
    .addEventListener('click', window.devSsoIdp.redirectWithFail);
