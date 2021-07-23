export default function useProductApi(triggerSnacks = true) {
  async function hitApi(method, functionName, payload, onResponse = () => {}) {
    const url = `/.netlify/functions/${functionName}`;

    try {
      const response = await fetch(url, {
        method,
        headers: {
          'content-type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const { status } = response;

      if (status === 201) {
        onResponse({ status, json: {} });
        return;
      }

      const json = await response.json();
      onResponse({ status, json });
    } catch (error) {
      console.error(error);
      // always trigger snack here
    }
  }

  return hitApi;
}
