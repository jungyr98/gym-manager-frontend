"use client";

import "./style.css";

import { useState, useEffect } from "react";
import { Form, Input, Button, Typography } from "antd";
import { useForm } from "antd/es/form/Form";
import { useRouter } from "next/navigation";
import { AccountVO } from "../../types";
import { signIn } from "next-auth/react";
import { ALERT, deleteCookie } from "../../lib/utils";

/**
 * 로그인 폼
 * @returns LoginForm
 */
export default function LoginForm() {
  const router = useRouter();
  const [form] = useForm();
  const [loading, setLoading] = useState<boolean>(false);

  // 로그인
  const onFinish = async (fieldValues: AccountVO) => {
    setLoading(true);

    try {
      // next-auth signIn result
      const result = await signIn("credentials", {
        redirect: false,
        id: fieldValues?.id,
        pw: fieldValues?.pw,
      });

      if (!result?.error) {
        router.push(`/workplace/1`); // [임시] 메인 화면으로 이동
      } else {
        switch (result.error) {
          case "908":
            ALERT("비밀번호가 일치하지 않습니다.");
            break;
          default:
            ALERT("로그인에 실패하였습니다.");
            break;
        }
        form.setFieldsValue({
          id: null,
          pw: null,
        });
      }

      setLoading(false);
    } catch (error) {}
  };

  useEffect(() => {
    // 로그인 화면 진입 시 토큰 초기화
    deleteCookie("accessToken");
  }, []);

  return (
    <div className={"loginFullArea"}>
      <Form className={"loginFormArea"} form={form} onFinish={onFinish}>
        <div className={"loginFormTitleArea"}>
          <Typography.Title>Login</Typography.Title>
        </div>

        <div className={"loginFormItemArea"}>
          <Form.Item
            name={"id"}
            rules={[{ required: true, message: "아이디를 입력해주세요." }]}
          >
            <Input size={"large"} placeholder={"아이디"} />
          </Form.Item>
          <Form.Item
            name={"pw"}
            rules={[{ required: true, message: "비밀번호를 입력해주세요." }]}
          >
            <Input.Password size={"large"} placeholder={"비밀번호"} />
          </Form.Item>
        </div>

        <div className={"loginButtonArea"}>
          <Button
            type={"primary"}
            htmlType={"submit"}
            size={"large"}
            style={{ width: "100%" }}
            loading={loading}
          >
            Login
          </Button>
        </div>
      </Form>
    </div>
  );
}
