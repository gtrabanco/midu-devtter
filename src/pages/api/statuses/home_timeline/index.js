const timeline = [
  {
    id: '0',
    avatar: 'https://avatars.githubusercontent.com/u/8807391?v=4',
    username: 'Caballerog',
    message: `Twitter Web App now runs ES6+ for modern browsers*, reducing the polyfill bundle size by 83%

  (gzipped size went from 16.6 KB down to 2.7 KB!!)

  * Chrome 79+, Safari 14+, Firefox 68+`,
  },
  {
    id: '1',
    avatar:
      'https://pbs.twimg.com/profile_images/1083714591752941568/Q7LnIANs_reasonably_small.jpg',
    username: 'midudev',
    message: 'Wow, devter está funcionando y vivo 🦉',
    name: 'Miguel Ángel Durán',
  },
  {
    id: '2',
    username: 'nikitavoloboev',
    name: 'Nikita Voloboev',
    avatar: 'https://avatars.githubusercontent.com/u/6391776?s=120&v=4',
    message: `Abro paraguas Paraguas

  Clean Code es un libro obsoleto que en 2020, con los paradigmas de desarrollo de software que manejamos, puede hacerte más daño que beneficio.`,
  },
];

export default function handler(req, res) {
  res.status(200).json(timeline);
}
