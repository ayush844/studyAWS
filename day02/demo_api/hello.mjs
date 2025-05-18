export const handler = async (event) => {
  // TODO implement
  const response = {
    statusCode: 200,
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({message: 'Hello in Lambda from Ayush Sharma.'}),
  };
  return response;
};
