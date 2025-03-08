const getRequest = async (url) => {
  const token = localStorage.getItem("authToken");
  const response = await fetch(url, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    cache: "no-store",
  });
  const result = await response.json();
  return result;
};

export default getRequest;
