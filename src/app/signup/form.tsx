"use client";

import "./style.css";

import { useState } from "react";
import { Form, Input, Button, Typography, Space } from "antd";
import { useForm } from "antd/es/form/Form";
import { useRouter } from "next/navigation";
import { AccountVO } from "../../types";
import { API_VERSION, SERVER_API_URL } from "../../utils/global";
import { FETCH } from "../../lib/utils";

export default function SignUpForm() {
  const router = useRouter();
  const [form] = useForm();
  const [loading, setLoading] = useState<boolean>(false);

  // 회원 가입
  const onFinish = async (fieldValues: AccountVO) => {
    console.log(fieldValues);
    setLoading(true);

    if (!confirm("가입하시겠습니까?")) {
      setLoading(false);
      return false;
    }

    try {
      await FETCH(`${SERVER_API_URL}/${API_VERSION}/auth/signup`, {
        method: "POST",
        body: JSON.stringify(fieldValues),
      })
        .then((res) => res?.json())
        .then((res) => {})
        .catch((e) => console.log(e))
        .finally(() => setLoading(false));
    } catch (error) {}

    router.push(`/`);
  };
  return (
    <div className="signup-full-area">
      <Form className="signup-form-area" form={form} onFinish={onFinish}>
        <div className="signup-form-title-area">
          <Typography.Title>Sign Up</Typography.Title>
        </div>

        <div className="signup-item-area">
          <Form.Item name={"name"} rules={[{ required: true }]}>
            <Input size="large" placeholder="이름" maxLength={30} />
          </Form.Item>
          <Form.Item name={"id"} rules={[{ required: true }]}>
            <Space.Compact size="large" style={{ width: "100%" }}>
              <Input size="large" placeholder="아이디" maxLength={20} />
              <Button size="large">중복 확인</Button>
            </Space.Compact>
          </Form.Item>
          <Form.Item name={"pw"} rules={[{ required: true }]}>
            <Input.Password
              size="large"
              placeholder="비밀번호"
              maxLength={30}
            />
          </Form.Item>
        </div>

        <div className="signup-button-area">
          <Button
            type="primary"
            htmlType={"submit"}
            size="large"
            style={{ width: "100%" }}
            loading={loading}
          >
            sign up
          </Button>
        </div>
      </Form>
    </div>
  );
}
