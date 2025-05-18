export const handler = async (event) => {
  // TODO implement
  const response = {
    statusCode: 200,
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({message: 'BYE BYE from Ayush Sharma.'}),
  };
  return response;
};
