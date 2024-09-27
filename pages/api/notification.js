const webPush = require('web-push');

webPush.setVapidDetails(
  `mailto:me@gmail.com`,
  'BJfh3HNf_v_kJntAYXPiT8CPud1aFoqFwzn3-qXrLcwl_T6VCOyF981mI5O3FHI8UIZlyTW6OMa1pByQBXPqISA',
  'k0yeDselUKfhg7UoYiEgV8HslyygvrJCJrC5NClOPEc'
);

const Notification = (req, res) => {
  if (req.method == 'POST') {
    const { subscription } = req.body;

    webPush
      .sendNotification(
        subscription,
        JSON.stringify({
          notification: {
            title: "It's time to pray",
            body: 'حان وقت الصلاة',
            icon: '/logo512x512.png',
            badge: '/badge.png',
          },
          data: {
            url: 'https://mente.vercel.app/',
          },
        })
      )
      .then((response) => {
        res.writeHead(response.statusCode, response.headers).end(response.body);
      })
      .catch((err) => {
        if ('statusCode' in err) {
          res.writeHead(err.statusCode, err.headers).end(err.body);
        } else {
          console.error(err);
          res.statusCode = 500;
          res.end();
        }
      });
  } else {
    res.statusCode = 405;
    res.end();
  }
};

export default Notification;
