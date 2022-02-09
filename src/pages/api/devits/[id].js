import { firestore } from 'fb/admin';

export default async function devitsid(req, res) {
  const { query } = req;
  const { id = null } = query;

  if (!id) return res.status(404).end();

  const doc = await firestore.collection('devits').doc(id).get();

  if (doc) {
    return res.json({
      ...(doc?.data() ?? {}),
      id: doc?.id ?? null,
    });
  }

  return res.status(404).json({}).end();
}
