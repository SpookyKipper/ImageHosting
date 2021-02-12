import { Button, Input, Spacer, Text, useToasts } from "@geist-ui/react";
import { Lock, User } from "@geist-ui/react-icons";
import Router from "next/router";
import { ChangeEvent, useEffect, useState } from "react";
import { ContainerCenterSmall } from "../components/Container";
import { Title } from "../components/Title";
import { login, useUser } from "../hooks/useUser";

export default function Login() {
  const [, setToast] = useToasts();
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const disabled = !username || !password;
  const user = useUser();

  useEffect(() => {
    if (user.data) Router.replace("/dashboard");
  }, [user]);

  const onUsernameChange = (evt: ChangeEvent<HTMLInputElement>) => setUsername(evt.target.value);
  const onPasswordChange = (evt: ChangeEvent<HTMLInputElement>) => setPassword(evt.target.value);

  async function onContinueClick() {
    try {
      await login(username, password);
    } catch (err) {
      setToast({ type: "error", text: err.message });
    }
  }

  return (
    <ContainerCenterSmall>
      <Title>Sign in</Title>
      <Text h1>Sign In</Text>
      <Input width="100%" type="text" placeholder="Username" icon={<User />} onChange={onUsernameChange} />
      <Spacer y={0.4} />
      <Input.Password width="100%" placeholder="Password" icon={<Lock />} onChange={onPasswordChange} />
      <Spacer y={0.8} />
      <Button className="max-width" type="success" onClick={onContinueClick} disabled={disabled}>
        Continue
      </Button>
    </ContainerCenterSmall>
  );
}
