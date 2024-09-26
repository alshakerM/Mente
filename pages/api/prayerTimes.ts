export default async function handler(req, res) {
  const url =
    'https://muslimsalat.com/ostend.json?key=7682c933fb249fcf1808bc510b6f7c15';

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch prayer times' });
  }
}
