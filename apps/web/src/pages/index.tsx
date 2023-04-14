import { useEffect, useState } from "react";
import Layout from "../../components/layout";

const API_HOST = process.env.NEXT_PUBLIC_API_HOST || "http://localhost:3001";

export default function Web() {
  const [name, setName] = useState<string>("");
  const [response, setResponse] = useState<{ message: string } | null>(null);
  const [error, setError] = useState<string | undefined>();

  useEffect(() => {
    setResponse(null);
    setError(undefined);
  }, [name]);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setName(e.target.value);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const result = await fetch(`${API_HOST}/faucet/${name}`);
      const response = await result.json();
      setResponse(response);
    } catch (err) {
      console.error(err);
      setError("Unable to fetch response");
    }
  };

  const onReset = () => {
    setName("");
  };

  return (
    <Layout>
      <h1>MiB Faucet</h1>
      <form onSubmit={onSubmit}>
        <label htmlFor="name">Address </label>
        <input
          type="text"
          name="name"
          id="name"
          value={name}
          onChange={onChange}
        ></input>
      </form>
      {error && (
        <div>
          <h3>Error</h3>
          <p>{error}</p>
        </div>
      )}
      {response && (
        <div>
          <h3>Greeting</h3>
          <p>{response.message}</p>
        </div>
      )}
    </Layout>
  );
}
