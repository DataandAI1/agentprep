import * as functions from 'firebase-functions';

export const usecases = functions.https.onRequest(async (req, res) => {
  if (req.path.startsWith('/api/use-cases')) {
    if (req.method === 'POST') {
      try {
        const data = req.body;
        console.log('Received data for createUseCase:', data);
        // In a real application, you would save this data to Firestore
        // For now, we'll just return a success message
        res.status(200).json({ id: 'mock-use-case-id', ...data, message: 'Use case created successfully (mocked)' });
      } catch (error) {
        console.error('Error creating use case:', error);
        res.status(500).send('Failed to create use case');
      }
    } else {
      res.status(405).send('Method Not Allowed');
    }
  } else {
    res.status(404).send('Not Found');
  }
});
