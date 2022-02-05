import { api } from "@serverless/cloud";

test("save longlinks", async () => {
  const { body } = await api.post("/s/www.google.com").invoke();
  expect(body).toBe(
    "Long URL: www.google.com<br><br>Short URL: d3d3Lmdvb2dsZS5jb20="
  );
});

test("get shortlink", async () => {
  const { body, status } = await api.get("/l/d3d3Lmdvb2dsZS5jb20=").invoke();
  expect(status).toBe(302);
  expect(body).toBe("Found. Redirecting to https://www.google.com");
});
